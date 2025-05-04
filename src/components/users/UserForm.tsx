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

interface Props {
  mode: "add" | "edit";
  initialData?: {
    ID?: string;
    Username: string;
    Email: string;
    Role: string;
    Status: string;
  };
  onSubmit: (data: any) => void;
}

export default function UserForm({ mode, initialData, onSubmit }: Props) {

  const router = useRouter();

  const pathname = usePathname();
  const pathPrefix = pathname.split("/")[1]; // akan menangkap 'user', 'owner', atau 'admin'
  
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState("");

  const options = [
    { value: "admin", label: "admin" },
    { value: "subscriber", label: "subscriber" },
  ];

  const [form, setForm] = useState({
    ID: initialData?.ID || "",
    Username: initialData?.Username || "",
    Email: initialData?.Email || "",
    Role: initialData?.Role || "subscriber",
    Password: "", 
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ID: initialData.ID ?? "",
        Username: initialData.Username,
        Email: initialData.Email,
        Role: initialData.Role,
        Password: "", // Kosongkan password saat edit
      });
      setTitle("Edit User");
    } else {
      setTitle("Tambah User");
    }
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
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="info@gmail.com"
            name="Email"
            value={form.Email}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="Password"
              value={form.Password}
              onChange={handleChange}
            />
            <button
              onClick={(e) => {
                e.preventDefault(); // ✅ prevent form submit
                setShowPassword(!showPassword);
              }}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon  />
              ) : (
                <EyeCloseIcon  />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label>Select Role</Label>
          <div className="relative">
            <Select
              options={options}
              value={form.Role}
              placeholder="Select an option"
              onChange={(value) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  Role: value,
                }))
              }
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            disabled={!form.Password || !form.Email}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {mode === "add" ? "Add User" : "Update User"}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${pathPrefix}/users`)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Kembali
          </button>
        </div>

      </form>
    </ComponentCard>
  );
}
