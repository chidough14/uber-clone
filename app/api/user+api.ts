import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
    console.log("🟢 API HIT: /api/user"); // 👈 Add this
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { name, email, clerkId } = await request.json();

  if (!name || !email || !clerkId) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await sql`
      INSERT INTO users ( name, email, clerk_id ) VALUES (${name},${email},${clerkId})
    `

    return new Response(JSON.stringify({data: response}), { status: 201 })

  } catch (error) {
    console.error('Error in POST request:', error);
    return Response.json({data: error}, {status: 500})
  }
}