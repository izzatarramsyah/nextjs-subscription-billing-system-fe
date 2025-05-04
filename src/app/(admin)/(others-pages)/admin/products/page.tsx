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
import { FaEdit, FaPlus, FaInfoCircle } from "react-icons/fa";
import {
  ChevronDownIcon,
} from '../../../../../icons';
import { getProducts } from "@/services/apiService";
import { useRouter } from "next/navigation";  // Import useRouter
import { Modal } from "@/components/ui/modal";
import { getAccessProduct, serveProduct, updateStatusProduct, getUserByID} from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";
import { format } from 'date-fns';
import Select from "@/components/form/Select";

interface Products {
  ID: string;
  Name: string;
  Description: string;
  OwnerID: string;
  Status: string;
  CreatedAt: string;
}

export default function UserPage() {

  const router = useRouter();  // Hook untuk melakukan navigasi

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  
  const [isPDFViewOpen, setPDFViewOpen] = useState(false);
  const [isOwnerDetail, setOwnerDetail] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  const [products, setProducts] = useState<Products[]>([]);

  const [ownerDetailData, setOwnerDetailData] = useState<any>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  const formatDate = (isoString: string) => {
    return format(new Date(isoString), 'dd MMM yyyy HH:mm:ss');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        console.log(res.data)
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAdd = () => {
    router.push("/admin/products/add");
  };

  const handleEdit = (product: Products) => {
    router.push(`/admin/products/edit/${product.ID}`);
  };

  const handlUpdateStatus = async (productId: string, selectedOption: string) => {
    const res = await updateStatusProduct({ id : productId, status : selectedOption });
    setProducts((prev) => prev.filter((product) => product.ID !== productId)); 
    setAlert({
      variant: 'success',
      title: 'Product Updated',
      message: 'Product has been successfully updated.',
    });
    setTimeout(() => {
      setAlert(null); 
      router.push("/admin/products");
    }, 3000);
    return;
  };

  const handleShowOwnerDetail = async (id: string) => {
    const res = await getUserByID({ id });
    setOwnerDetailData(res); 
    setOwnerDetail(true);
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
  
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl); // Pastikan URL blob dibersihkan ketika tidak digunakan lagi
      }
    };
  }, [pdfUrl]);

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
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-lg font-semibold">Product Management</span>
          <button
            onClick={handleAdd}
            className="flex items-center justify-between gap-2 bg-primary text-black px-4 py-2 rounded hover:bg-primary-dark text-sm"
          >
            <span>Add Product</span>
            <FaPlus className="text-black" />
          </button>
        </div>
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
                    Owner
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Created At
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
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button
                            onClick={() => handleShowOwnerDetail(product.OwnerID)}
                            className="text-blue-600 hover:underline"
                        >
                            Detail
                        </button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <select
                        className="border rounded px-2 py-1 bg-white dark:bg-dark-900 text-sm"
                        value={product.Status} // Sesuaikan dengan data kamu
                        onChange={(e) => {
                          setSelectedProductId(product.ID);
                          setNewStatus(e.target.value);
                          setConfirmModalOpen(true);
                        }}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(product.CreatedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm space-x-2">
                     <button
                        onClick={() => handleShowDetail(product.ID)}
                        className="text-green-500 hover:text-green-700"
                        title="Detail"
                     >
                        <FaInfoCircle />
                     </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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

        <Modal isOpen={isOwnerDetail} onClose={() => setOwnerDetail(false)}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Personal Information</h2>

            {ownerDetailData ? (
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Username</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {ownerDetailData.Username}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Role</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {ownerDetailData.Role}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {ownerDetailData.Status}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {ownerDetailData.Email}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Join Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(ownerDetailData.CreatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading...</p>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setOwnerDetail(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Perubahan Status</h2>
            <p className="mb-6">
              Apakah kamu yakin ingin mengubah status produk ini menjadi{" "}
              <span className="font-bold text-blue-600">"{newStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}"</span>?
            </p>
            
            <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
            Batal
          </button>
          <button
            onClick={() => {
            if (selectedProductId && newStatus) {
              handlUpdateStatus(selectedProductId, newStatus); 
            }
             setConfirmModalOpen(false);
            }}
             className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
           Update Status
          </button>
          </div>
          </div>
        </Modal>

      </div>

    </div>
  );
}
