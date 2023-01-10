import { useEffect, useState } from "react";
import type { LoanApp } from "@loan-app/service";
import { get } from "@loan-app/service";
import { Table } from "./table";

export function LoanAppsTable() {
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
    const result = await get(update => {
      if (update.ok) {
        setItems(update.body.results);
      }
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
