import { attendance, users } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    // Check if user is a teacher
    const [userRecord] = await db.select().from(users).where(eq(users.id, user.id));

    if (!userRecord || userRecord.role !== 'teacher') {
      return res.status(403).json({ error: 'Forbidden: Access is allowed for teachers only' });
    }

    // Get attendance list
    const attendanceList = await db.select({
      userId: attendance.userId,
      timestamp: attendance.timestamp,
      email: users.email,
    })
    .from(attendance)
    .leftJoin(users, eq(attendance.userId, users.id))
    .orderBy(attendance.timestamp.desc());

    res.status(200).json(attendanceList);
  } catch (error) {
    console.error('Error getting attendance list:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error getting attendance list' });
    }
  }
}