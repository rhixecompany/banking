"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { UserWithProfile } from "@/types/user";

import HeaderBox from "@/components/header-box/header-box";
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
// Schemas — derived from UpdateProfileSchema in lib/actions/updateProfile.ts
// rather than re-defining them locally.
// ---------------------------------------------------------------------------

const ProfileSchema = z.object({
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address").optional(),
  image: z
    .string()
    .trim()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")),
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

interface SettingsClientWrapperProps {
  userWithProfile: UserWithProfile;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Client wrapper for the Settings page.
 * Renders a profile form and a separate password-change form.
 * Uses toast.success() instead of boolean success state.
 * Adds email and image fields that were missing from SettingsClient.
 *
 * @export
 * @param {SettingsClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function SettingsClientWrapper({
  userWithProfile,
}: SettingsClientWrapperProps): JSX.Element {
  // -- Profile form ----------------------------------------------------------
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      address: userWithProfile.profile?.address ?? "",
      city: userWithProfile.profile?.city ?? "",
      email: userWithProfile.email ?? "",
      image: userWithProfile.image ?? "",
      name: userWithProfile.name ?? "",
      phone: userWithProfile.profile?.phone ?? "",
      postalCode: userWithProfile.profile?.postalCode ?? "",
      state: userWithProfile.profile?.state ?? "",
    },
    resolver: zodResolver(ProfileSchema),
  });

  async function onProfileSubmit(data: ProfileFormData): Promise<void> {
    const result = await updateProfile(data);
    if (!result.ok) {
      profileForm.setError("root", {
        message: result.error ?? "Update failed",
      });
      return;
    }
    toast.success("Profile updated successfully.");
  }

  // -- Password form ---------------------------------------------------------
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: { newPassword: "", password: "" },
    resolver: zodResolver(PasswordSchema),
  });

  async function onPasswordSubmit(data: PasswordFormData): Promise<void> {
    const result = await updateProfile(data);
    if (!result.ok) {
      passwordForm.setError("root", {
        message: result.error ?? "Update failed",
      });
      return;
    }
    toast.success("Password changed successfully.");
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane@example.com"
                          {...field}
                        />
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
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/avatar.png"
                          {...field}
                        />
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
