import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

/**
 * Type safety enforcement for the serializer. This interface defines
 * a 'class'. Basically, any object
 */
interface ClassConstructor {
  new (...args: any[]): object;
}

/**
 * This decorator can be used at the controller or route level.
 * The latter is for when different dtos are needed in the routes.
 * It should be used at the controller level when a uniforme response
 * is enough
 * @param dto
 * @returns the projected dto (to be serialized) from the original entity
 */
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/**
 * The purpose of this interceptor is to project certain entities
 * holding sensitive or irrelevant data into simpler dtos
 */
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Code to execute before a request is handled by the request handler

    return next.handle().pipe(
      map((data: any) => {
        return projectResponse(this.dto, data);
      }),
    );
  }
}

export function projectResponse(type: ClassConstructor, data: any) {
  return plainToInstance(type, data, {
    excludeExtraneousValues: true,
  });
}
