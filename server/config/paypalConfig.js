import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox", // or 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

export default paypal;

// import paypal from "@paypal/checkout-server-sdk";

// const environment = new paypal.core.SandboxEnvironment(
//   process.env.PAYPAL_CLIENT_ID,
//   process.env.PAYPAL_CLIENT_SECRET
// );
// const PayPalEnvironment = new paypal.core.PayPalHttpClient(environment);

// export default PayPalEnvironment;
