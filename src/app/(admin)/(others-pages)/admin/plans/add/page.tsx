// src/app/(admin)/(others-pages)/users/add/page.tsx
"use client";

import React, { useState } from "react";
import PlanForm from "@/components/plans/PlanForm";
import { useRouter } from "next/navigation";
import { createPlan } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

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
      setAlert({
        variant: 'success',
        title: 'Plan Created',
        message: 'Plan has been successfully created.',
      });
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
