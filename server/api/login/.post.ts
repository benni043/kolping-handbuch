import { usePostgres } from "~~/server/utils/postgres";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username: string;
    password: string;
  }>(event);

  const sql = usePostgres();

  const [response] =
    await sql`SELECT * FROM users WHERE username = ${body.username.toLowerCase()}`;

  event.waitUntil(sql.end());

  if (!response)
    throw createError({
      statusCode: 401,
      message: "Bad credentials - user does not exist",
    });

  const ok = await verifyPassword(response.password_hash, body.password);

  if (!ok)
    throw createError({
      statusCode: 401,
      message: "Bad credentials - wrong user/password comibnation",
    });

  await setUserSession(
    event,
    {
      user: {
        id: response.id,
        username: response.username,
        role: response.role,
      },
    },
    {
      cookie: {
        secure: import.meta.dev ? false : true,
      },
    },
  );

  return {};
});
