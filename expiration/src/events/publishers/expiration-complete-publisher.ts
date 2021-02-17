import { Subjects, Publisher, ExpirationCompleteEvent } from "@4b-wins/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
     subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
