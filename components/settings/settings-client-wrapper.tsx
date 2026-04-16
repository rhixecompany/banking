"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { UserWithProfile } from "@/types/user";

// Accept updateProfile as a prop from the surrounding server component instead
// of importing the server action directly in client code. This keeps server
// actions server-only and follows the server-wrapper → client-wrapper pattern.
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

// ---------------------------------------------------------------------------
// Schemas — derived from UpdateProfileSchema in lib/actions/updateProfile.ts
// rather than re-defining them locally.
// ---------------------------------------------------------------------------

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
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

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
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

/**
 * Description placeholder
 * @author [object Object]
 *
 * @typedef {ProfileFormData}
 */
type ProfileFormData = z.infer<typeof ProfileSchema>;
/**
 * Description placeholder
 * @author [object Object]
 *
 * @typedef {PasswordFormData}
 */
type PasswordFormData = z.infer<typeof PasswordSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface SettingsClientWrapperProps
 * @typedef {SettingsClientWrapperProps}
 */
interface SettingsClientWrapperProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {UserWithProfile}
   */
  userWithProfile: UserWithProfile;
  /**
   * Server action provided by the server wrapper to update the profile.
   * This mirrors the signature of the original updateProfile server action.
   */
  updateProfile?: (data: unknown) => Promise<{ ok: boolean; error?: string }>;
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
  updateProfile,
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
    if (!updateProfile) {
      profileForm.setError("root", {
        message: "Update action not available",
      });
      return;
    }

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
    if (!updateProfile) {
      passwordForm.setError("root", {
        message: "Update action not available",
      });
      return;
    }

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

      <SettingsProfileForm form={profileForm} onSubmit={onProfileSubmit} />

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

import SettingsProfileForm from "@/components/layouts/settings-profile-form";
