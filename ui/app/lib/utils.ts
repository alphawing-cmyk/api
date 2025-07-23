import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO } from "date-fns";
import { toZonedTime, format } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseWebsocketMessage(message: { [key: string]: any }) {
  try {
    return JSON.parse(message?.data);
  } catch (error) {
    return message?.data;
  }
}

export function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRandomEmail() {
  const domains = ["example.com", "test.com", "demo.com"];
  return `${getRandomString(10)}@${
    domains[Math.floor(Math.random() * domains.length)]
  }`;
}

export function generateUserData() {
  const roles = ["demo", "client", "admin", "service"];
  const password = getRandomString(10);

  const userData = {
    username: getRandomString(8),
    first_name: getRandomString(5),
    last_name: getRandomString(7),
    email: getRandomEmail(),
    company: Math.random() > 0.5 ? getRandomString(10) : null,
    password: password,
    confirm_password: password,
    is_active: Math.random() > 0.5,
    role: roles[Math.floor(Math.random() * roles.length)],
  };

  return userData;
}

export function setCookie(name: string, value: string, days: number) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name: string) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isEmpty(value: null | string) {
  if (value === null || value.length === 0 || value === "") {
    return true;
  }
  return false;
}

export function formatPhone(phone: string) {
  phone = phone
    .replace(/\D+/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

  return phone;
}

export function titleCase(str: string) {
  /***
   *  Convert a string to proper casing
   *  EX: figure is converted to Figure
   */
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

export function round(value: number, precision: number | null) {
  /****
   * Round up
   */
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatCurrency(amount: number) {
  /**
   *  Format currency into units of K, M, B where
   *  K  = thousands
   *  M  = millions
   *  B  = Billions
   *
   *  SO 1200000 will be convered to $1.2M
   */

  if (amount >= 0 && amount <= 999999) {
    return round(amount / 1000, 1) + " K";
  }
  if (amount >= 1000000 && amount <= 999999999) {
    return round(amount / 1000000, 1) + " M";
  }
}

export function formatDate(date: string) {
  /***
   *  Convert a JS Date object to YYYY-mm-dd format
   */

  const nwDate = new Date(date);
  let yr = nwDate.getFullYear();
  let month =
    nwDate.getMonth() < 10 ? "0" + nwDate.getMonth() : nwDate.getMonth();
  let day = nwDate.getDate() < 10 ? "0" + nwDate.getDate() : nwDate.getDate();
  return yr + "-" + month + "-" + day;
}

export function last4(account_num: string) {
  /***
   *  Only shows the last 4 of the account #
   */
  return `****${account_num.slice(-5)}`;
}

export function formatDate2(inputDate: string) {
  /***
   *  Convert a JS Date object to MM/DD/YYYY format
   */
  // Parse the input date string as a Date object
  const dateParts = inputDate.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[2]);
  const formattedDate = new Date(year, month - 1, day);

  // Format the Date object as "MM/DD/YYYY"
  const formattedDateString = `${(formattedDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${formattedDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${formattedDate.getFullYear()}`;
  return formattedDateString;
}

export function generateRandomString(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function identifyAxiosError(error: { [key: string]: any }, router: any) {
  if (
    error?.response?.status === 401 &&
    error?.response?.data?.detail === "Could not validate credentials"
  ) {
    router.push("/login");
  }
}

export function isJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function generateRandomData(
  id: number,
  startDate: string,
  endDate: string,
  lower?: number,
  upper?: number,
  precision: number = 2
) {
  /**
   *  Generates random data for any metric
   */

  const data = [];
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (lower && upper) {
    while (currentDate <= endDateObj) {
      const xVal = currentDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const yVal = (lower + Math.random() * (upper - lower)).toFixed(precision);
      data.push({ id, xVal, yVal });

      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      id += 1;
    }
  } else {
    while (currentDate <= endDateObj) {
      const xVal = currentDate.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const yVal = Math.round(Math.random()).toFixed(precision);
      data.push({ id, xVal, yVal });

      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
      id += 1;
    }
  }
  return data;
}

export type ApiType = "settings" | "strategies";

export function getApiUrl(type: ApiType): string | undefined {
  if (type === "settings") {
    return process.env.NODE_API + ":" + process.env.NODE_API_PORT;
  }

  if (type === "strategies") {
    return process.env.FASTAPI + ":" + process.env.FASTAPI_PORT;
  }
}

export function formatDateFNS(dateString: string | null | undefined) {
  if (!dateString) return "";
  return format(new Date(dateString), "MM/dd/yyyy");
}

export function parseFormValue(
  value: FormDataEntryValue | null
): string | null {
  return value === "null" || value === "" || value === null
    ? null
    : value.toString();
}

export function convertUTCToLocal(
  utcDateString: string,
  formatString: string = "MMM d, yyyy h:mm a"
): string {
  try {
    const date = parseISO(utcDateString);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = toZonedTime(date, userTimeZone);
    return format(localDate, formatString, { timeZone: userTimeZone });
  } catch (error) {
    console.error("Error converting UTC to local time:", error);
    return utcDateString;
  }
}

export function calculateIndex(): number {
  if (typeof window === 'undefined' || typeof window.location === 'undefined') {
    return 1;
  }

  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get("page");
  const sizeParam = params.get("size");

  const page = pageParam !== null ? parseInt(pageParam, 10) : NaN;
  const size = sizeParam !== null ? parseInt(sizeParam, 10) : NaN;

  return isNaN(page) || isNaN(size) ? 1 : (page -1) * size;
}

