//import { Footer } from "@/components/static/Footer";
import { Navbar } from "@/components/static/Navbar";
import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className="root-layout min-h-full min-w-full">
      <Navbar />

      <main className=" min-h-full w-full mt-10">
        <Outlet />
      </main>
      {/*<Footer />*/}
    </div>
  );
};
