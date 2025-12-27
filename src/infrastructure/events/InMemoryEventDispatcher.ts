import { singleton, inject } from 'tsyringe';
import winston from 'winston';
import { DomainEvent } from '../../domain/shared/events/DomainEvent.interface';
import { IEventDispatcher, EventHandler } from '../../domain/shared/events/IEventDispatcher.interface';

@singleton()
export class InMemoryEventDispatcher implements IEventDispatcher {
  private handlers: Map<string, EventHandler[]> = new Map();

  constructor(@inject('Logger') private logger: winston.Logger) {}

  async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];

    for (const handler of handlers) {
      try {
        await handler.handle(event);
      } catch (error) {
        this.logger.error({
          location: 'InMemoryEventDispatcher',
          eventName: event.eventName,
          code: 'EVENT_HANDLER_ERROR',
          message: error instanceof Error ? error.message : String(error)
        } as any);
      }
    }
  }

  register(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }
}
