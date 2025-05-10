"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";  
import { getUserByID, updateUser } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";
import { useRouter } from "next/navigation"; 

const UserForm = dynamic(() => import('@/components/users/UserForm'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading Form...</p>,
});

export default function EditUserPage() {
  const router = useRouter();  
  
  const { id } = useParams() as { id: string };  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return; 
      try {
        const res = await getUserByID(id);
        setUser(res?.status === 200 && res.data ? res.data : []);
      } catch (error) {
        console.error("Error fetching user:", error);
        setAlert({
          variant: 'error',
          title: 'Get User',
          message: 'Failed Get User.',
        });
        setTimeout(() => {
          setAlert(null); 
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
        ID : data.ID,
        Email : data.Email, 
        Password : data.Password ,
        Role : data.Role, 
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
        setAlert(null); 
        router.push("/admin/users");
      }, 3000);
    } catch (err) {
      console.error("Error submitting user", err);
    }
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
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        {loading ? (
            <p className="text-center text-gray-500 py-10">Loading data...</p>
          ) : (
          <UserForm mode="edit" initialData={user} onSubmit={handleSubmit} />
         )}
      </div>
    </div>
    
  );
}
