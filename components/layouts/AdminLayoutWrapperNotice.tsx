// Provenance: inspected components/layouts/AdminLayoutWrapper.tsx — small helper for admin gating
import React from "react";

export default function AdminLayoutWrapperNotice({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
