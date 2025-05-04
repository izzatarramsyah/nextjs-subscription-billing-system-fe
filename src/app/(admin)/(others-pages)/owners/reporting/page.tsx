"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRevenueReport } from "@/services/apiService";
import DatePicker from '@/components/form/date-picker';
import Badge from '@/components/ui/badge/Badge';

interface Report{
  total_revenue: number;
  subscriptions: Subscriptions[];
}

interface Subscriptions {
  user_name: string;
  email: string;
  product_name: string;
  plan_name: string;
  plan_price: string;
  start_date: string;
  end_date: string;
  subscription_status: string;
}

export default function SubscribersPage() {

  const [selectedDates, setSelectedDates] = useState<Date | Date[] | null>(null);
  const [currentDateString, setCurrentDateString] = useState<string>("");

  const [selectedEndDates, setSelectedEndDates] = useState<Date | Date[] | null>(null);
  const [currentEndDateString, setCurrentEndDateString] = useState<string>("");

  const [report, setReport] = useState<Report>({
    total_revenue: 0,
    subscriptions: [],
  });
  
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0] + 'T00:00:00Z'; // format YYYY-MM-DDTHH:mm:ssZ
  };

  useEffect(() => {
     const fetchRevenueReport = async () => {
      try {
        const todayDate = getTodayDate();
        const res = await getRevenueReport({
          start_date: todayDate,
          end_date: todayDate,
        });
        setReport(res.data || []);
      } catch (err) {
        console.error('Failed to fetch revenue report', err);
      }
    };
    fetchRevenueReport();
  }, []); // Empty dependency array berarti ini hanya berjalan sekali saat komponen pertama kali dirender

  const handleGenerateReport = async () => {
    try {
      const res = await getRevenueReport({
        start_date: currentEndDateString,  // menggunakan tanggal input dari pengguna
        end_date: currentDateString,
      });
      setReport(res.data || []);
    } catch (err) {
      console.error('Failed to fetch revenue report', err);
    }
  };

  return (
    <div>
        {/* Revenue Summary */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-lg font-semibold">Revenue Report</span>
            <div className="flex items-center gap-3">
                <div>
                 <DatePicker
                    id="date-picker"
                    label="Date Picker Input"
                    placeholder="Select a date"
                    onChange={(dates: Date, currentDateString: string) => {
                      setSelectedDates(dates);
                      setCurrentDateString(currentDateString);
                    }}
                  />
                </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">to</span>
                <div>
                 <DatePicker
                    id="date-picker"
                    label="Date Picker Input"
                    placeholder="Select a date"
                    onChange={(dates: Date, currentDateString: string) => {
                      setSelectedEndDates(dates);
                      setCurrentEndDateString(currentDateString);
                    }}
                  />
                </div>
            <button
                onClick={handleGenerateReport}
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
            >
                Generate
            </button>
            </div>
        </div>

        {/* Revenue Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
            <div className="min-w-[900px]">
                <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Product</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Plan</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Price</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Subscribers</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Status</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Craeted At</TableCell>
                    </TableRow>
                </TableHeader>

                 <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {report.subscriptions?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-5 py-3 text-theme-sm text-gray-700 dark:text-gray-200">{item.product_name}</TableCell>
                          <TableCell className="px-5 py-3 text-theme-sm text-gray-700 dark:text-gray-200">{item.plan_name}</TableCell>
                          <TableCell className="px-5 py-3 text-theme-sm text-gray-700 dark:text-gray-200">Rp. {parseFloat(item.plan_price).toLocaleString()}</TableCell>
                          <TableCell className="px-5 py-3 text-theme-sm text-gray-700 dark:text-gray-200">{item.user_name} ({item.email})</TableCell>
                          <Badge
                            size="sm"
                            color={
                              item.subscription_status === "active"
                                ? "success"
                                : "error"
                            }
                          >
                            {item.subscription_status}
                          </Badge>
                          <TableCell className="px-5 py-3 text-theme-sm text-gray-700 dark:text-gray-200">{item.start_date}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
            </div>

            {/* Total Revenue */}
            <div className="px-5 py-4 border-t border-gray-200 dark:border-white/[0.05] flex justify-end">
            <p className="text-theme-sm font-semibold text-gray-800 dark:text-white">
            Total Revenue: Rp. {report.total_revenue.toLocaleString()}
            </p>
            </div>
        </div>
        </div>
  );
}
