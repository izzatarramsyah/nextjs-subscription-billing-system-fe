"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";  // Menggunakan useParams untuk mendapatkan ID
import PlanForm from "@/components/plans/PlanForm";
import { getPlanById } from "@/services/apiService";

export default function EditPlanPage() {
  const { id } = useParams() as { id: string };  // Mengambil id dari URL
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return; // Jika id tidak ada, hentikan proses fetching

      try {
        const res = await getPlanById({ id });
        setPlan(res); 
      } catch (error) {
        console.error("Error fetching plan:", error);
        alert("Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (res.ok) {
          router.push("/(admin)/(others-pages)/users");
        } else {
          const result = await res.json();
          alert(result.message || "Gagal menambahkan plan");
        }
      } catch (err) {
        console.error("Error submitting user", err);
      }
  };

  if (loading) {
    return <div>Loading...</div>;  // Menampilkan loading state saat data user sedang diambil
  }

  if (!plan) {
    return <div>Plan not found</div>;  // Menampilkan pesan jika user tidak ditemukan
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Plan</h2>
      <PlanForm mode="edit" initialData={plan} onSubmit={handleSubmit} />
    </div>
  );
}
