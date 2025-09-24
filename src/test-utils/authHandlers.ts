// handlers.ts
import { graphql } from "msw";

export const handlers = [
  graphql.query("PostUserDetailsResponse", (req, res, ctx) => {
    return res(
      ctx.data({
        PostUserDetailsResponse: {
          sessionCreated: "2024-01-01",
          sessionExpires: "2024-12-31",
          success: true,
          user: {
            _id: "1",
            name: "Nothile Moyo",
            email: "nothile@example.com",
            password: "secret",
            confirmPassword: "secret",
            status: "active",
            posts: [],
          },
        },
      }),
    );
  }),
];
