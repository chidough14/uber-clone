import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { id }: { id: string }) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`SELECT * FROM drivers`
    return Response.json({ data: response })

  } catch (error) {
    console.error('Error in GET request:', error);
    return Response.json({ error })
  }
}