import { hashPassword } from "#imports";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const body = await readBody<{
    username: string;
    password: string;
    role: string;
  }>(event);

  const hashedPassword = await hashPassword(body.password);

  const sql = usePostgres();

  await sql`INSERT INTO users (username, password_hash, role) VALUES (${body.username}, ${hashedPassword}, ${body.role})`;

  event.waitUntil(sql.end());

  return {
    success: true,
  };
});
