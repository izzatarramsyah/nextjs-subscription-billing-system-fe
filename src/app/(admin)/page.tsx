"use client";

import dynamic from "next/dynamic";
import type { Metadata } from "next";
import React, { useEffect, useState } from "react";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { getDashboardInfo } from "@/services/apiService";

// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

const EcommerceMetrics = dynamic(() => import("@/components/ecommerce/EcommerceMetrics"), { ssr: false });
const MonthlySalesChart = dynamic(() => import("@/components/ecommerce/MonthlySalesChart"), { ssr: false });
const MonthlyTarget = dynamic(() => import("@/components/ecommerce/MonthlyTarget"), { ssr: false });
const RecentOrders = dynamic(() => import("@/components/ecommerce/RecentOrders"), { ssr: false });

interface Dashboard {
  total_subscribers: number;
  total_orders: number;
  monthly_sales: number;
  target_revenue: number;
  monthly_percentage: number;
  revenue_per_month: {
    [key: string]: number;
  };
  today_revenue: number;
  monthly_revenue: number;
  recent_orders: OrderSummary[];
}

interface OrderSummary {
  order_id: string;
  subscriber: string;
  product_name: string;
  plan_name: string;
  plan_price: number;
  created_at: string; 
  status: "active" | "inactive";
}

export default function DashboardPage() {

  const [dashboardInfo, setDashboardInfo] = useState<Dashboard>();
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardInfo();
        debugger;
        setDashboardInfo(res.status == 200 ? res.data : null);
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      }
    };
  
    fetchDashboard();
  }, []);

  if (!dashboardInfo) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics dashboardInfo={dashboardInfo} />

        <MonthlySalesChart revenuePerMonth={dashboardInfo?.revenue_per_month ?? {}} />
        </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget dashboardInfo={dashboardInfo}/>
      </div>

      <div className="col-span-12">
        <RecentOrders recent_orders={dashboardInfo?.recent_orders ?? []} />
      </div>
    </div>
  );
}
