"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaRegCheckCircle, FaInfoCircle } from "react-icons/fa";
import Badge from "@/components/ui/badge/Badge";
import { getProducts, getPlanByProductId, getAccessProduct, serveProduct } from "@/services/apiService";
import { useRouter } from "next/navigation"; 
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/alert/Alert";

interface Products {
  ID: string;
  Name: string;
  Description: string;
  OwnerID: string;
  CreatedAt: string;
}

interface Plan {
  ID: string;
  Name: string;
  Price: number;
  DurationMonths: string;
}

export default function UserPage() {

  const router = useRouter();  

  const [isSubscribeModalOpen, setSubscribeModalOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);

  const [products, setProducts] = useState<Products[]>([]);

  const [isPDFViewOpen, setPDFViewOpen] = useState(false);
    
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
    } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);


  const fetchPlans = async (productId: string) => {
    try {
      const res = await getPlanByProductId(productId);
      setPlans(res?.status === 200 && res.data ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    }
  };

  const handleSubscribe = async ( productId: string, planId: string) => {
    router.push(`/subscriber/payments/${productId}/${planId}`);
  };

  const handleShowDetail = async (id: string) => {
    try {
      debugger;
      const accessData = await getAccessProduct(id);
      if (!accessData.data) {
          console.error("File URL not found");
          setAlert({
            variant: 'error',
            title: 'View Failed',
            message: 'Subscription inactive or expired',
          });
          setTimeout(() => {
            setAlert(null); 
          }, 3000);
          return;
      }
        
      const serveRes = await serveProduct({ fileUrl: accessData.data });
      if (!serveRes.data) {
          setAlert({
            variant: 'error',
            title: 'View Failed',
            message: 'Failed to open file',
          });
          setTimeout(() => {
            setAlert(null); 
          }, 3000);
          return;
      }  
      const fileURL = URL.createObjectURL(serveRes.data); 
        
      setPdfUrl(fileURL);
      setPDFViewOpen(true);
      
    } catch (error) {
      console.error('Error previewing ebook', error);
    }
  };

  const handleShowSubscribe = async (id: string) => {
    setSelectedProduct(id);
    await fetchPlans(id);
    setSubscribeModalOpen(true);
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {products.map((product) => (
                  <TableRow key={product.ID}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {product.Name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {product.Description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm space-x-2">
                     <button
                        onClick={() => handleShowDetail(product.ID)}
                        className="text-green-500 hover:text-green-700"
                        title="Preview"
                     >
                        <FaInfoCircle />
                     </button>
                      <button
                        onClick={() => handleShowSubscribe(product.ID)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Subscribe"
                      >
                        <FaRegCheckCircle  />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Modal isOpen={isSubscribeModalOpen} onClose={() => setSubscribeModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Pilih Plan untuk Subscribe</h2>
            <p className="mb-6">Pilih plan yang ingin kamu pilih:</p>

            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.ID}>
                  <input
                    type="radio"
                    id={plan.ID}
                    name="plan"
                    value={plan.ID}
                    checked={selectedPlan === plan.ID}
                    onChange={(e) => {
                      setSelectedPlan(e.target.value);
                    }}
                  />
                  <label htmlFor={plan.ID} className="ml-2">{plan.Name} - Rp. {plan.Price}</label>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSubscribeModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (selectedProduct && selectedPlan) {
                    handleSubscribe(selectedProduct, selectedPlan);
                  }
                  setSubscribeModalOpen(false);
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>
          </div>
        </Modal>
              
        <Modal isOpen={isPDFViewOpen} onClose={() => setPDFViewOpen(false)}>
          <div className="p-6">
             <h2 className="text-lg font-semibold mb-4">Ebook View</h2>
               
              {/* Iframe untuk tampilkan PDF */}
              {pdfUrl && (
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0`}
                  title="Ebook Preview"
                  width="100%"
                  height="600px"
                  style={{ marginTop: '20px', border: '1px solid #ccc' }}
                />
              )}
               
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setPDFViewOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                > Tutup
                </button>
              </div>
            </div>
          </Modal>

      </div>
    </div>
  );
}
