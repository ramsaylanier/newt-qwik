import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./table.css?inline";

interface Column {
  id: string;
  hide?: boolean;
  heading?: string;
  formatData$?: any;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

export default component$(({ data, columns }: TableProps) => {
  useStyles$(styles);
  const rows: any[] = data.map((d) => {
    const row: any = {};
    columns.forEach((column) => {
      if (!column.hide) {
        const cell = column.formatData$ ? column.formatData$(d) : d[column.id];
        row[column.id] = cell;
      }
    });

    return row;
  });

  return (
    <div class="newt-table">
      {columns.map((column) => {
        if (column.hide) return null;
        return (
          <div class="newt-table-column">
            <div class="newt-table-heading">{column.heading || column.id}</div>
            {rows.map((row) => {
              return <div class="newt-table-cell">{row[column.id]}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
});
