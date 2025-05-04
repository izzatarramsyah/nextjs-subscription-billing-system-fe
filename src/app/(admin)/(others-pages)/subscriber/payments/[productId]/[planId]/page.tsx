'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";  // Menggunakan useParams untuk mendapatkan ID
import PaymentForm from "@/components/payments/PaymentForm";
import { getProductByID , getPlanById, subscribe, payment} from "@/services/apiService";  // Pastikan ini adalah API service yang tepat
import Alert from "@/components/ui/alert/Alert";

interface Product {
  ID: string;
  Name: string;
  Description: string;
}

interface Plan {
  ID: string;
  Name: string;
  Price: string;
  DurationMonths: number;
}

export default function PaymentPage() {
  const { productId, planId } = useParams() as { productId: string, planId: string };  // Mengambil id dari URL
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product>({} as Product);
  const [plan, setPlan] = useState<Plan>({} as Plan);

  const [error, setError] = useState<string | null>(null);

  const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
  } | null>(null);

  useEffect(() => {
    const fetchProductAndPlan = async () => {
      if (!productId || !planId) return; // Jika id tidak ada, hentikan proses fetching

      try {
        // Fetch product
        const productRes = await getProductByID({ id: productId });
        setProduct(productRes);

        // Fetch plan
        const planRes = await getPlanById({ id: planId });
        setPlan(planRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Terjadi kesalahan saat memuat produk atau plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndPlan();
  }, [productId, planId]);

  const handleSubmit = async (data: any) => {
    console.log(data)
    try {
      // 1. Lakukan subscription
      const subscriptionRes = await subscribe({ plan_id: data.planId });
  
      if (!subscriptionRes?.subscriber_id) {
        setAlert({
          variant: 'error',
          title: 'Subscription Failed',
          message: 'Gagal melakukan subscription. Silakan coba lagi.',
        });
        return;
      }
  
      // 2. Lakukan pembayaran
      const paymentRes = await payment({
        SubscriptionID: subscriptionRes.subscriber_id,
        Amount: data.planPrice,
        PaymentMethod: data.paymentMethod,
      });
  
      setAlert({
        variant: 'success',
        title: 'Payment Success',
        message: 'Pembayaran berhasil dilakukan!',
      });
  
      // Tunggu sebentar lalu redirect
      setTimeout(() => {
        setAlert(null);
        router.push(`/subscriber/products`);
      }, 3000);
  
    } catch (error: any) {
      console.error("Terjadi kesalahan saat submit:", error);
      setAlert({
        variant: 'error',
        title: 'Terjadi Kesalahan',
        message: error?.message || 'Terjadi masalah saat memproses pembayaran.',
      });
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;  // Menampilkan loading state saat data produk sedang diambil
  }

  if (error) {
    return <div>{error}</div>;  // Menampilkan pesan kesalahan
  }

  if (!product) {
    return <div>Payment not found</div>;  // Menampilkan pesan jika produk tidak ditemukan
  }

  return (
    <div className="p-4">
  {/* Alert tampil di atas, dengan jarak ke bawah */}
  {alert && alert.variant && (
    <div className="mb-6">
      <Alert
        variant={alert.variant}
        title={alert.title}
        message={alert.message}
      />
    </div>
  )}

  <PaymentForm 
    product={product} 
    plan={plan} 
    onSubmit={handleSubmit} 
  />
</div>

  );
}
