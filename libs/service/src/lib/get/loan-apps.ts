import type { GetResultFail } from "../response-handler/response-handler";
import { processResponse } from "../response-handler/response-handler";
import { get as filmGet } from "./film";

/**
 * Gets a page of loan apps and all their associated resources.
 */
export async function get(
  options?: GetOptions
): Promise<GetResultFail | GetAllLoanAppsResult> {
  const { onUpdate, page, previousResult } = options ?? {};

  let result = previousResult;
  if (!result) {
    const urlLeft = "https://swapi.dev/api/";
    const response = await fetch(page ?? `${urlLeft}starships`);
    result = await processResponse<LoanAppResponseBody>(response, "json");
  }

  if (!result.ok) {
    return result;
  }

  if (onUpdate) {
    /*
     * Now that we have the starships we need to get the referenced film data.
     */

    // This map will be used to make sure that data for each film is only
    // requested once.
    const filmMap: Record<string, string> = {};
    // Make a copy of the starships data, this will be mutated later and passed
    // back to the owner via the `onUpdate` callback.
    const resultWithFilmUrls: GetAllLoanAppsResult = JSON.parse(
      JSON.stringify(result)
    );

    // eslint-disable-next-line no-inner-declarations
    function fetchFilm(filmUrl: string) {
      if (Object.keys(filmMap).includes(filmUrl)) {
        return;
      }

      filmMap[filmUrl] = "working...";

      filmGet(filmUrl).then(filmGetResponse => {
        if (!filmGetResponse.ok) {
          return;
        }

        filmMap[filmUrl] = filmGetResponse.body.title;

        const nextUpdateResult: GetAllLoanAppsResult = JSON.parse(
          JSON.stringify(resultWithFilmUrls)
        );

        nextUpdateResult.body.results.forEach(loanApp =>
          loanApp.films.forEach((f, i) => {
            loanApp.films[i] = filmMap[f] || "working...";
          })
        );

        // We don't want anyone to mutate our data, so give them a copy.
        onUpdate && onUpdate(nextUpdateResult);
      });
    }

    /*
     * Remove the references from the starships data, these are being returned by
     * previous async code.
     */
    result.body.results.forEach(loanApp => {
      loanApp.films.forEach((filmUrl, i) => {
        loanApp.films[i] = "working...";
        fetchFilm(filmUrl);
      });
    });
  }

  return {
    body: result.body,
    ok: true
  };
}

export interface LoanApp {
  cost_in_credits: string;
  created: string;
  crew: string;
  edited: string;
  films: string[];
  hyperdrive_rating: string;
  length: string;
  MGLT: string;
  manufacturer: string;
  max_atmosphering_speed: string;
  model: string;
  name: string;
  passengers: string;
  pilots: string[]; // fetch
  starship_class: string;
  url: string;
}

export interface GetAllLoanAppsResult {
  ok: true;
  body: LoanAppResponseBody;
}

interface GetOptions {
  /**
   * If provided requests for loan app related resources will be made and
   * updated results will be provided through the `onUpdate` callback.
   */
  onUpdate?: (result: GetAllLoanAppsResult) => void;
  /**
   * If provided will fetch paginated loan apps for a specific page using a page
   * cursor URL.
   */
  page?: URL;
  /**
   * Since getting complete loan apps requires requests for multiple resources
   * pass in an existing `get` result and it will be used to determine which
   * resources are missing and fetch them.
   */
  previousResult?: GetResultFail | GetAllLoanAppsResult;
}

interface LoanAppResponseBody {
  count: number;
  next: string | null;
  previous: string | null;
  results: LoanApp[];
}
