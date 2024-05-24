import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CommonRequest } from 'src/types/request'
import { Logger } from '@nestjs/common';

import { Team, TeamDocument } from './schemas/team.schema'
import { LicenseKey, LicenseKeyDocument } from './schemas/license_key.schema'
import { JwtService } from '@nestjs/jwt'
import { LicenseKeyDecoded, LicenseKeyStatus, TeamViewData } from './types'
import { getTeamViewData } from './helpers'
import { MailService } from '../Mail/Mail.service'
import { UserTokenPayload, UserViewData } from '../Users/types'
import { UsersService } from '../Users/Users.service'
import { User, UserDocument } from '../Users/schemas/user.schema'
import { getUserViewData } from '../Users/helpers'

@Injectable()
export class TeamsService {
  constructor(
    private mailService: MailService,
    private usersService: UsersService,
    @InjectModel(Team.name)
    private teamsModel: Model<TeamDocument>,
    @InjectModel(LicenseKey.name)
    private licenseKeyModel: Model<LicenseKeyDocument>,
    @InjectModel(User.name)
    private usersModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: CommonRequest,
  ) {}

  public async createTeam(teamName: string, license_key: string): Promise<string> {
    const isLicenseValid = this.isValidLicenseKey(license_key);
    const decodedLicenseKey = this.jwtService.decode(license_key) as LicenseKeyDecoded | null;

    if (!isLicenseValid || !decodedLicenseKey) {
        throw new BadRequestException({
            message: 'License key is invalid.',
        })
    }

    const key = await this.licenseKeyModel.findById(decodedLicenseKey._id);

    if (!key) {
        throw new BadRequestException({
            message: 'License key is invalid.',
        })
    }

    const sameNameTeamExist = await this.teamsModel.exists({name: teamName})

    if (sameNameTeamExist) {
      throw new BadRequestException({
        message: 'Team with such name is already exist.',
      })
    }

    const user = this.request.user
    const team = await this.teamsModel.create({_id: new mongoose.Types.ObjectId(), name: teamName, members: [user._id], owner_id: user._id, created: Date.now(), license_key_id: key._id})
    
    await this.licenseKeyModel.updateOne({_id: key._id}, { status: LicenseKeyStatus.Active})

    return String(team._id)
  }

  public async deleteTeam(teamId: string): Promise<string> {
    const team = await this.teamsModel.findOne({_id: teamId})

    const user = this.request.user

    if (user._id !== String(team?.owner_id)) {
      throw new BadRequestException({
        message: 'You have no permissions to do that.',
      })
    }

    await team?.delete()

    return String(team?._id);
  }

  public generateLicenseKey(limit: number): {token: string, _id: mongoose.Types.ObjectId} {
    const data = {
        limit,
        _id: new mongoose.Types.ObjectId(),
    }

    const token = this.jwtService.sign(data, {secret: process.env.LICENSE_KEY_SECRET});

    return {token, _id: data._id}
  }

  public async createLicenseKey(payment_token: string): Promise<string> {
    if (payment_token !== 'test') { // for test
        throw new BadRequestException({
            message: 'Invalid payment token.',
        })
    }

    const {token, _id} = this.generateLicenseKey(50); // for test
    const key = {
        _id,
        token,
        status: LicenseKeyStatus.Ready,
        created: Date.now(),
    }

    await this.licenseKeyModel.create(key)

    return key.token
  }

  public async getMyTeams(): Promise<TeamViewData[]> {
    const user = this.request.user

    const teams = await this.teamsModel.find({ members: user._id})

    return teams.map(getTeamViewData);
  }

  public async addTeamMember(teamId: string, memberId: string): Promise<string> {
    const team = await this.teamsModel.findOne({_id: teamId})

    console.log(team)

    const user = this.request.user

    if (user._id !== String(team?.owner_id)) {
      throw new BadRequestException({
        message: 'You have no permissions to do that.',
      })
    }

    await team?.update({members: [...team?.members, memberId]})

    return memberId;
  }

  public async removeTeamMember(teamId: string, memberId: string): Promise<string> {
    const team = await this.teamsModel.findOne({_id: teamId})

    const user = this.request.user

    if (!team || (user._id !== String(team?.owner_id) && user._id !== memberId)) {
      throw new BadRequestException({
        message: 'You have no permissions to do that.',
      })
    }

    await team.update({members: team.members.filter(id => id !== memberId)})

    return memberId;
  }

  public async getTeamMembers(teamId: string): Promise<UserViewData[]> {
    const team = await this.teamsModel.findOne({_id: teamId})

    const users = await this.usersModel.find({_id: { $in: team?.members ?? [] }})

    return users.map(getUserViewData);
  }

  public async sendEmailWithLicenseKey(user: UserTokenPayload): Promise<void> {
    const key = await this.createLicenseKey('test')
    const userData = await this.usersService.getUserDataById(user._id)

    await this.mailService.sendLicenseKey(userData, key)
  }

  public isValidLicenseKey(license_key: string): boolean {
    try {
        this.jwtService.verify(license_key, {secret: process.env.LICENSE_KEY_SECRET});
        return true;
    } catch {
        return false;
    }
  }
}
