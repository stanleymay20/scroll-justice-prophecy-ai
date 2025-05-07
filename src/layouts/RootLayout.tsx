
import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/layout/NavBar";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-justice-dark to-black">
      <NavBar />
      <main className="pt-20 pb-16">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
