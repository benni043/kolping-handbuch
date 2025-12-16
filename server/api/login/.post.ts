import { z } from "zod";
import { usePostgres } from "~~/server/utils/postgres";

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(
    event,
    bodySchema.parse,
  );

  const sql = usePostgres();

  const [response] =
    await sql`SELECT * FROM users WHERE username = ${username}`;

  event.waitUntil(sql.end());

  if (!response)
    throw createError({
      statusCode: 401,
      message: "Bad credentials - user does not exist",
    });

  const ok = await verifyPassword(response.password_hash, password);

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
