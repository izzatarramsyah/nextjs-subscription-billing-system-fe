'use client';

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";  
import { getProductByID , getPlanById, subscribe, payment} from "@/services/apiService";  
import Alert from "@/components/ui/alert/Alert";

const PaymentForm = dynamic(() => import('@/components/payments/PaymentForm'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading Form...</p>,
});

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
  const { productId, planId } = useParams() as { productId: string, planId: string };  
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product>({} as Product);
  const [plan, setPlan] = useState<Plan>({} as Plan);

  const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
  } | null>(null);

  useEffect(() => {
    const fetchProductAndPlan = async () => {
      if (!productId || !planId) return; // Jika id tidak ada, hentikan proses fetching

      try {

        const productRes = await getProductByID(productId);
        setProduct(productRes?.status === 200 && productRes.data ? productRes.data : []);

        const planRes = await getPlanById(planId);
        setPlan(planRes?.status === 200 && planRes.data ? planRes.data : []);

      } catch (error) {
        setAlert({
          variant: 'error',
          title: 'System Error',
          message: 'Failed to open payment detail',
        });
        setTimeout(() => {
          setAlert(null);
          router.push(`/subscriber/products`);
        }, 3000);
      } finally {
        setLoading(false);
      }

    };

    fetchProductAndPlan();
  }, [productId, planId]);

  const handleSubmit = async (data: any) => {

    try {
 
      const subscriptionRes = await subscribe({ plan_id: data.planId });
  
      if (!subscriptionRes?.data) {
        setAlert({
          variant: 'error',
          title: 'Subscription Failed',
          message: 'Failed to subscribe. Please try again.',
        });
        return;
      }
  
      const paymentRes = await payment({
        SubscriptionID: subscriptionRes.data,
        Amount: data.planPrice,
        PaymentMethod: data.paymentMethod,
      });
      
      if ( paymentRes.status == 200 ) {
        setAlert({
          variant: 'success',
          title: 'Payment Success',
          message: 'Payment has been proccessed!',
        });
      } else {
        setAlert({
          variant: 'error',
          title: 'Payment Failed',
          message: 'Payment Failed. Please try again!',
        });
      }
  
    } catch (error: any) {
      setAlert({
        variant: 'error',
        title: 'System Error',
        message: 'Failed while proccesing payment',
      });
      
    }

    setTimeout(() => {
      setAlert(null);
      router.push(`/subscriber/products`);
    }, 3000);
  };
  

  if (loading) {
    return <div>Loading...</div>;  
  }

  if (!product) {
    return <div>Payment not found</div>;  
  }

  return (
    <div className="p-4">
      {/* Alert tampil di atas, dengan jarak ke bawah */}
      {alert && alert.variant && (
        <div className="mb-4">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        </div>
      )}
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading data...</p>
          ) : (
      <PaymentForm 
        product={product} 
        plan={plan} 
        onSubmit={handleSubmit} 
      />
          )}
    </div>

  );
}
