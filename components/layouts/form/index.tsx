import React from "react";

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e?: React.FormEvent) => void;
  errors?: Record<string, string>;
}

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
