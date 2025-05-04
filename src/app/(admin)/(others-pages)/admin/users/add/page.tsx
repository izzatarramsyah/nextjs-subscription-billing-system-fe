// src/app/(admin)/(others-pages)/users/add/page.tsx
"use client";

import React, { useState } from "react";
import UserForm from "@/components/users/UserForm";
import { register } from "@/services/authService";
import Alert from "@/components/ui/alert/Alert";

export default function AddUserPage() {

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      const response = await register({ 
        role : data.Role, 
        email : data.Email, 
        password : data.Password 
      });
      if (response.status === 200) {
        setAlert({
          variant: 'success',
          title: 'User Created',
          message: 'User has been successfully created.',
        });
      } else {
        setAlert({
          variant: 'error',
          title: 'User Created',
          message: 'Failed Create User.',
        });
      }
      setTimeout(() => {
        setAlert(null); // Hide alert after 3 seconds
      }, 3000);
    } catch (err) {
      console.error("Error submitting user", err);
    }
  };

  return (
    <div>
      {alert && alert.variant && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
        />
      )}
      <div className="p-4">
        <UserForm mode="add" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
