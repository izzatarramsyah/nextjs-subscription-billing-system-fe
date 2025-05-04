"use client";

import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { getUser } from "@/services/apiService";

// export const metadata: Metadata = {
//   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

interface User {
  ID: string;
  Username: string;
  Email: string;
  Role: string;
  Status: string;
  CreatedAt: string;
}

export default function Profile() {

  const [user, setUser] = useState<User>();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUser();
        setUser(res);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserInfoCard userInfo={user}/>
        </div>
      </div>
    </div>
  );
}
