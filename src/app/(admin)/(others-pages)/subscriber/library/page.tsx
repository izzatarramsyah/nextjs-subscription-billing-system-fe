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
import { getLibraryByUserID, getAccessProduct, serveProduct } from "@/services/apiService";
import { useRouter } from "next/navigation";  // Import useRouter
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/alert/Alert";

interface LibraryItem {
  product_id: string;
  product_name: string;
  plan_name: string;
  plan_price: number;
  subscription_start: string;
  subscription_end: string;
  subscription_status: string;
}

export default function UserPage() {

  const router = useRouter();  // Hook untuk melakukan navigasi

  const [libraryItem, setLibraryItem] = useState<LibraryItem[]>([]);

  const [isPDFViewOpen, setPDFViewOpen] = useState(false);
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await getLibraryByUserID();
        setLibraryItem(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchLibrary();
  }, []);

  const calculateDaysLeft = (endDate: string): string => {
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} hari tersisa` : "Berakhir";
  };

   const handleShowDetail = async (productId: string) => {
      try {
        // 1. Panggil getAccess
        const accessData = await getAccessProduct({ id : productId });
    
        if (!accessData.fileUrl) {
          console.error("File URL not found");
          setAlert({
            variant: 'error',
            title: 'View Failed',
            message: 'Subscription inactive or expired',
          });
          setTimeout(() => {
            setAlert(null); 
            router.push("/admin/products");
          }, 3000);
          return;
        }
    
        // 2. Panggil serve API, kirim FilePath
        const serveRes = await serveProduct({ fileUrl: accessData.fileUrl });
    
        // ✅ response.data sudah berupa Blob
        const fileURL = URL.createObjectURL(serveRes.data); 
    
        // 3. Tampilkan di iframe
        setPdfUrl(fileURL);
        setPDFViewOpen(true);
  
      } catch (error) {
        console.error('Error previewing ebook', error);
      }
    };

  return (
    <div>
      {/* Tampilkan alert jika ada */}
      {alert && alert.variant && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
        />
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
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Plan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Duration
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
              {libraryItem && libraryItem.length > 0 ? (
                libraryItem.map((item) => (
                  <TableRow key={item.product_id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.product_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.plan_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Rp{item.plan_price}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.subscription_end
                        ? calculateDaysLeft(item.subscription_end)
                        : "Tidak ada tanggal"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm space-x-2">
                      <button
                        onClick={() => handleShowDetail(item.product_id)}
                        className="text-blue-600 hover:text-green-700"
                        title="View Product"
                      >
                        Open
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center text-gray-500 py-4">
                    Tidak ada data langganan.
                  </TableCell>
                </TableRow>
              )}
            </Table>
          </div>
        </div>

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
                       >
                         Tutup
                       </button>
                   </div>
                 </div>
               </Modal>
               
      </div>
    </div>
  );
}
