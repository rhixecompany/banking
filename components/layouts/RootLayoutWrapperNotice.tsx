// Provenance: inspected components/layouts/RootLayoutWrapper.tsx — small helper for root wrapper
import React from "react";

export default function RootLayoutWrapperNotice({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
