import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan: any = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    url: "http://localhost:4222"
});

stan.on("connect", () => {
    console.log("Listener connected to NATS");

    stan.on("close", () => {
        console.log("NATS connection closed!");
        process.exit();
    });
     
      new TicketCreatedListener(stan).listen();

    // TODO: has been refactored by the abstract class
    // const options: any = stan.subscriptionOptions()
    //                        .setManualAckMode(true) // this option is to loose data if something go wrong
    //                        .setDeliverAllAvailable() // all the events that have been emitted in the past
    //                        .setDurableName("orders-service");

    // const subscription: any =  stan.subscribe("ticket:created",
    //                                           "orders-service-queue-group",
    //                                           options);
    // subscription.on("message", (msg: Message) => {
    //     const data: any = msg.getData();
    //     if( typeof data === "string") {
    //         console.log(`Received event # ${msg.getSequence()} with data: ${data}`);
    //     }
    //     msg.ack(); // to tell the publisher the msg has been poccessed
    // });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());





