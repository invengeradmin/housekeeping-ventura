// app/api/housekeepingstatus.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const options = {
        method: 'GET',
        url: `https://api.cloudbeds.com/api/v1.2/getHousekeepingStatus?propertyID=${process.env.CLOUDBEDS_PROPERTY_ID}`,
        headers: {
          accept: 'application/json',
          'x-api-key': process.env.CLOUDBEDS_API_KEY
        }
      };

      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching housekeeping status:', error);
      res.status(500).json({ error: 'Error fetching data from Cloudbeds API' });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
