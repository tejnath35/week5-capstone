import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../Rstore/authStore";

function RootLayout() {
  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    // Call the store action directly so the effect doesn't depend on a
    // function reference that may change between renders (prevents loop).
    useAuth.getState().checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
  <Header />

  <main className="grow flex">
    <Outlet />
  </main>

  <Footer />
</div>
  );
}

export default RootLayout;