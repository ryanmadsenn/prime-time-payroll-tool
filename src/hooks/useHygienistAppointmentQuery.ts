import { useState } from "react";
import useQuery from "./useQuery";

const useHygienistAppointmentQuery = () => {
  const { query } = useQuery();
  const [hygienistAppointments, setHygienistAppointments] =
    useState<HygienistAppointment[]>();

  const getHygienistAppointments = async (
    hygienistReport: HygienistReport,
    config: QueryConfig
  ) => {
    const body = {
      SqlCommand: `SELECT AptNum, p.FName as PatFName, 
                          p.LName as PatLName, 
                          DATE_FORMAT(a.AptDateTime, '%m/%d/%Y') as ApptDate, 
                          HOUR(AptDateTime) as ApptHour,
                          (SELECT COUNT(*) 
                          FROM appointment a2 
                          WHERE a2.PatNum = a.PatNum 
                          AND a2.AptDateTime > a.AptDateTime 
                          AND ClinicNum = ${config.clinic} AND IsHygiene = 1) > 0 as Reappointed 
                    FROM Appointment a
                    INNER JOIN Patient p
                    ON a.PatNum = p.PatNum
                    WHERE ProvHyg = ${hygienistReport.ProvHyg} 
                    AND AptDateTime BETWEEN '${config.startDate}' AND '${config.endDate}' 
                    AND a.ClinicNum = ${config.clinic} 
                    AND a.AptStatus = 2`,
    };

    const appts = await query(body);
    appts.sort((a: HygienistAppointment, b: HygienistAppointment) => {
      const dateA = new Date(a.ApptDate).getTime();
      const dateB = new Date(b.ApptDate).getTime();
      return dateA !== dateB ? dateA - dateB : a.ApptHour - b.ApptHour;
    });
    setHygienistAppointments(appts);
  };

  return { hygienistAppointments, getHygienistAppointments };
};

export default useHygienistAppointmentQuery;
