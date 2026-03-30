import { redirect } from "next/navigation";

import HeaderBox from "@/components/HeaderBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const SettingsPage = async (): Promise<JSX.Element> => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <section>
      <header>
        <HeaderBox
          type="title"
          title="Settings"
          user={user?.name ?? "Guest"}
          subtext="Manage your account preferences."
        />
      </header>
    </section>
  );
};

export default SettingsPage;
