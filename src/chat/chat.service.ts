import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { PubSub } from '@google-cloud/pubsub';

// creates a client
const pubSubClient = new PubSub();
const topicName = 'projects/chat-app-with-nest/topics/chats-topic';
const subName = 'projects/chat-app-with-nest/subscriptions/chats-sub';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private chats: Repository<Chat>,
  ) {
    this.subscribeToMsgs();
  }

  findAllChats(): Promise<Chat[]> {
    this.logger.log('Fetching all chats');
    return this.chats.find();
  }

  async createMsg(chat: Chat): Promise<string> {
    const savedMsg = await this.chats.save(chat);

    // publish msg to pub/sub
    const dataBuffer = Buffer.from(JSON.stringify(savedMsg));

    try {
      const msgId = await pubSubClient
        .topic(topicName)
        .publishMessage({ data: dataBuffer });
      this.logger.log(`Message ${msgId} published`);

      return `Message ${msgId} published`;
    } catch (error) {
      this.logger.error(
        `Received error while publishing: ${(error as Error).message}`,
      );
    }
  }

  private subscribeToMsgs() {
    const sub = pubSubClient.subscription(subName);

    sub.on('message', (msg) => {
      this.logger.log(msg.data);
      msg.ack();
    });
  }
}
