import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from "../../services/stripe";
import { saveSubscription } from './_lib/manageSubscription';

//No cmd na pasta onde esta o executavel exe do stripe
//stripe listen --forward-to localhost:3000/api/webhooks         
//esse comando é usado na CLI do //stripe


async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }
    return Buffer.concat(chunks);
}

// next entende que toda requisição esta vindo como um json ou como envio de um formulario
// mas nesse caso a requisição esta vindo como uma stream , então temos que desabilitar esse entendimento padrão
export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvent = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            res.status(400).send(`Webhook error: ${err.message}`);
        }

        const { type } = event;

        if (relevantEvent.has(type)) {
            try {
                switch (type) {
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':

                        const subscription = event.data.object as Stripe.Subscription;

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        );

                        break;

                    case 'checkout.session.completed':

                        const checkoutSession = event.data.object as Stripe.Checkout.Session
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        )
                        break;
                    default:
                        throw new Error('Unhandled event.')
                }
            } catch (err) {
                console.log(err)
                return res.status(400).json({ error: `Webhook handler failed: ${err.message}.` })
            }
        }

        res.json({ received: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}