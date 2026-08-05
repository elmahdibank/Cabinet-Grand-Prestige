import { neon } from '@neondatabase/serverless';

// GET /api/requests — liste toutes les demandes de RDV
export async function onRequestGet(context) {
  try {
    const sql = neon(context.env.NEON_DATABASE_URL);
    const rows = await sql`SELECT * FROM rdv_requests ORDER BY created_at DESC`;
    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST /api/requests — crée une nouvelle demande de RDV
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const sql = neon(context.env.NEON_DATABASE_URL);
    const rows = await sql`
      INSERT INTO rdv_requests (customer_name, phone, service_type, preferred_date, preferred_time, description)
      VALUES (${body.customer_name}, ${body.phone}, ${body.service_type}, ${body.preferred_date}, ${body.preferred_time}, ${body.description})
      RETURNING *`;
    return new Response(JSON.stringify(rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
