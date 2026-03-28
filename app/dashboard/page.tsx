import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Dashboard"
            user={user?.name || "Guest"}
            subtext="View your account overview and recent activity."
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={0}
            totalCurrentBalance={0}
          />
        </header>
      </div>
    </section>
  );
};

export default DashboardPage;
