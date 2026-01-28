import { usePostgres } from "~~/server/utils/postgres";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username: string;
    password: string;
  }>(event);

  const sql = usePostgres();

  const [response] =
    await sql`SELECT * FROM users WHERE username = ${body.username.toLowerCase()}`;

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

  await sql`UPDATE users SET last_login = NOW() WHERE username = ${body.username.toLowerCase()}`;

  const [last_login] = await sql<{ last_login: Date | null }[]>`
    SELECT last_login
    FROM users
    WHERE username = ${body.username.toLowerCase()}
  `;
  event.waitUntil(sql.end());

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
      maxAge: 60 * 60 * 24 * 7,
      cookie: {
        secure: import.meta.dev ? false : true,
      },
    },
  );

  return {
    last_login: last_login?.last_login?.toISOString() ?? null,
  };
});
