import React from "react";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface FormProps
 * @typedef {FormProps}
 */
interface FormProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(e?: React.FormEvent) => void}
   */
  onSubmit?: (e?: React.FormEvent) => void;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?Record<string, string>}
   */
  errors?: Record<string, string>;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {FormProps} param0
 * @param {React.ReactNode} param0.children
 * @param {Record<string, string>} [param0.errors={}]
 * @param {(e?: React.FormEvent) => void} param0.onSubmit
 * @returns {ReactJSX.Element}
 */
export default function Form({ children, errors = {}, onSubmit }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="simple-form">
      {children}
      {Object.keys(errors).length > 0 && (
        <div className="form-errors">
          {Object.entries(errors).map(([k, v]) => (
            <div role="alert" key={k}>
              {k}: {v}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
