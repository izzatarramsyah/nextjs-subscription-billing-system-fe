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
    paymentMethod: "credit_card", // Default is credit card
  });

  const paymentMethods = [
    { value: "credit_card", label: "Credit Card" },
    { value: "paypal", label: "PayPal" },
    { value: "bank_transfer", label: "Bank Transfer" },
  ];

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
        {/* Product and Plan Info  & Payment Form*/}
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
              options={paymentMethods}
              value={form.paymentMethod}
              placeholder="Select an option"
              onChange={(value) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  Role: value,
                }))
              }
              className="dark:bg-dark-900"
            />
          </div>

          {form.paymentMethod === "credit_card" && (
            <>
              <div>
                <Label>Card Number</Label>
                <Input
                  type="text"
                  name="cardNumber"
                  placeholder="Enter your card number"
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
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={form.cvv}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {form.paymentMethod === "paypal" && (
            <div>
              <p>Pay using PayPal</p>
              {/* Integrate PayPal button here */}
            </div>
          )}

          {form.paymentMethod === "bank_transfer" && (
            <div>
              <p>Transfer your payment to our bank account</p>
              {/* Show bank details for transfer */}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="submit"
              disabled={!form.cardNumber || !form.expiryDate || !form.cvv}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              Complete Payment
            </button>

            <button
              type="button"
              onClick={() => router.push("/")} // Go back to the homepage
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
