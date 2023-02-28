import { Module, Scope } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  exports: [
    {
      provide: 'IMessagesService',
      useClass: MessagesService,
      scope: Scope.REQUEST,
    },
  ],
  providers: [
    {
      provide: 'IMessagesService',
      useClass: MessagesService,
      scope: Scope.REQUEST,
    },
    {
      provide: 'IMessagesRepository',
      useClass: MessagesRepository,
      scope: Scope.REQUEST,
    },
  ],
})
export class MessagesModule {}
