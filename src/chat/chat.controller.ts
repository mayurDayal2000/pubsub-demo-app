import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAllChats(): Promise<Chat[]> {
    return this.chatService.findAllChats();
  }

  @Post()
  createMsg(@Body(new ValidationPipe()) chat: Chat): Promise<string> {
    return this.chatService.createMsg(chat);
  }
}
