import { DomainEvent } from './DomainEvent.interface';

export interface EventHandler {
  handle(event: DomainEvent): Promise<void>;
}

export interface IEventDispatcher {
  dispatch(event: DomainEvent): Promise<void>;
  register(eventName: string, handler: EventHandler): void;
}
