import { usePostgres } from "~~/server/utils/postgres";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role! !== "admin") {
    return sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      }),
    );
  }

  const sql = usePostgres();

  const [response] =
    await sql`SELECT id, username, role FROM users WHERE username = 'user'`;

  console.log(response);

  event.waitUntil(sql.end());

  if (!response)
    throw createError({
      statusCode: 401,
      message: "something went wrong",
    });

  return {
    statusCode: 200,
    body: {
      data: response,
    },
  };
});
