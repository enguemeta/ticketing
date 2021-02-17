import { Publisher, Subjects, OrderCreatedEvent } from "@4b-wins/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}

