import { UseGuards } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSockets {
  @WebSocketServer()
  server: Server

  constructor(private readonly messagesService: MessagesService) {}

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
  @SubscribeMessage('connect-to-channel')
  connectToChannel(
    @MessageBody() payload: { channelId: string; user: UserTokenPayload },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(payload.channelId)
  }

  @SubscribeMessage('test')
  test(@MessageBody() payload: string): void {
    console.log('test', payload)
  }
}
