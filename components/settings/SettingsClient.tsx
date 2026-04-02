"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { UserWithProfile } from "@/types/user";

import HeaderBox from "@/components/HeaderBox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/lib/actions/updateProfile";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const ProfileSchema = z.object({
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  phone: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  state: z.string().trim().optional(),
});

const PasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(8, "New password must be at least 8 characters"),
    password: z.string().trim().min(8, "Current password is required"),
  })
  .refine((d) => d.newPassword !== d.password, {
    error: "New password must differ from current password",
    path: ["newPassword"],
  });

type ProfileFormData = z.infer<typeof ProfileSchema>;
type PasswordFormData = z.infer<typeof PasswordSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsClientProps {
  userWithProfile: UserWithProfile;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Client component for the Settings page.
 * Renders a profile form and a separate password-change form.
 *
 * @export
 * @param {SettingsClientProps} props
 * @returns {JSX.Element}
 */
export function SettingsClient({
  userWithProfile,
}: SettingsClientProps): JSX.Element {
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // -- Profile form ----------------------------------------------------------
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      address: userWithProfile.profile?.address ?? "",
      city: userWithProfile.profile?.city ?? "",
      name: userWithProfile.name ?? "",
      phone: userWithProfile.profile?.phone ?? "",
      postalCode: userWithProfile.profile?.postalCode ?? "",
      state: userWithProfile.profile?.state ?? "",
    },
    resolver: zodResolver(ProfileSchema),
  });

  async function onProfileSubmit(data: ProfileFormData): Promise<void> {
    setProfileSuccess(false);
    const result = await updateProfile(data);
    if (!result.ok) {
      profileForm.setError("root", {
        message: result.error ?? "Update failed",
      });
      return;
    }
    setProfileSuccess(true);
  }

  // -- Password form ---------------------------------------------------------
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: { newPassword: "", password: "" },
    resolver: zodResolver(PasswordSchema),
  });

  async function onPasswordSubmit(data: PasswordFormData): Promise<void> {
    setPasswordSuccess(false);
    const result = await updateProfile(data);
    if (!result.ok) {
      passwordForm.setError("root", {
        message: result.error ?? "Update failed",
      });
      return;
    }
    setPasswordSuccess(true);
    passwordForm.reset();
  }

  // -- Render ----------------------------------------------------------------
  return (
    <section className="space-y-8">
      <header>
        <HeaderBox
          title="Settings"
          subtext="Manage your account profile and security."
        />
      </header>

      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your name, address, and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 555 000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {profileForm.formState.errors.root && (
                <p className="text-sm text-destructive">
                  {profileForm.formState.errors.root.message}
                </p>
              )}
              {profileSuccess && (
                <p className="text-sm text-green-600">
                  Profile updated successfully.
                </p>
              )}

              <Button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
              >
                {profileForm.formState.isSubmitting
                  ? "Saving..."
                  : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      {/* Password card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter your current password, then choose a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {passwordForm.formState.errors.root && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.root.message}
                </p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-600">
                  Password changed successfully.
                </p>
              )}

              <Button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting
                  ? "Updating..."
                  : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
