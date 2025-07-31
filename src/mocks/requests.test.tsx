import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:4000/graphql/auth", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          PostUserDetailsResponse: {
            sessionCreated: "2025-07-16 19:19:34",
            sessionExpires: "2025-07-30 19:19:34",
            user: {
              name: "Nothile Moyo",
              email: "nothile1@gmail.com",
              password: "...",
              status: "active",
            },
            success: true,
          },
        },
      }),
    );
  }),
];
