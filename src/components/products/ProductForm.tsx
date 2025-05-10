'use client';

import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import FileInput from "@/components/form/input/FileInput";
import {
  ChevronDownIcon,
  EyeCloseIcon,
  EyeIcon,
} from '../../icons';
import { useRouter, usePathname  } from "next/navigation";
import { getUserByRole, getUserByID } from "@/services/apiService";

type SelectOption = {
  value: string;
  label: string;
};

interface Props {
  mode: "add" | "edit";
  initialData?: {
    ID?: string;
    Name: string;
    Description: string;
    OwnerID: string;
    File: File;
  };
  onSubmit: (data: any) => void;
}

export default function ProductForm({ mode, initialData, onSubmit }: Props) {
  const router = useRouter();

  const pathname = usePathname();
  const pathPrefix = pathname.split("/")[1]; // akan menangkap 'user', 'owner', atau 'admin'


  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<SelectOption[]>([]);

  const [form, setForm] = useState({
    ID: initialData?.ID,
    Name: initialData?.Name || "",
    Description: initialData?.Description || "",
    OwnerID: initialData?.OwnerID || "",
    File: initialData?.File || "",
  });

  useEffect(() => {
    const loadOptions = async () => {
      if (mode === "edit" && initialData?.OwnerID) {
        debugger;
        const userRes = await getUserByID(initialData.OwnerID);
        const singleOption = {
          label: userRes.data.Username,
          value: userRes.data.ID,
        };
        setOptions([singleOption]);
        setForm({
          ID: initialData.ID,
          Name: initialData.Name,
          Description: initialData.Description,
          OwnerID: initialData.OwnerID,
          File: initialData.File
        });
        setTitle("Edit Product");
      } else {
        setTitle("Tambah Product");
        const userRes = await getUserByRole("owner");
        const mappedOptions = userRes.data.map((user: any) => ({
          label: user.Username,
          value: user.ID,
        }));
        setOptions(mappedOptions);
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

  const handleOwnerChange = (value: string) => {
    console.log(value)
    setForm({ ...form, OwnerID: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setForm({ ...form, File: file });
    }
  };
  return (
    <ComponentCard title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            type="text"
            name="Name"
            placeholder="Enter Name"
            value={form.Name}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            type="text"
            name="Description"
            placeholder="Enter Description"
            value={form.Description}
            onChange={handleChange}
          />
        </div>

        <div>
        <Label>Upload File</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
          {selectedFile && (
            <p className="text-sm text-gray-500 mt-1">Selected file: {selectedFile.name}</p>
          )}        
        </div>

        <div>
          <Label>Pilih Owner</Label>
          <div className="relative">
            <Select
              options={options}
              value={form.OwnerID}
              placeholder="Select an option"
              onChange={handleOwnerChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            disabled={!form.Name || !form.Description || !form.OwnerID}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {mode === "add" ? "Add Product" : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${pathPrefix}/products`)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Kembali
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}