import React from "react";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface CardProps
 * @typedef {CardProps}
 */
interface CardProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  title?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?React.ReactNode}
   */
  footer?: React.ReactNode;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {CardProps} param0
 * @param {React.ReactNode} param0.children
 * @param {React.ReactNode} param0.footer
 * @param {string} param0.title
 * @returns {ReactJSX.Element}
 */
export default function Card({ children, footer, title }: CardProps) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
