/**
 * Date utility functions for handling Vietnam timezone and formatting
 */

import { format, addMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

// Vietnam timezone constant
export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * Get current time in Vietnam timezone
 * @returns Date object in Vietnam timezone
 */
export const getVietnamTime = (): Date => {
  return toZonedTime(new Date(), VIETNAM_TIMEZONE);
};

/**
 * Get minimum allowed start time (current Vietnam time + specified minutes)
 * @param minutesToAdd - Number of minutes to add to current time (default: 5)
 * @returns Date object representing minimum allowed time
 */
export const getMinimumStartTime = (minutesToAdd: number = 5): Date => {
  const vietnamNow = getVietnamTime();
  return addMinutes(vietnamNow, minutesToAdd);
};

/**
 * Convert Vietnam time to UTC for server submission
 * @param vietnamTime - Date object representing time in Vietnam
 * @returns Date in UTC
 */
export const convertVietnamTimeToUTC = (vietnamTime: Date): Date => {
  // Create a date string in ISO format but treat it as Vietnam time
  const year = vietnamTime.getFullYear();
  const month = String(vietnamTime.getMonth() + 1).padStart(2, "0");
  const date = String(vietnamTime.getDate()).padStart(2, "0");
  const hours = String(vietnamTime.getHours()).padStart(2, "0");
  const minutes = String(vietnamTime.getMinutes()).padStart(2, "0");

  // Create ISO string representing Vietnam time, then convert to UTC
  const vietnamTimeString = `${year}-${month}-${date}T${hours}:${minutes}:00+07:00`;
  return new Date(vietnamTimeString);
};

/**
 * Convert UTC time to Vietnam timezone for display
 * @param utcTime - Date in UTC
 * @returns Date in Vietnam timezone
 */
export const convertUTCToVietnamTime = (utcTime: Date): Date => {
  return toZonedTime(utcTime, VIETNAM_TIMEZONE);
};

/**
 * Format date for display in Vietnamese format
 * @param date - Date to format
 * @param formatString - Format string (default: "dd/MM/yyyy HH:mm")
 * @returns Formatted date string
 */
export const formatVietnamDate = (
  date: Date,
  formatString: string = "dd/MM/yyyy HH:mm"
): string => {
  return format(date, formatString, { locale: vi });
};

/**
 * Check if a date is today in Vietnam timezone
 * @param date - Date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date): boolean => {
  const vietnamNow = getVietnamTime();
  return date.toDateString() === vietnamNow.toDateString();
};

/**
 * Get today's date in Vietnam timezone (start of day)
 * @returns Date object representing start of today in Vietnam timezone
 */
export const getTodayVietnam = (): Date => {
  const vietnamNow = getVietnamTime();
  return new Date(
    vietnamNow.getFullYear(),
    vietnamNow.getMonth(),
    vietnamNow.getDate()
  );
};

/**
 * Check if a date is before today in Vietnam timezone
 * @param date - Date to check
 * @returns True if the date is before today
 */
export const isBeforeToday = (date: Date): boolean => {
  const today = getTodayVietnam();
  return date < today;
};

/**
 * Format date using Vietnamese locale (compatible with existing code)
 * @param dateString - ISO date string
 * @returns Formatted date string in Vietnamese format
 */
export const formatDateVN = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Create a date with specific time in Vietnam timezone
 * @param date - Base date
 * @param hours - Hours (0-23)
 * @param minutes - Minutes (0-59)
 * @returns Date object representing the time in Vietnam timezone
 */
export const createVietnamDateTime = (
  date: Date,
  hours: number,
  minutes: number
): Date => {
  // Create a new date with the specified time
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

/**
 * Format time for HTML time input (HH:mm format)
 * @param date - Date to format
 * @returns Time string in HH:mm format
 */
export const formatTimeForInput = (date: Date): string => {
  return format(date, "HH:mm");
};
