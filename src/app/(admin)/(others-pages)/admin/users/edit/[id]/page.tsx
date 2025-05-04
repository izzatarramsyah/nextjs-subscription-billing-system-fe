"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";  // Menggunakan useParams untuk mendapatkan ID
import UserForm from "@/components/users/UserForm";
import { getUserByID, updateUser } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

export default function EditUserPage() {
  const { id } = useParams() as { id: string };  // Mengambil id dari URL
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return; // Jika id tidak ada, hentikan proses fetching

      try {
        const res = await getUserByID({ id : id });
        setUser(res); 
      } catch (error) {
        console.error("Error fetching user:", error);
        setAlert({
          variant: 'error',
          title: 'Get User',
          message: 'Failed Get User.',
        });
        setTimeout(() => {
          setAlert(null); // Hide alert after 3 seconds
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
          const response = await updateUser({ 
            id : data.ID,
            email : data.Email, 
            password : data.Password ,
            role : data.Role, 
          });
          if (response.status === 200) {
            setAlert({
              variant: 'success',
              title: 'User Updated',
              message: 'User has been successfully updated.',
            });
          } else {
            setAlert({
              variant: 'error',
              title: 'User Update',
              message: 'Failed Update User.',
            });
          }
          setTimeout(() => {
            setAlert(null); // Hide alert after 3 seconds
          }, 3000);
        } catch (err) {
          console.error("Error submitting user", err);
        }
  };

  if (loading) {
    return <div>Loading...</div>;  // Menampilkan loading state saat data user sedang diambil
  }

  if (!user) {
    return <div>User not found</div>;  // Menampilkan pesan jika user tidak ditemukan
  }

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
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <UserForm mode="edit" initialData={user} onSubmit={handleSubmit} />
      </div>
    </div>
    
  );
}
