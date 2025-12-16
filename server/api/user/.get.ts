import { usePostgres } from "~~/server/utils/postgres";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.role! !== "admin")
    sendError(
      event,
      createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      }),
    );

  const sql = usePostgres();

  const response = await sql`SELECT id, username, role FROM users`;

  event.waitUntil(sql.end());

  if (!response)
    throw createError({
      statusCode: 401,
      message: "something went wrong",
    });

  return {
    statusCode: 200,
    data: response,
  };
});
