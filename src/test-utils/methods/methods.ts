// Mock our fetch functioality
export const createFetchResponse = (data: unknown, status = 200, ok = true): Response => {
  return {
    ok,
    status,
    json: async () => data,
  } as Response;
};
