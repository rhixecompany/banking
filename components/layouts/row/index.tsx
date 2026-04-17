interface RowProps {
  row: any;
  fields: string[];
}

export default function Row({ fields, row }: RowProps) {
  return (
    <div className="row-item">
      {fields.map((f) => (
        <div key={f} className={`field field-${f}`}>
          {(row as any)[f]}
        </div>
      ))}
    </div>
  );
}
