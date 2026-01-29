export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const sql = usePostgres();

  const [last_login] = await sql<{ last_login: Date | null }[]>`
    SELECT last_login
    FROM users
    WHERE username = ${user.username.toLowerCase()}
  `;

  event.waitUntil(sql.end());

  return {
    last_login: last_login?.last_login?.toISOString() ?? null,
  };
});
