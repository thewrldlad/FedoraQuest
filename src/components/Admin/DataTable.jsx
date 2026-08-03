export default function DataTable({ columns, rows, actions }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-fedora-border">
      <table className="w-full text-sm text-left">
        <thead className="bg-fedora-surface border-b border-fedora-border">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-fedora-muted font-medium uppercase text-xs tracking-wide whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-6 text-center text-fedora-muted bg-fedora-surface"
              >
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-fedora-border last:border-0 bg-fedora-surface hover:bg-fedora-border/40 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-fedora-text">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
