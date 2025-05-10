"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Menggunakan usePathname untuk mendapatkan pathname
import Cookie from "js-cookie"; // Untuk mengambil cookie

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname(); // Mendapatkan pathname saat ini
  const pathPrefix = pathname.split("/")[1]; // akan menangkap 'user', 'owner', atau 'admin'

  // State untuk memeriksa apakah kita di sisi klien dan apakah pengalihan sedang berlangsung
  const [isClient, setIsClient] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Menambahkan state untuk melacak pengalihan

  // Ambil role dari cookie
  const role = Cookie.get("role"); // Ambil role dari cookie (misalnya role yang disimpan saat login)

  // Cek apakah pengguna sudah login
  const isLoggedIn = !!role;

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  useEffect(() => {
    // Set isClient menjadi true setelah komponen dirender di sisi klien
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Jangan jalankan kode di sini jika belum di sisi klien

    setIsRedirecting(true); // Menandakan bahwa pengalihan sedang berlangsung

    // Jika pengguna belum login, arahkan ke halaman signin
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }

    debugger;
    // Pengalihan berdasarkan role setelah login
    if (role === "admin" && (pathPrefix !== "admin" && pathPrefix !== "calendar") ) {
      router.push("/");
    } else if (role === "subscriber" &&  (pathPrefix !== "subscriber" && pathPrefix !== "calendar") ) {
      router.push("/subscriber/products");
    } else if (role === "owner" && (pathPrefix !== "owners" && pathPrefix !== "calendar") ) {
      router.push("/");
    } else if (role === "guest" && pathPrefix !== "guest" ) {
      router.push("/guest");
    }

    // Setelah pengalihan selesai, set isRedirecting menjadi false
    setIsRedirecting(false);
  }, [isClient, isLoggedIn, role, router, pathPrefix]);

  // Jika pengalihan sedang berlangsung, tampilkan spinner atau indikator loading
  if (isRedirecting) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>; // Ganti dengan spinner jika diperlukan
  } else {
   
    return (
      <div className="min-h-screen xl:flex">
        {/* Sidebar dan Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Area Konten Utama */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Konten Halaman */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        </div>
      </div>
    );
  }
}
