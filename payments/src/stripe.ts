import Stripe from "stripe";

export const stripe: any = new Stripe(process.env.STRIPE_ENV!, {
    apiVersion: "2020-08-27",
});
