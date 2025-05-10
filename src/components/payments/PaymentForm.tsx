'use client';

import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { useRouter } from "next/navigation";

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

interface PaymentFormProps  {
  product: Product;
  plan: Plan;
  onSubmit: (paymentData: any) => void;
}

export default function PaymentForm({ product, plan, onSubmit }: PaymentFormProps) {
  const router = useRouter();
  
  const [form, setForm] = useState({
    planId: plan.ID,
    planPrice: plan.Price,
    productId: product.ID,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "", 
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    debugger;
    console.log(form);
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <ComponentCard title="Payment Information">
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Product Name</Label>
            <input
              type="text"
              value={product.Name}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-white"
            />
          </div>
          <div>
            <Label>Plan</Label>
            <input
              type="text"
              value={plan.Name}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-white"
            />
          </div>
          <div>
            <Label>Payment Method</Label>
            <Select
              options={[
                { label: "QRIS", value: "qris" },
                { label: "Bank Transfer", value: "bank_transfer" },
                { label: "Virtual Account", value: "virtual_account" },
                { label: "Kartu Kredit", value: "credit_card" },
              ]}
              value={form.paymentMethod}
              placeholder="Select an option"
              onChange={(value) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  paymentMethod: value,
                }))
              }
              className="dark:bg-dark-900"
            />
          </div>
  
          {form.paymentMethod && (
            <>
              {/* QRIS PAYMENT */}
              {form.paymentMethod === "qris" && (
                <div className="text-center">
                  <p className="text-sm mb-2">Scan QR Code below to pay via QRIS:</p>
                  <img
                    src="/dummy-qris.png"
                    alt="QRIS Payment"
                    className="mx-auto w-48 h-48 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    * Setelah melakukan pembayaran, silakan tunggu konfirmasi dari admin.
                  </p>
                </div>
              )}
  
              {/* BANK TRANSFER PAYMENT */}
              {form.paymentMethod === "bank_transfer" && (
                <div className="text-sm space-y-2">
                  <p>Transfer pembayaran ke rekening berikut:</p>
                  <ul className="pl-4 list-disc text-gray-700 dark:text-gray-300">
                    <li>Bank: BCA</li>
                    <li>No. Rekening: 1234567890</li>
                    <li>Nama: PT. Demo Digital</li>
                  </ul>
                  <p className="text-xs text-gray-500">
                    * Setelah transfer, silakan upload bukti pembayaran ke admin.
                  </p>
                </div>
              )}
  
              {/* VIRTUAL ACCOUNT PAYMENT */}
              {form.paymentMethod === "virtual_account" && (
                <div className="text-sm space-y-2">
                  <p>Pembayaran melalui Virtual Account:</p>
                  <div className="p-3 bg-gray-100 rounded border dark:bg-dark-800">
                    <p className="text-lg font-mono text-blue-600">88908123</p>
                    <p className="text-xs text-gray-500 mt-1">
                      VA ini berlaku hingga 24 jam setelah dibuat.
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    * Setelah transfer, sistem akan memproses dalam 5–10 menit atau konfirmasi manual.
                  </p>
                </div>
              )}
  
              {/* CREDIT CARD PAYMENT */}
              {form.paymentMethod === "credit_card" && (
                <div className="space-y-4 bg-gray-100 dark:bg-dark-800 p-4 rounded-md">
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      type="text"
                      name="cardNumber"
                      placeholder="4111 1111 1111 1111"
                      value={form.cardNumber}
                      onChange={handleChange}
                    />
                  </div>
  
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label>Expiry Date</Label>
                      <Input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={form.expiryDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>CVV</Label>
                      <Input
                        type="password"
                        name="cvv"
                        placeholder="123"
                        value={form.cvv}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      // disabled={
                      //   !form.cardNumber ||
                      //   !form.expiryDate ||
                      //   !form.cvv ||
                      //   form.cardNumber.length < 16 ||
                      //   form.cvv.length < 3
                      // }
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Complete Payment
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
  
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </ComponentCard>
  );
  
}
