import { Inject, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { MessageBody, SubscribeMessage } from '@nestjs/websockets/decorators'
import { Server } from 'socket.io'
import { CommonRequest } from 'src/types/request'

import { AuthGuard } from '../Auth/guards/AuthGuard'
import { TSendMessageRequest } from '../Messages/types'

@WebSocketGateway()
export class WebSockets {
  @WebSocketServer()
  server: Server

  constructor(@Inject(REQUEST) private readonly request: CommonRequest) {}

  @UseGuards(AuthGuard)
  @SubscribeMessage('send-message')
  sendMessage(@MessageBody() payload: TSendMessageRequest): void {
    console.log('send-message', payload, this.request.user)
  }

  @SubscribeMessage('test')
  test(@MessageBody() payload: string): void {
    console.log('test', payload)
  }
}
