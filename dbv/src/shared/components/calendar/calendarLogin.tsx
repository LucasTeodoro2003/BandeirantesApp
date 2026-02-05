import { useState } from "react";
import { Calendar } from "../ui/calendar";

export default function CalendarLogin() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border w-full md:w-auto"
    />
  );
}
