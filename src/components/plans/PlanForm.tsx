'use client';

import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import {
  ChevronDownIcon,
  EyeCloseIcon,
  EyeIcon,
} from '../../icons';
import { useRouter, usePathname  } from "next/navigation";
import { getProductByID, getProducts } from "@/services/apiService";

type SelectOption = {
  value: string;
  label: string;
};

interface Props {
  mode: "add" | "edit";
  initialData?: {
    ID?: string;
    ProductID: string;
    Plan: string;
    Price: number;
    DurationMonths: number;
    CreatedAt: string;
  };
  onSubmit: (data: any) => void;
}

export default function PlansForm({ mode, initialData, onSubmit }: Props) {

  const router = useRouter();

  const pathname = usePathname();
  const pathPrefix = pathname.split("/")[1]; // akan menangkap 'user', 'owner', atau 'admin'
    
  const [title, setTitle] = useState("");
  const [optionsProduct, setOptionsProduct] = useState<SelectOption[]>([]);

  const optionsPlan = [
    { value: "Free", label: "Free" },
    { value: "Standard", label: "Standard" },
    { value: "Premium", label: "Premium" },
  ];

  const [form, setForm] = useState({
    ProductID: initialData?.ProductID || "",
    Plan: initialData?.Plan || "",
    Price: initialData?.Price || 0,
    DurationMonths: initialData?.DurationMonths || "",
  });

  useEffect(() => {
    const loadOptions = async () => {
      if (mode === "edit" && initialData?.ProductID) {
        const product = await getProductByID({ id: initialData.ProductID });
        const singleOption = {
          label: product.Name,
          value: product.ID,
        };
        setOptionsProduct([singleOption]);
        setForm({
          ProductID: initialData.ProductID,
          Plan: initialData.Plan,
          Price: initialData.Price,
          DurationMonths: initialData.DurationMonths,
        });
        setTitle("Edit Product");
      } else {
        setTitle("Tambah Product");
        const products = await getProducts();
        const mappedOptions = products.data.map((product: any) => ({
          label: product.Name,
          value: product.ID,
        }));
        setOptionsProduct(mappedOptions);
      }
    };
    loadOptions();
  }, [mode, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <ComponentCard title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
      <div>
          <Label>Select Product</Label>
          <div className="relative">
            <Select
              options={optionsProduct}
              value={form.ProductID}
              placeholder="Select an option"
              onChange={(value) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  ProductID: value,
                }))
              }
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Select Plan</Label>
          <div className="relative">
            <Select
              options={optionsPlan}
              value={form.Plan}
              placeholder="Select an option"
              onChange={(value) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  Plan: value,
                }))
              }
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div>
          <Label>Price</Label>
          <Input
            type="number"
            placeholder="Enter Price"
            name="Price"
            value={form.Price}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Duration Month</Label>
          <Input
            type="number"
            placeholder="Enter Duration Month"
            name="DurationMonths"
            value={form.DurationMonths}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            disabled={!form.Price || !form.DurationMonths}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {mode === "add" ? "Add Plan" : "Update Plan"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${pathPrefix}/plans`)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Kembali
          </button>
        </div>

      </form>
    </ComponentCard>
  );
}
