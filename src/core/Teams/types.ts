import { ApiProperty } from "@nestjs/swagger";

export enum LicenseKeyStatus {
    Active = 'active',
    Ready = 'ready',
    Inactive = 'inactive',
}

export interface LicenseKeyDecoded {
    _id: string;
    limit: number;
}

export class TCreateTeamData {
    @ApiProperty({ type: String })
    teamName: string

    @ApiProperty({ type: String })
    license_key: string
}

export class TCreateLicenseKey {
    @ApiProperty({ type: String })
    payment_token: string
}

export class TeamViewData {
    @ApiProperty({ type: 'string' })
    _id: string
  
    @ApiProperty({ type: 'string' })
    name: string
}

export class TeamListResponse {
    @ApiProperty({ type: [TeamViewData], required: true })
    teams: TeamViewData[]
}