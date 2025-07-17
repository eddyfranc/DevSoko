const express = require('express');
const axios = require('axios');
const cors = require('cors');
const moment = require('moment');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// ✅ Safaricom Daraja credentials
const consumerKey = 'SLamhyK1LdXSFGIJgkuCbnS7mqEil5SUcV29KHz6NfyoRYKh';
const consumerSecret = 'RpNkWanwU4XWFYbGEvdE1qtnW3wZpjv1nU4SU4zYgOhMGM0XWrApU4tzSc3qKnSo';
const shortcode = 'N/A'; // 🔴 Replace once available (e.g. 174379)
const passkey = 'Xl0S0MVEQqnNybF2JEONQsfe2SW/YcclO9fnf5ehyr4CE2Pc9FW7+Qpgoc7rOxD0yxFgoCJxj4F6/LE3b6L6LX16IT7xDGYYN8juymIhB32xb+t7eQVHn1XG8lEYHOJLOw2M6TZHb+8vVx5GSCB6ryYYtEtt1dGxLK4vGjjRvmam2a2GwBKY0g+BedooF3Afgc/Sp41ZkK79zgk45+23q8EN52iB+0tOkWm7vGINLYynEa6bmKdASTjP4Mn4R4D+ahwWbsPmv1Y6PerxDQGmmbMjDuBMbzjy9dyQ72kKEiKGU1NPUi3hhygJLYWB28kKuIv9nifjc2v9Ttg7iyNN+A==';     // 🔴 Replace once available

const auth_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const stkPushURL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

app.post('/stk-push', async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // Step 1: Get Access Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const { data: authData } = await axios.get(auth_url, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    const access_token = authData.access_token;

    // Step 2: Initiate STK Push
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: "https://mydomain.com/callback", // You can dummy this
      AccountReference: "DevSoko",
      TransactionDesc: "Project Payment"
    };

    const { data: stkResponse } = await axios.post(stkPushURL, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    res.status(200).json({ message: 'STK push sent', data: stkResponse });

  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong', details: error.response?.data || error.message });
  }
 

});

app.listen(port, () => {
  console.log(`🚀 M-Pesa API Backend running on http://localhost:${port}`);
});
