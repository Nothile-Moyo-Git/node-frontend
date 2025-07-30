import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:4000/graphql/auth", () => {
    return HttpResponse.json({
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
    });
  }),
];
