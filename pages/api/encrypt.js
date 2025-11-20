import crypto from 'crypto';

function getKey(token) {
  return crypto.createHash('md5').update(token).digest('hex'); // 32-byte key
}
function encrypt(json_data, key) {

  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(json_data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const ivBuffer = Buffer.from(iv);
  const encryptedBuffer = Buffer.from(encrypted, 'hex');

  const final = Buffer.concat([ivBuffer, encryptedBuffer]);

  return final.toString('base64');
}

function decrypt(encrypted_text, key) {

  const buffer = Buffer.from(encrypted_text, 'base64');

  const iv = buffer.subarray(0, 16);
  const encryptedData = buffer.subarray(16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export default function handler(req, res) {
  const token = 'bd6fdc23c5a1d31a9d8a9d934eeeac08';
  const key = getKey(token);

  if (req.method === 'POST') {
    try {
      const { data, action } = req.body;

      if (action === 'encrypt') {
        const encrypted = encrypt(JSON.stringify(data), key);
        return res.status(200).json({ encrypted });
      }

      if (action === 'decrypt') {
        const decrypted = decrypt(data, key);
        return res.status(200).json({ decrypted: JSON.parse(decrypted) });
      }

      return res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
