// src/app/(admin)/(others-pages)/users/add/page.tsx
"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createPlan } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

const PlanForm = dynamic(() => import('@/components/plans/PlanForm'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading Form...</p>,
});

export default function AddPlanPage() {
  const router = useRouter();

  const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
  } | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      const res = await createPlan({
        ProductID: data.ProductID,
        Name: data.Plan,
        Price: parseFloat(data.Price), 
        DurationMonths: parseInt(data.DurationMonths),
      });
      if ( res.status == 200 ) {
        setAlert({
          variant: 'success',
          title: 'Plan Created',
          message: 'Plan has been successfully created.',
        });
      } else {
        setAlert({
          variant: 'error',
          title: 'Plan Failed',
          message: 'Plan failed to created.',
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
      <Alert
        variant={alert.variant}
        title={alert.title}
        message={alert.message}
      />
      )}
      <div className="p-4">
        <PlanForm mode="add" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
