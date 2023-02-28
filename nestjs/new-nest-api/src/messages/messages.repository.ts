import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { Message } from './dtos/message-dto';

export interface IMessagesRepository {
  findOne(id: string);
  findAll();
  create(content: string);
}

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  _storePath = 'messages.json';

  public async findOne(id: string): Promise<Message> {
    const store = await this.getMessagesStore();
    return store.get(id);
  }

  public async findAll(): Promise<Message[]> {
    const store = await this.getMessagesStore();
    return Array.from(store.values());
  }

  public async create(content: string): Promise<Message> {
    const store = await this.getMessagesStore();

    const id = Math.floor(Math.random() * 999).toString();
    store.set(id, { id, content });

    await writeFile(this._storePath, JSON.stringify(Object.fromEntries(store)));
    return store.get(id);
  }

  fileExists = async (path) => !!(await fs.stat(path).catch(() => false));
  private async getMessagesStore(): Promise<Map<string, Message>> {
    if (!(await this.fileExists(this._storePath))) {
      await writeFile(this._storePath, '{}');
    }
    const rawMessages = await readFile(this._storePath, 'utf-8');
    return new Map(Object.entries(JSON.parse(rawMessages)));
  }
}
