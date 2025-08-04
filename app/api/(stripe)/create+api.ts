import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, amount } = body;

    if (!name || !email || !amount) {
      return new Response(JSON.stringify({ error: "Missing fields", status: 400 }), {
        status: 400,
      });
    }

    let customer;
    const existingCustomer = await stripe.customers.list({ email });

    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({ name, email });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100,
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return new Response(JSON.stringify({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    }), {
      status: 200,
    });

  } catch (error: any) {
    console.error("❌ Stripe route error:", error.message, error.stack);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error.message,
    }), {
      status: 500,
    });
  }
}


// import { Stripe } from 'stripe'

// const stripe = new Stripe("")

// export async function POST(request: Request) {
//     const body = await request.json()
//     const { name, email, amount } = body

//     if (!name || !email || !amount) {
//         return new Response(JSON.stringify({ error: "Please enter a valid email", status: 400 }))
//     }

//     let customer

//     const existingCustomer = await stripe.customers.list({ email })

//     if (existingCustomer.data.length > 0) {
//         customer = existingCustomer.data[0]
//     } else {
//         const newCustomer = await stripe.customers.create({ name, email })

//         customer = newCustomer
//     }

//     const ephemeralKey = await stripe.ephemeralKeys.create(
//         { customer: customer.id },
//         { apiVersion: '2025-01-27.acacia' }
//     );
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: parseInt(amount) * 100,
//         currency: 'usd',
//         customer: customer.id,
//         // payment_method_types: ['card'],
//         automatic_payment_methods: { 
//             enabled: true,
//             allow_redirects: "never" 
//         },
//     });

//     return new Response(JSON.stringify({
//            paymentIntent: paymentIntent.client_secret,
//         ephemeralKey: ephemeralKey.secret,
//         customer: customer.id
//     }));
// }

// // app.post('/payment-sheet', async (req, res) => {
// //   // Use an existing Customer ID if this is a returning customer.
// //   const customer = await stripe.customers.create();
// //   const ephemeralKey = await stripe.ephemeralKeys.create(
// //     {customer: customer.id},
// //     {apiVersion: '2025-01-27.acacia'}
// //   );
// //   const paymentIntent = await stripe.paymentIntents.create({
// //     amount: 1099,
// //     currency: 'eur',
// //     customer: customer.id,
// //     // In the latest version of the API, specifying the `automatic_payment_methods` parameter
// //     // is optional because Stripe enables its functionality by default.
// //     automatic_payment_methods: {
// //       enabled: true,
// //     },
// //   });

// //   res.json({
// //     paymentIntent: paymentIntent.client_secret,
// //     ephemeralKey: ephemeralKey.secret,
// //     customer: customer.id,
// //     publishableKey: ''
// //   });
// // });