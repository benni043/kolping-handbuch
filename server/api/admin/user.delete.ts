export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    id: number;
  }>(event);

  const sql = usePostgres();

  await sql`DELETE FROM users WHERE id = ${body.id}`;

  event.waitUntil(sql.end());

  return {
    success: true,
  };
});
