"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";  // Menggunakan useParams untuk mendapatkan ID
import { getPlanById, updatePlan } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

const PlanForm = dynamic(() => import('@/components/plans/PlanForm'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading Form...</p>,
});

export default function EditPlanPage() {
  const { id } = useParams() as { id: string };  // Mengambil id dari URL
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
    if (!id) return; // Jika id tidak ada, hentikan proses fetching
      try {
        const res = await getPlanById(id);
        setPlan(res?.status === 200 && res.data ? res.data : []);
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
      try {
        const res = await updatePlan({
          ID: data.ID,
          ProductID: data.ProductID,
          Name: data.Name,
          Price: data.Price,
          DurationMonths: data.DurationMonths,  
        });
        if ( res.status == 200 ) {
          setAlert({
            variant: 'success',
            title: 'Plan Updated',
            message: 'Plan has been successfully updated.',
          });
        } else {
          setAlert({
            variant: 'error',
            title: 'Plan Failed Update',
            message: 'Plan failed to updated.',
          });
        }
        setTimeout(() => {
          setAlert(null); 
          router.push("/admin/plans");
        }, 3000);
      } catch (err) {
        console.error("Error submitting user", err);
      }
  };

  return (
    <div>
      {alert && alert.variant && (
        <div className="mb-4">
        <Alert 
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
        />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Edit Plan</h2>
        {loading ? (
            <p className="text-center text-gray-500 py-10">Loading data...</p>
          ) : (
        <PlanForm mode="edit" initialData={plan} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
    
  );
}
