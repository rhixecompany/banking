import React from "react";

interface CardProps {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function Card({ children, footer, title }: CardProps) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
