import { Inject, Injectable } from '@nestjs/common';
import { IMessagesRepository } from './messages.repository';

export interface IMessagesService {
  findOne(id: string);
  findAll();
  create(content: string);
}

@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    @Inject('IMessagesRepository') private messagesRepo: IMessagesRepository,
  ) {}

  async findOne(id: string) {
    return await this.messagesRepo.findOne(id);
  }

  async findAll() {
    return await this.messagesRepo.findAll();
  }

  async create(content: string) {
    return await this.messagesRepo.create(content);
  }
}
