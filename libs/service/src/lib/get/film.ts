import type { GetResultFail } from "../response-handler/response-handler";
import { processResponse } from "../response-handler/response-handler";

export async function get(
  film: string | number
): Promise<GetResultFail | GetFilmResult> {
  const urlLeft = "https://swapi.dev/api/";

  const response = await fetch(
    typeof film === "number" ? `${urlLeft}films/${film}/` : film
  );
  const result = await processResponse<FilmResponseBody>(response, "json");

  if (!result.ok) {
    return result;
  }

  return {
    body: result.body,
    ok: true
  };
}

interface FilmResponseBody {
  title: string;
}

export interface GetFilmResult {
  ok: true;
  body: FilmResponseBody;
}
