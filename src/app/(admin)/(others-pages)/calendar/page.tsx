'use client'; // Ini WAJIB ditaruh di paling atas!

import dynamic from "next/dynamic";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { addEventCalender, getEvents } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";
import Cookies from 'js-cookie';

const Calendar = dynamic(() => import('@/components/calendar/Calendar'), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading calendar...</p>,
});

interface EventType {
  ID: string;
  Type: string;
  Title: string;
  Description: string;
  ReminderDate: string;
  CreatedAt: string;
}

export default function page() {

    const [role, setRole] = useState("guest");
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const calendarsEvents = {
      Event: "success",
    };

    const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
    } | null>(null);

    useEffect(() => {
      const role = Cookies.get('role') || 'guest'; 
      setRole(role);
      fetchReminders();
    }, []);

    const fetchReminders = async () => {
      setLoading(true);
      try {
        const res = await getEvents();
        const mappedEvents = res.data.map((event: EventType) => ({
          id: event.ID,
          title: event.Title,
          start: new Date(event.ReminderDate).toISOString().split("T")[0],
          extendedProps: { calendar: event.Type },
        }));
        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (data: any) => {
        const calendarType = data.extendedProps?.calendar;  
        const eventTitle = data.title;
        const eventDescription = data.description;  
        const eventStart = data.start; 

        try {
        const res = await addEventCalender({ 
            type: calendarType,  
            title: eventTitle,  
            description: eventDescription, 
            reminderDate: eventStart, 
            });
            if ( res.status == 200 ) {
            fetchReminders();
            setAlert({
                variant: 'success',
                title: 'Event Success',
                message: 'Event has been successfully created.',
            });
            } else {
            setAlert({
                variant: 'error',
                title: 'Event Failed',
                message: 'Event failed to created.',
            });
            }
            
            setTimeout(() => {
            setAlert(null); 
            }, 3000);
    
        } catch (error) {
        console.error('Gagal hapus user', error);
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
      <div className="mt-4">
        <PageBreadcrumb pageTitle="Calendar" />
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading events...</p>
          ) : (
            <Calendar
              initialEvents={events}
              onSubmit={handleSubmit}
              userRole={role}
              calendarsEvents={calendarsEvents}
            />
          )}
      </div>
    </div>
  );
}
