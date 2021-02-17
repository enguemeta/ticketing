import { Publisher, Subjects, OrderCancelledEvent } from "@4b-wins/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}

