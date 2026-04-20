/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface RowProps
 * @typedef {RowProps}
 */
interface RowProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {*}
   */
  row: any;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string[]}
   */
  fields: string[];
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {RowProps} param0
 * @param {{}} param0.fields
 * @param {*} param0.row
 * @returns {ReactJSX.Element}
 */
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
