import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chats: Repository<Chat>,
  ) {}

  findAllChats(): Promise<Chat[]> {
    return this.chats.find();
  }

  createMsg(chat: Chat): Promise<Chat> {
    return this.chats.save(chat);
  }
}
