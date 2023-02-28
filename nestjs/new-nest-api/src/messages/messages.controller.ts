import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateMessageDto } from './dtos/create-message.dt';
import { IMessagesService } from '../messages/messages.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(
    @Inject('IMessagesService') private messagesService: IMessagesService,
  ) {}

  @Get('/:id')
  async getMessage(@Param('id') id: string) {
    const message = await this.messagesService.findOne(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  @Get()
  async listMessages() {
    const messages = await this.messagesService.findAll();

    if (!messages) {
      throw new NotFoundException('No messages found');
    }

    return messages;
  }

  @Post()
  async createMessage(@Body() body: CreateMessageDto) {
    return await this.messagesService.create(body.content);
  }
}
