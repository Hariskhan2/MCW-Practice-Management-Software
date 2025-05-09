"use client";

import { useEffect } from "react";
import { format, addMinutes } from "date-fns";
import { UseAppointmentDataProps } from "../types";

export function useAppointmentData({
  open,
  selectedDate,
  effectiveClinicianId,
  appointmentData,
  setAppointmentFormValues,
  setEventFormValues,
  setActiveTab,
  form,
}: UseAppointmentDataProps) {
  // Set initial form values when dialog opens
  useEffect(() => {
    if (open && !appointmentData) {
      // Check if there's a selected time slot in session storage
      const selectedTimeSlotData =
        window.sessionStorage.getItem("selectedTimeSlot");
      let startTime, endTime;

      if (selectedTimeSlotData) {
        const { startTime: selectedStart, endTime: selectedEnd } =
          JSON.parse(selectedTimeSlotData);
        startTime = selectedStart;
        endTime = selectedEnd;
        // Clear the session storage after use
        window.sessionStorage.removeItem("selectedTimeSlot");
      } else {
        // Default times if no selection was made
        startTime = format(new Date(), "h:mm a");
        endTime = format(addMinutes(new Date(), 30), "h:mm a");
      }

      // Initialize appointment form values
      setAppointmentFormValues({
        type: "appointment",
        eventName: "",
        clientType: "individual",
        client: "",
        clinician: effectiveClinicianId || "",
        selectedServices: [{ serviceId: "", fee: 0 }],
        startDate: selectedDate ? selectedDate : new Date(),
        endDate: selectedDate ? selectedDate : new Date(),
        startTime: startTime,
        endTime: endTime,
        location: "sp",
        recurring: false,
        allDay: false,
        cancelAppointments: true,
        notifyClients: true,
      });

      // Initialize event form values
      setEventFormValues({
        type: "event",
        eventName: "",
        clientType: "individual",
        client: "",
        clinician: effectiveClinicianId || "",
        selectedServices: [],
        startDate: selectedDate ? selectedDate : new Date(),
        endDate: selectedDate ? selectedDate : new Date(),
        startTime: startTime,
        endTime: endTime,
        location: "sp",
        recurring: false,
        allDay: false,
        cancelAppointments: false,
        notifyClients: false,
      });
    }
  }, [
    open,
    selectedDate,
    effectiveClinicianId,
    setAppointmentFormValues,
    setEventFormValues,
    appointmentData,
  ]);

  // Handle viewing/editing existing appointment data
  useEffect(() => {
    if (appointmentData && open) {
      const parseDateTime = (dateString: string) => {
        const date = new Date(dateString);
        // Adjust for timezone offset
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() + userTimezoneOffset);
      };

      // Format dates from appointment data
      const startDate = appointmentData.start_date
        ? parseDateTime(appointmentData.start_date)
        : new Date();

      const endDate = appointmentData.end_date
        ? parseDateTime(appointmentData.end_date)
        : new Date();

      // Format times
      const startTime = format(startDate, "h:mm a");
      const endTime = format(endDate, "h:mm a");

      // Determine appointment type
      const rawType = appointmentData.type?.toLowerCase() || "appointment";
      const type = (rawType === "event" ? "event" : "appointment") as
        | "appointment"
        | "event";

      // Set active tab based on appointment type
      setActiveTab(type);

      // Ensure clientType is properly typed
      const clientType = (
        appointmentData.client_type === "group" ? "group" : "individual"
      ) as "individual" | "group";

      // Create form values from appointment data
      const formValues = {
        type,
        eventName: appointmentData.title || "",
        clientType,
        client: appointmentData.client_id || "",
        clinician: appointmentData.clinician_id || effectiveClinicianId || "",
        selectedServices: appointmentData.services?.map((s) => ({
          serviceId: s.id,
          fee: s.rate || 0,
        })) || [{ serviceId: "", fee: 0 }],
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        status: appointmentData.status || "pending",
        location: appointmentData.location_id || "",
        recurring: appointmentData.is_recurring || false,
        allDay: appointmentData.is_all_day || false,
        cancelAppointments: true,
        notifyClients: true,
      };
      // Update form values based on type
      if (type === "appointment") {
        setAppointmentFormValues(formValues);
      } else if (type === "event") {
        setEventFormValues(formValues);
      }

      // Reset the form with the appointment data
      form.reset(formValues);
    }
  }, [
    appointmentData,
    open,
    form,
    setAppointmentFormValues,
    setEventFormValues,
    setActiveTab,
    effectiveClinicianId,
  ]);
}
