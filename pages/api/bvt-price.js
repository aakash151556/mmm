import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { data } = await axios.get(
      'https://api.mexc.com/api/v3/ticker/price?symbol=BVTUSDT' 
    );
    res.status(200).json(data);
  } catch (error) {
    console.error('MEXC Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
}
