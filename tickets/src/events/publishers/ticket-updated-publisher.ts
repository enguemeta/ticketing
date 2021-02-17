import { Publisher, Subjects, TicketUpdatedEvent } from "@4b-wins/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}

