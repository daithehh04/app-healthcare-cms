import React from "react";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

export default function PrivateLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex min-h-[100vh] pb-5">
        <SideBar />
        <div className="flex-1 pt-3 pl-5 pr-10">{children}</div>
      </main>

      <Footer />
    </>
  );
}
