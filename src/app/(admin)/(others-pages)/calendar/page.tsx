'use client'; // Ini WAJIB ditaruh di paling atas!

import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { addEventCalender, getEvents } from "@/services/apiService";
import Alert from "@/components/ui/alert/Alert";

// const initialEvents = [
//   {
//     id: "1",
//     title: "Event Conf.",
//     start: new Date().toISOString().split("T")[0],
//     extendedProps: { calendar: "Danger" },
//   },
//   {
//     id: "2",
//     title: "Meeting",
//     start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
//     extendedProps: { calendar: "Success" },
//   },
//   {
//     id: "3",
//     title: "Workshop",
//     start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
//     end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
//     extendedProps: { calendar: "Primary" },
//   },
// ];

interface EventType {
  ID: string;
  Type: string;
  Title: string;
  Description: string;
  ReminderDate: string;
  CreatedAt: string;
}

export default function page() {

  const [events, setEvents] = useState<any[]>([]);

    const [alert, setAlert] = useState<{
      variant: "success" | "error" | "warning" | "info" | null;
      title: string;
      message: string;
    } | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
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
      }
    };
  
    fetchReminders();
  }, []);

  const handleSubmit = async (data: any) => {
    console.log("Submitted form data:", data);

    const calendarType = data.extendedProps?.calendar;  
    const eventTitle = data.title;
    const eventDescription = data.description;  
    const eventStart = data.start; 

    try {
       const res = await addEventCalender({ 
          Type: calendarType,  
          Title: eventTitle,  
          Description: eventDescription, 
          ReminderDate: eventStart, 
        });
  
        setAlert({
          variant: 'success',
          title: 'User Deleted',
          message: 'User has been successfully deleted.',
        });
  
        setTimeout(() => {
          setAlert(null); 
        }, 3000);
   
      
    } catch (error) {
      console.error('Gagal hapus user', error);
    }
  };


  return (
    <div>
      {/* Tampilkan alert jika ada */}
        {alert && alert.variant && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
        />
      )}
      <div className="mt-4">
        <PageBreadcrumb pageTitle="Calendar" />
        <Calendar initialEvents={events} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
