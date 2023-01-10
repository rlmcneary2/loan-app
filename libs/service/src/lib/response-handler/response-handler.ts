export async function processResponse<Body = unknown>(
  response: Response,
  readType: "json" | "text" | null
): Promise<GetResult<Body>> {
  if (!response.ok) {
    return { ok: false };
  }

  const result: { ok: boolean } = {
    ok: true
  };

  let body: Body;
  if (readType) {
    try {
      body = (await response[readType]()) as Body;
      (result as GetResultSuccess<Body>).body = body;
    } catch (err) {
      (result as GetResultFail).ok = false;
    }
  }

  return result as GetResultSuccess<Body>;
}

export type GetResult<Body> = GetResultFail | GetResultSuccess<Body>;

export interface GetResultFail {
  ok: false;
}

interface GetResultSuccess<Body> {
  ok: true;
  body: Body;
}
