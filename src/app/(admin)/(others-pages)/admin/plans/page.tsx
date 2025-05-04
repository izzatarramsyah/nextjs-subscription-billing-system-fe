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
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Badge from "@/components/ui/badge/Badge";
import { getPlans } from "@/services/apiService";
import { useRouter } from "next/navigation";  // Import useRouter
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/alert/Alert";

export interface Product {
  ID: string;
  Name: string;
  Description: string;
  OwnerID: string;
  CreatedAt: string;
}

interface Plan {
  ID: string;
  ProductID: string;
  Product: Product;
  Name: string;
  Price: string;
  DurationMonths: string;
  CreatedAt: string;
}

export default function UserPage() {

  const router = useRouter();  // Hook untuk melakukan navigasi

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getPlans();
        setPlans(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchPlan();
  }, []);

  const handleAdd = () => {
    router.push("/admin/plans/add");
  };

  const handleEdit = (plan: Plan) => {
    router.push(`/admin/plans/edit/${plan.ID}`);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete user with ID", id);
    
  };

  const handleOpenModal = async (id: string) => {

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
          <span className="text-lg font-semibold">Plans Management</span>
          <button
            onClick={handleAdd}
            className="flex items-center justify-between gap-2 bg-primary text-black px-4 py-2 rounded hover:bg-primary-dark text-sm"
          >
            <span>Add Plans</span>
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
                    Product
                  </TableCell>
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
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Duration Months
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
                {plans.map((plan) => (
                  <TableRow key={plan.ID}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button
                            onClick={() => handleOpenModal(plan.ProductID)}
                            className="text-blue-600 hover:underline"
                        >
                            {plan.Product.Name}
                        </button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {plan.Name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {plan.Price}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {plan.DurationMonths}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-theme-sm space-x-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                            setSelectedPlanId(plan.ID);
                            setDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">Apakah kamu yakin ingin menghapus user ini?</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (selectedPlanId) {
                    handleDelete(selectedPlanId);
                  }
                  setDeleteModalOpen(false);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
}
