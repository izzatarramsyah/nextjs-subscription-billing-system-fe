"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";  // Menggunakan useParams untuk mendapatkan ID
import { getProductByID, updateProduct } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

const ProductForm = dynamic(() => import('@/components/products/ProductForm'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading Form...</p>,
});

export default function EditUserPage() {
  const { id } = useParams() as { id: string };  // Mengambil id dari URL
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return; 
      try {
        const res = await getProductByID(id);
        setProduct(res?.status === 200 && res.data ? res.data : []);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
      const res = await updateProduct({
        ProductId: data.ID,
        Name: data.Name,
        Description: data.Description,
        OwnerID: data.OwnerID,
        File: data.File,  
      });
      if ( res.status == 200 ) {
        setAlert({
          variant: 'success',
          title: 'Product Updated',
          message: 'Product has been successfully updated.',
        });
      } else {
        setAlert({
          variant: 'error',
          title: 'Product Failed Update',
          message: 'Product failed to updated.',
        });
      }
      setTimeout(() => {
        setAlert(null); 
        router.push("/admin/products");
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
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        {loading ? (
            <p className="text-center text-gray-500 py-10">Loading data...</p>
          ) : (
        <ProductForm mode="edit" initialData={product} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
   
  );
}
