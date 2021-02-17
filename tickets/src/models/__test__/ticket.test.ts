import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async(done) => {

    const ticket: any = Ticket.build({
       title: "concert",
       price: 5,
       userId: "123",
    });

    await ticket.save();

    const firstInstance: any = await Ticket.findById(ticket.id);
    const secondInstance: any = await Ticket.findById(ticket.id);

    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    await firstInstance!.save();

    /* this is how it should be done */
    // expect(async () => {
    //     await secondInstance!.save();
   // }).toThrow();
   try {
    await secondInstance!.save();
   } catch (error) {
       return done();
   }

   throw new Error("Should not reach this point");

});

it("increment the version number on multiple saves", async() => {
    const ticket: any = Ticket.build({
        title: "concert",
        price: 5,
        userId: "123",
     });

     await ticket.save();
     expect(ticket.version).toEqual(0);
     
     await ticket.save();
     expect(ticket.version).toEqual(1);

     await ticket.save();
     expect(ticket.version).toEqual(2);
});
   