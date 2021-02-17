import { Publisher, Subjects, TicketCreatedEvent } from "@4b-wins/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}

