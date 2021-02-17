import { Publisher, Subjects, PaymentCreatedEvent } from "@4b-wins/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

}

