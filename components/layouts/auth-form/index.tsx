"use client";

// Re-export the existing AuthForm component into the new components/layouts/ location
// to satisfy the presentational-components convention while keeping the original
// implementation in place for backward compatibility.
export { default } from "@/components/auth-form/auth-form";
