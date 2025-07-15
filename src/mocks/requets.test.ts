import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:4000/graphql/auth", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
