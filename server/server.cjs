const express = require('express');
const axios = require('axios');
const cors = require('cors'); // <-- Hii ndo ilikuwa missing
require('dotenv').config();

const app = express();
app.use(cors()); // <-- Enable CORS
app.use(express.json());

const { CONSUMER_KEY, CONSUMER_SECRET, BUSINESS_SHORTCODE, PASSKEY } = process.env;

const baseURL = 'https://sandbox.safaricom.co.ke';

const getAccessToken = async () => {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  const res = await axios.get(`${baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });

  return res.data.access_token;
};

const generateTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  const hour = (`0${date.getHours()}`).slice(-2);
  const minute = (`0${date.getMinutes()}`).slice(-2);
  const second = (`0${date.getSeconds()}`).slice(-2);
  return `${year}${month}${day}${hour}${minute}${second}`;
};

app.post('/stk-push', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();

    const password = Buffer.from(`${BUSINESS_SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const stkData = {
      BusinessShortCode: BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: req.body.amount || 1,
      PartyA: req.body.phone,
      PartyB: BUSINESS_SHORTCODE,
      PhoneNumber: req.body.phone,
      CallBackURL: 'https://mydomain.com/callback', // You can replace with Ngrok URL
      AccountReference: 'DevSoko',
      TransactionDesc: 'Payment for project'
    };

    const response = await axios.post(`${baseURL}/mpesa/stkpush/v1/processrequest`, stkData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('STK Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'STK Push failed' });
  }
});

app.get("/", (req, res) => {
  res.send("M-Pesa API Backend is running");
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
