import { validateRole } from "~~/shared/utils/checks";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role !== "admin")
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });

  const body = await readBody<{
    username: string;
    password: string;
    role: string;
  }>(event);

  if (!body.username || !body.password || !body.role)
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });

  if (!validatePassword(body.password))
    throw createError({
      statusCode: 400,
      statusMessage: "password requirements ignored",
    });

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

  const hashedPassword = await hashPassword(body.password);

  const sql = usePostgres();

  await sql`INSERT INTO users (username, password_hash, role) VALUES (${body.username}, ${hashedPassword}, ${body.role})`;

  event.waitUntil(sql.end());
});
