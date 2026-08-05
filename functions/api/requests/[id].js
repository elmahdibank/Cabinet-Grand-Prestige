import { neon } from '@neondatabase/serverless';

// PATCH /api/requests/{id} — met à jour le statut et/ou les notes internes
export async function onRequestPatch(context) {
  try {
    const id = context.params.id;
    const body = await context.request.json();
    const sql = neon(context.env.NEON_DATABASE_URL);

    let rows;
    if (body.status !== undefined && body.notes !== undefined) {
      rows = await sql`UPDATE rdv_requests SET status=${body.status}, notes=${body.notes} WHERE id=${id} RETURNING *`;
    } else if (body.status !== undefined) {
      rows = await sql`UPDATE rdv_requests SET status=${body.status} WHERE id=${id} RETURNING *`;
    } else if (body.notes !== undefined) {
      rows = await sql`UPDATE rdv_requests SET notes=${body.notes} WHERE id=${id} RETURNING *`;
    } else {
      return new Response(JSON.stringify({ error: 'Aucun champ à mettre à jour' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
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
