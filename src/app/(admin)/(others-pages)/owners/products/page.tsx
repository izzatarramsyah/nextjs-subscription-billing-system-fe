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
import { FaEdit, FaTrash, FaPlus, FaInfoCircle } from "react-icons/fa";
import Badge from "@/components/ui/badge/Badge";
import { getProductsByOwnerID, updateStatusProduct } from "@/services/apiService";
import { useRouter } from "next/navigation";  // Import useRouter
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/alert/Alert";
import { format } from 'date-fns';

interface Products {
  ID: string;
  Name: string;
  Description: string;
  OwnerID: string;
  Status: string;
  CreatedAt: string;
}

export default function OwnerProductsPage() {

  const router = useRouter();  // Hook untuk melakukan navigasi

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [products, setProducts] = useState<Products[]>([]);

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
        const res = await getProductsByOwnerID();
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleAdd = () => {
    router.push("/owners/products/add");
  };

  const handleEdit = (product: Products) => {
    router.push(`/owners/products/edit/${product.ID}`);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateStatusProduct({ id : id, status : status });
      setAlert({
        variant: 'success',
        title: 'Product Status Updated',
        message: 'Product has been successfully updated.',
      });
      setTimeout(() => {
        setAlert(null); // Hide alert after 3 seconds
      }, 3000);
    } catch (error) {
      console.error('Gagal hapus user', error);
    }
  };

  const handleShowDetail = async (id: string) => {

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
                    handleUpdateStatus(selectedProductId, newStatus); 
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
