import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan: any = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222"
});

stan.on("connect", async () => {
    console.log("Publisher connected to NATS");

    const publisher: any = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: "13",
             title: "concert",
             price: 20
         });
    } catch (err) {
        console.error(err);
    }
     

    // const data: any = JSON.stringify({
    //     id: "13",
    //     title: "concert",
    //     price: 20
    // });

    // stan.publish("ticket:created", data, () => {
    //     console.log("Event published");
    // });
});