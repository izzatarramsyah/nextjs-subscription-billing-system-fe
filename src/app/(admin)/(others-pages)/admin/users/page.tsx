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
import { getAllUsers, deleteUser } from "@/services/apiService";
import { useRouter } from "next/navigation";  // Import useRouter
import { Modal } from "@/components/ui/modal";
import { updateStatusUser } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

interface User {
  ID: string;
  Username: string;
  Email: string;
  Role: string;
  Status: string;
}

export default function UserPage() {

  const router = useRouter();  

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info" | null;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res?.status === 200 && res.data ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleAddUser = () => {
    console.log("Add new user");
    router.push("/admin/users/add");
  };

  const handleEdit = (user: User) => {
    console.log("Edit user", user);
    router.push(`/admin/users/edit/${user.ID}`);
  };

  const handlUpdateStatus = async (productId: string, selectedOption: string) => {
    const res = await updateStatusUser({ Id : productId, Status : selectedOption });
    if (res.status == 200) {
      fetchUsers();
      setAlert({
        variant: 'success',
        title: 'User Status Updated',
        message: 'User status has been successfully updated.',
      });
    } else {
      setAlert({
        variant: 'error',
        title: 'User Status Failed',
        message: 'User status failed updated.',
      });
    }
    setTimeout(() => {
      setAlert(null); 
      router.push("/admin/users");
    }, 3000);
    return;
  };
    
  const handleDelete = async (id: string) => {
    const res = await deleteUser(id);
    if (res.status == 200) {
      fetchUsers();
        setAlert({
          variant: 'success',
          title: 'User Deleted',
          message: 'User has been successfully deleted.',
        });
    } else {
        setAlert({
          variant: 'error',
          title: 'User Deleted Failed',
          message: 'user failed to delete.',
         });
    }
    setTimeout(() => {
      setAlert(null); 
    }, 3000);
    return;
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
            <span className="text-lg font-semibold">User Management</span>
            <button
              onClick={handleAddUser}
              className="flex items-center justify-between gap-2 bg-primary text-black px-4 py-2 rounded hover:bg-primary-dark text-sm"
            >
              <span>Add User</span>
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
                      Username
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Role
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
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {users.map((user) => (
                    <TableRow key={user.ID}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.Username}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.Email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.Role}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <select
                          className="border rounded px-2 py-1 bg-white dark:bg-dark-900 text-sm"
                          value={user.Status} 
                          onChange={(e) => {
                            setSelectedUserId(user.ID);
                            setNewStatus(e.target.value);
                            setConfirmModalOpen(true);
                          }}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                            onClick={() => {setSelectedUserId(user.ID);
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

          <Modal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
           <div className="p-6">
             <h2 className="text-lg font-semibold mb-4">Konfirmasi Perubahan Status</h2>
             <p className="mb-6">
               Apakah kamu yakin ingin mengubah status user ini menjadi{" "}
               <span className="font-bold text-blue-600">"{newStatus === 'active' ? 'Aktif' : 'Tidak Aktif'}"</span>?
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
                if (selectedUserId && newStatus) {
                  handlUpdateStatus(selectedUserId, newStatus); 
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

          <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
              <p className="mb-6">Apakah kamu yakin ingin menghapus setSelectedUserId ini?</p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (selectedUserId) {
                      handleDelete(selectedUserId);
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
