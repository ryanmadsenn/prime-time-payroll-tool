import { useEffect, useState } from "react";
import useQuery from "./useQuery";

const useReapointmentRateReport = (report?: QueryConfig) => {
  const { query } = useQuery();
  const [reappointmentRateReport, setReappointmentRateReport] =
    useState<ReappointmentRateReport[]>();

  useEffect(() => {
    if (report?.report === 2) {
      getReappointmentRateReport(report);
    }
  }, [report]);

  const getReappointmentRateReport = async (config: QueryConfig) => {
    const reappointmentRateBody = {
      SqlCommand: `SELECT a.ProvHyg, p.FName, p.LName, COUNT(*) as 'CompletedAppts', 
                    (SELECT COUNT(*) 
                    FROM appointment a1 
                    WHERE a1.ProvHyg = a.ProvHyg 
                    AND YEAR(AptDateTime) >= YEAR(NOW()) 
                    AND ClinicNum = ${config.clinic}
                    AND AptStatus = 2 
                    AND 
                      (SELECT COUNT(*) 
                      FROM appointment a2 
                      WHERE a2.PatNum = a1.PatNum 
                      AND AptDateTime > a1.AptDateTime 
                      AND ClinicNum = ${config.clinic}
                      AND IsHygiene = 1)) / COUNT(*) * 100 as ReappointmentRate 
                  FROM appointment a 
                  INNER JOIN provider p 
                  ON a.ProvHyg = p.ProvNum 
                  WHERE YEAR(a.AptDateTime) >= YEAR(NOW())
                  AND a.ClinicNum = ${config.clinic} 
                  AND a.AptStatus = 2 
                  AND p.IsSecondary = 1 
                  AND p.IsHidden != 1 
                  GROUP BY ProvHyg`,
    };

    setReappointmentRateReport(await query(reappointmentRateBody));
  };

  return { reappointmentRateReport };
};

export default useReapointmentRateReport;
