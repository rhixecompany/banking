import HeaderBox from "@/components/HeaderBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="settings">
      <header className="settings-header">
        <HeaderBox
          type="title"
          title="Settings"
          user={user?.name || "Guest"}
          subtext="Manage your account preferences."
        />
      </header>
    </section>
  );
};

export default SettingsPage;
