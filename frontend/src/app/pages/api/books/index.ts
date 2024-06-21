import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI || '' );
    await client.connect();
  }
  return client;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await connectToDatabase();
  const db = client.db('bookstore');
  const collection = db.collection('books');

  switch (req.method) {
    case 'GET':
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      const books = await collection.find().skip(skip).limit(limit).toArray();
      const totalBooks = await collection.countDocuments();
      const totalPages = Math.ceil(totalBooks / limit);

      res.status(200).json({ books, totalPages });
      break;
    case 'POST':
      const { title, description, cover } = req.body;
      if (!title || !description || !cover) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
      await collection.insertOne({ title, description, cover });
      res.status(201).json({ message: 'Book created' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};

export default handler;
