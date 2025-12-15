import { singleton } from 'tsyringe';
import { DomainEvent } from '../../domain/shared/events/DomainEvent.interface';
import { IEventDispatcher, EventHandler } from '../../domain/shared/events/IEventDispatcher.interface';

@singleton()
export class InMemoryEventDispatcher implements IEventDispatcher {
  private handlers: Map<string, EventHandler[]> = new Map();

  async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) || [];

    for (const handler of handlers) {
      try {
        await handler.handle(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventName}:`, error);
      }
    }
  }

  register(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }
}
