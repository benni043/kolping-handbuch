export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    id: number;
    password: string;
  }>(event);

  const password_hash = await hashPassword(body.password);

  const sql = usePostgres();

  await sql`UPDATE users SET password_hash = ${password_hash} WHERE id = ${body.id}`;

  event.waitUntil(sql.end());
});
