"use client";
import Navbar from "@/components/navbar";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import Footer from "@/components/footer";
import CookieCheck from "@/components/CookieCheck";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <Navbar />
        {children}
        <Footer />
        <CookieCheck />
      </Provider>
    </>
  );
}
