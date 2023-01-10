import { useEffect, useState } from "react";

export function Table<T extends { [key in keyof T]: T[key] }>({
  items,
  rowKeyProp
}: TableProps<T>) {
  const itemKeys = Object.keys(items[0]).map(key => key as keyof T);
  const columnNames = itemKeys.map(key => String(key));

  const columns = columnNames.map(key => (
    <th key={key} scope="col">
      {key}
    </th>
  ));

  const rows = items.map(item => {
    return (
      <tr key={`${item[rowKeyProp]}`}>
        {columnNames.map((col, i) =>
          i === 0 ? (
            <th key={col} scope="row">{`${item[itemKeys[i]]}`}</th>
          ) : (
            <td key={col}>{`${item[itemKeys[i]]}`}</td>
          )
        )}
      </tr>
    );
  });

  return (
    <table className="table">
      <thead>
        <tr>{columns}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

interface TableProps<T extends { [key in keyof T]: T[key] }> {
  items: T[];
  rowKeyProp: keyof T;
}
