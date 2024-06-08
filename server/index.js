require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/BusArrivalv2', async (req, res) => {
  const term = req.query.BusStopCode;
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(
    `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${term}`,
    {
      method: "GET",
      headers: {
        "AccountKey": process.env.VITE_APP_LTA_API_KEY,
        "accept": "application/json"
      }
    }
  );
  
  const text = await response.text();
  
  if (response.ok) {
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error parsing JSON' });
    }
  } else {
    res.status(500).json({ error: 'Error response from API' });
  }
});

app.listen(process.env.PORT || 3000);