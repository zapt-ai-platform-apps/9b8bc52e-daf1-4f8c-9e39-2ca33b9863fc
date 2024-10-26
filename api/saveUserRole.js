import { users } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { role } = req.body;

    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.id, user.id));

    if (existingUser) {
      // Update user role
      await db.update(users).set({ role }).where(eq(users.id, user.id));
    } else {
      // Insert new user
      await db.insert(users).values({
        id: user.id,
        email: user.email,
        role,
      });
    }

    res.status(200).json({ message: 'Role saved successfully' });
  } catch (error) {
    console.error('Error saving user role:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error saving user role' });
    }
  }
}