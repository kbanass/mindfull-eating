export function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getDayStartAndEnd(date: Date): [Date, Date] {
  const dayStart = new Date(new Date(date).setHours(0, 0, 0, 0));
  const dayEnd = new Date(new Date(date).setHours(23, 59, 59, 999));

  return [dayStart, dayEnd];
}

export function getDayStart(date: Date) {
  return new Date(new Date(date).setHours(0, 0, 0, 0));
}

export function getDayEnd(date: Date) {
  return new Date(new Date(date).setHours(23, 59, 59, 999));
}

export function getDateFromPreviusWeek(date: Date) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - 7);
  return newDate;
}

export function getDateFromNextWeek(date: Date) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 7);
  return newDate;
}

export function getFormatedDate(date: Date): string {
  const formated =
    date.getDate().toString().padStart(2, "0") +
    "." +
    (date.getMonth() + 1).toString().padStart(2, "0");
  return formated;
}

export function getFormatedTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

export function getFormatedFullDateAndTime(date: Date): string {
  return `${getFormatedDate(date)}.${date.getFullYear().toString()}, ${getFormatedTime(date)}`;
}

export function getMonthName(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[date.getMonth()];
}

export function getMonthStartAndEnd(date: Date): [Date, Date] {
  const start = getDayStart(new Date(new Date(date).setDate(1)));
  const end = getDayEnd(new Date(date.getFullYear(), date.getMonth() + 1, 0));

  return [start, end];
}
