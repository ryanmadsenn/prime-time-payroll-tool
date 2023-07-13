// import { IpcRenderer } from "electron";
// eslint-disable-next-line
/// <reference types="react-scripts" />

interface Window extends Window {
  apiKey: string;
  electron: {
    ipcRenderer: any;
  };
}

interface QueryConfig {
  report: number;
  clinic: number;
  startDate: string;
  endDate: string;
  hour: number[];
  hygienistPay: number;
  assistantPay: number;
  frontDeskPay: number;
}

interface HygienistReport {
  ProvHyg: number;
  FName: string;
  LName: string;
  CompletedAppts: number;
  Pay: number;
  ReappointmentRate: number;
}

interface HygienistAppointment {
  AptNum: number;
  PatFName: string;
  PatLName: string;
  ApptDate: string;
  ApptHour: number;
  Reappointed: boolean;
}

interface AssistantReportRaw {
  EmployeeNum: number;
  FName: string;
  LName: string;
  DatesWorked: string;
}

interface AssistantReport {
  EmployeeNum: number;
  FName: string;
  LName: string;
  DatesWorked: string[];
  Pay: number;
  DateInfo?: AssistantDateInfo[];
}

interface PrimeTimePayReport {
  AptDate: string;
  PtPay: number;
  NumPrimeTimeAppts: number;
  NumHygienists: number;
}

interface ReappointmentRateReport {
  ProvHyg: number;
  FName: string;
  LName: string;
  CompletedAppts: number;
  ReappointmentRate: number;
}

interface AssistantDateInfo {
  Date: string;
  NumPrimeTimeAppts: number;
  NumHygienists: number;
  Pay: number;
}
