// src/app/(admin)/(others-pages)/users/add/page.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { addProduct } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

const ProductForm = dynamic(() => import('@/components/products/ProductForm'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading Form...</p>,
});


export default function AddProductPage() {
  const router = useRouter();

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);
  
  const handleSubmit = async (data: any) => {
    try {
      const res = await addProduct({
        Name: data.Name,
        Description: data.Description,
        OwnerID: data.OwnerID,
        File: data.File,  
      });
      setAlert({
        variant: 'success',
        title: 'Product Added',
        message: 'Product has been successfully added.',
      });
      setTimeout(() => {
        setAlert(null); 
        router.push("/owners/products");
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
        <ProductForm mode="add" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
