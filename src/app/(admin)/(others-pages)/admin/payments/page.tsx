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
import { getAllPaymentDetails, updatePaymentStatus } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";
import { format } from 'date-fns';
import Select from "@/components/form/Select";

interface PaymentDetails {
    PaymentID: string;
    Gateway: string;
    Amount: string;
    Status: string;
    PaidAt: string;
    UserID: string;
    Username: string;
    Email: string;
    SubscriptionID: string;
    SubscriptionStatus: string;
}

interface GatewayOption {
    label: string;
    value: string;
}
  
export default function UserPage() {

  const router = useRouter();  // Hook untuk melakukan navigasi

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);
  const [isPaymentDetailOpen, setPaymentDetailOpen] = useState(false);

  const gatewayOptions = [
    { label: "QRIS", value: "qris" },
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "Virtual Account", value: "virtual_account" },
    { label: "Kartu Kredit", value: "credit_card" },
  ];

  const getGatewayLabel = (value: string) => {
    const found = gatewayOptions.find((option: GatewayOption) => option.value === value);
    return found ? found.label : value;
  };
  
  const formatDate = (isoString: string) => {
    return format(new Date(isoString), 'dd MMM yyyy HH:mm:ss');
  };

    const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
    } | null>(null);
  
  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const res = await getAllPaymentDetails();
      setPaymentDetails(res.status == 200 ? res.data : []);
    } catch (err) {
      console.error("Failed to payment details", err);
    }
  };

  const handleUpdateStatusPayment = async (paymentId: string, status: string) => {
    const res = await updatePaymentStatus({ id : paymentId, status : status });
    if (res.status == 200) {
        fetchPaymentDetails();
        setAlert({
            variant: 'success',
            title: 'Payment Status Updated',
            message: 'Payment status has been successfully updated.',
        });
    } else {
        setAlert({
            variant: 'error',
            title: 'Payment Status Failed',
            message: 'Payment status failed updated.',
        });
    }
    setTimeout(() => {
       setAlert(null); 
    }, 3000);
    return;
  };

  const handleOpenPaymentDetail = (payment: PaymentDetails) => {
    setSelectedPayment(payment);
    setPaymentDetailOpen(true);
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
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-lg font-semibold">Payment</span>
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
                    Payment ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Gateway
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Amount
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
                    Paid At
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paymentDetails.map((payment) => (
                  <TableRow key={payment.PaymentID}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button
                            onClick={() => handleOpenPaymentDetail(payment)}
                            className="text-blue-600 hover:underline"
                        >
                             {payment.PaymentID}
                        </button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {getGatewayLabel(payment?.Gateway ?? '')}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {payment.Amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <select
                        className="border rounded px-2 py-1 bg-white dark:bg-dark-900 text-sm"
                        value={payment.Status} 
                        onChange={(e) => {
                            setSelectedPaymentId(payment.PaymentID);
                            setNewStatus(e.target.value);
                            setConfirmModalOpen(true);
                        }}
                      >
                        <option value="success">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="cancel">Canceled</option>
                      </select>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(payment.PaidAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        </div>

        <Modal isOpen={isPaymentDetailOpen} onClose={() => setPaymentDetailOpen(false)}>
        <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Payment Detail</h2>

            {selectedPayment ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                <p className="text-xs text-gray-500">Payment ID</p>
                <p className="text-sm font-medium">{selectedPayment.PaymentID}</p>
                </div>
                <div>
                <p className="text-xs text-gray-500">Gateway</p>
                <p className="text-sm font-medium">{getGatewayLabel(selectedPayment?.Gateway ?? '')}
                </p>
                </div>
                <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium">{selectedPayment.Amount}</p>
                </div>
                <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-medium">{selectedPayment.Status}</p>
                </div>
                <div>
                <p className="text-xs text-gray-500">Paid At</p>
                <p className="text-sm font-medium">{formatDate(selectedPayment.PaidAt)}</p>
                </div>
                <div>
                <p className="text-xs text-gray-500">User</p>
                <p className="text-sm font-medium">{selectedPayment.Username} ({selectedPayment.Email})</p>
                </div>
                <div>
                <p className="text-xs text-gray-500">Subscription ID</p>
                <p className="text-sm font-medium">{selectedPayment.SubscriptionID}</p>
                </div>
                <div>
                <p className="text-xs text-gray-500">Subscription Status</p>
                <p className="text-sm font-medium">{selectedPayment.SubscriptionStatus}</p>
                </div>
            </div>
            ) : (
            <p className="text-sm text-gray-500">Loading...</p>
            )}

            <div className="flex justify-end gap-3 mt-8">
            <button
                onClick={() => setPaymentDetailOpen(false)}
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
               Apakah kamu yakin ingin mengubah status payment ini menjadi{" "}
               <span className="font-bold text-blue-600">"{newStatus === 'paid' ? 'Success' : newStatus === 'pending' ? 'Pending' : 'Canceled'}"</span>?
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
             if (selectedPaymentId && newStatus) {
                handleUpdateStatusPayment(selectedPaymentId, newStatus); 
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
  );
}
