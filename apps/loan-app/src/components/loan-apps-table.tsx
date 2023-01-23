import { useEffect, useState } from "react";
import type {
  GetResultFail,
  GetAllLoanAppsResult,
  LoanApp
} from "@loan-app/service";
import { get } from "@loan-app/service";
import { Table } from "./table";

export function LoanAppsTable({ result: propsResult }: LoanAppsTableProps) {
  const [items, setItems] = useState<LoanApp[] | null>(null);

  useEffect(() => {
    (async function () {
      const { items, ok } = await formatGetResponse();
      if (ok) {
        setItems(items);
      }
    })();
  }, []);

  if (!items) {
    return null;
  }

  async function formatGetResponse(): Promise<{
    items: LoanApp[];
    ok: boolean;
  }> {
    const result = await get({
      onUpdate: update => {
        console.log("update=", update);
        if (update.ok) {
          setItems(update.body.results);
        }
      },
      previousResult: propsResult
    });

    if (!result.ok) {
      return { items: [], ok: false };
    }

    const {
      body: { results: items }
    } = result;

    return {
      items,
      ok: true
    };
  }

  return <Table items={items} rowKeyProp="url" />;
}

export interface LoanAppsTableProps {
  // If a result is generated during SSR then provide it here to allow the
  // client-side code to catch up.
  result?: GetResultFail | GetAllLoanAppsResult;
}
