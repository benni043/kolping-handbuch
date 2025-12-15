export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    id: number;
    username: string;
    role: string;
  }>(event);

  const sql = usePostgres();

  await sql`UPDATE users SET username = ${body.username}, role = ${body.role} WHERE id = ${body.id}`;

  event.waitUntil(sql.end());
});
