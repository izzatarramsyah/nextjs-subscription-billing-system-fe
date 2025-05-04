"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSubscribersByOwnerID } from "@/services/apiService";
import { format } from 'date-fns';

interface Subscribers {
  user_name: string;
  email: string;
  product_name: string;
  plan_name: string;
  plan_price: string;
  start_date: string;
  end_date: string;
}

export default function SubscribersPage() {

  const [subscribers, setSubscribers] = useState<Subscribers[]>([]);

  const calculateDaysLeft = (endDate: string): string => {
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} hari tersisa` : "Berakhir";
  };

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await getSubscribersByOwnerID();
        setSubscribers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchSubscribers();
  }, []);

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-lg font-semibold">List Subscribers</span>
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
                    Subsciber
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Plan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Duration Left
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {subscribers.map((subscriber, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {subscriber.user_name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {subscriber.email}
                      </span>
                    </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {subscriber.product_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {subscriber.plan_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      Rp. {subscriber.plan_price}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {subscriber.end_date
                        ? calculateDaysLeft(subscriber.end_date)
                        : "Tidak ada tanggal"}
                    </TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
