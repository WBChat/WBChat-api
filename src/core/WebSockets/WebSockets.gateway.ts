import { UseGuards } from '@nestjs/common'
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets/decorators'
import mongoose from 'mongoose'
import { Server, Socket } from 'socket.io'
import { WsAuthGuard } from 'src/guards/WsAuthGuard'

import { MessagesService } from '../Messages/Messages.service'
import { TSendMessageRequest } from '../Messages/types'
import { UserTokenPayload } from '../Users/types'
import { ChannelsService } from '../Channels/Channels.service'
import { UsersService } from '../Users/Users.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSockets implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private clientsRooms: Record<string, string[]> = {}

  constructor(private readonly messagesService: MessagesService, private readonly channelsService: ChannelsService, private readonly usersService: UsersService) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('send-message')
  sendMessage(
    @MessageBody() payload: TSendMessageRequest & { user: UserTokenPayload },
  ): void {
    const message = {
      _id: new mongoose.Types.ObjectId(),
      text: payload.text,
      sendedDate: Date.now(),
      sender: payload.user._id,
      channel_id: payload.recipientId,
    }
    this.server.to(payload.recipientId).emit('receive-message', message)

    this.messagesService.createMessage(message)
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('edit-message')
  async editMessage(
    @MessageBody() payload: { messageId: string; text: string, channelId: string } & { user: UserTokenPayload },
  ): Promise<void> {
    await this.messagesService.editMessage(payload.messageId, payload.text, payload.user._id);

    this.server.to(payload.channelId).emit('message-edited', { payload })
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('delete-message')
  async deleteMessage(
    @MessageBody() payload: { messageId: string, channelId: string } & { user: UserTokenPayload },
  ): Promise<void> {
    await this.messagesService.deleteMessage(payload.messageId, payload.user._id);

    this.server.to(payload.channelId).emit('message-deleted', payload)
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('add-message-reaction')
  async addMessageReaction(
    @MessageBody() payload: { messageId: string, reaction: string, channelId: string } & { user: UserTokenPayload },
  ): Promise<void> {
    await this.messagesService.addMessageReaction(payload.messageId, payload.reaction, payload.user._id);

    this.server.to(payload.channelId).emit('message-reaction-added', {...payload, userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('remove-message-reaction')
  async removeMessageReaction(
    @MessageBody() payload: { messageId: string, reaction: string, channelId: string } & { user: UserTokenPayload },
  ): Promise<void> {
    await this.messagesService.removeMessageReaction(payload.messageId, payload.reaction, payload.user._id);

    this.server.to(payload.channelId).emit('message-reaction-removed', {...payload, userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('connect-user-to-call-room')
  async connectUserToCallRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string; user: UserTokenPayload },
  ): Promise<void> {
    await client.join(`call-room__${payload.channelId}`)
    await this.channelsService.addUserToCallRoom(payload.user._id, client.id, payload.channelId);
    const socketIds = await this.channelsService.getCallRoomUsers(payload.channelId)
    const userIds = Object.keys(socketIds)
    const usersList = await this.usersService.getUsersByIds(userIds)
    this.clientsRooms[client.id] = [...(this.clientsRooms[client.id] ?? []), `call-room__${payload.channelId}`]
    this.server.to(client.id).emit('start-peer-connection', {users: usersList, socketIds})
    this.server.to(`call-room__${payload.channelId}`).emit('call-room-users-list-updated', {users: usersList, socketIds })
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('disconnect-user-from-call-room')
  async disconnectUserFromCallRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string; user: UserTokenPayload },
  ): Promise<void> {
    await client.leave(`call-room__${payload.channelId}`)
    await this.channelsService.removeUserFromCallRoom(payload.user._id, payload.channelId);
    const userIds = Object.keys(await this.channelsService.getCallRoomUsers(payload.channelId))
    const usersList = await this.usersService.getUsersByIds(userIds)
    this.clientsRooms[client.id] = []
    this.server.to(`call-room__${payload.channelId}`).emit('call-room-users-list-updated', {...payload, users: usersList})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('rpc-offer-send')
  async rpcOfferSend(
    @MessageBody() payload: { offer: any, to: string; user: UserTokenPayload },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.server.to(payload.to).emit('rpc-offer-sent', {offer: payload.offer, sender: client.id, userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('rpc-answer-send')
  async rpcAnswerSend(
    @MessageBody() payload: { answer: any, to: string, user: UserTokenPayload },
  ): Promise<void> {
    this.server.to(payload.to).emit('rpc-answer-sent', {answer: payload.answer, userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('peer-update')
  async peerUpdated(
    @MessageBody() payload: { candidate: any, to: string, user: UserTokenPayload },
  ): Promise<void> {
    console.log('peer-updated', payload)
    this.server.to(payload.to).emit('peer-updated', {candidate: payload.candidate, userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('muted-audio')
  async mutedAudio(
    @MessageBody() payload: { user: UserTokenPayload, channelId: string },
  ): Promise<void> {
    this.server.to(`call-room__${payload.channelId}`).emit('muted-audio', {userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('unmuted-audio')
  async unmutedAudio(
    @MessageBody() payload: { user: UserTokenPayload, channelId: string },
  ): Promise<void> {
    this.server.to(`call-room__${payload.channelId}`).emit('unmuted-audio', {userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('muted-video')
  async mutedVideo(
    @MessageBody() payload: { user: UserTokenPayload, channelId: string },
  ): Promise<void> {
    this.server.to(`call-room__${payload.channelId}`).emit('muted-video', {userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('unmuted-video')
  async unmutedVideo(
    @MessageBody() payload: { user: UserTokenPayload, channelId: string },
  ): Promise<void> {
    this.server.to(`call-room__${payload.channelId}`).emit('unmuted-video', {userId: payload.user._id})
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('connect-to-channel')
  connectToChannel(
    @MessageBody() payload: { channelId: string; user: UserTokenPayload },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(payload.channelId)
  }

  handleDisconnect(client: Socket) {
    const rooms = this.clientsRooms[client.id]

    rooms?.forEach(async (room) => {
      const channelId = room.split('__')[1]

      const socketIds = await this.channelsService.getCallRoomUsers(channelId)

      const userId = Object.keys(socketIds).find((key) => socketIds[key] === client.id)

      if (!userId) {
        return;
      }

      this.clientsRooms[client.id] = []

      this.disconnectUserFromCallRoom(client, {user: {_id: userId, email: ''}, channelId})
    })
  }

  @SubscribeMessage('test')
  test(@MessageBody() payload: string): void {
    console.log('test', payload)
  }
}
