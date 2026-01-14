export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    id: number;
    username: string;
    role: string;
  }>(event);

  if (!validateUsername(body.username))
    throw createError({
      statusCode: 400,
      statusMessage: "username requirements ignored",
    });

  if (!validateRole(body.role))
    throw createError({
      statusCode: 400,
      statusMessage: "role requirements ignored",
    });

  const sql = usePostgres();

  await sql`UPDATE users SET username = ${body.username}, role = ${body.role} WHERE id = ${body.id}`;

  event.waitUntil(sql.end());
});
