import { useEffect, useState } from "react";
import useQuery from "./useQuery";

const useHygienistReport = (report?: QueryConfig) => {
  const { query } = useQuery();
  const [hygienistReport, setHygienistReport] = useState<HygienistReport[]>();

  useEffect(() => {
    if (report?.report === 1) {
      getHygienistReport(report);
    }
  }, [report]);

  const getHygienistReport = async (config: QueryConfig) => {
    const body = {
      SqlCommand: `SELECT a.ProvHyg, p.FName, p.LName, COUNT(*) as 'CompletedAppts', COUNT(*) * ${config.hygienistPay} as 'Pay', 
                    (SELECT COUNT(*) 
                    FROM appointment a1 
                    WHERE a1.ProvHyg = a.ProvHyg 
                    AND AptDateTime BETWEEN '${config.startDate}' AND '${config.endDate}' 
                    AND ClinicNum = ${config.clinic}
                    AND AptStatus = 2 
                    AND 
                      (SELECT COUNT(*) FROM appointment a2 
                      WHERE a2.PatNum = a1.PatNum 
                      AND AptDateTime > a1.AptDateTime 
                      AND ClinicNum = ${config.clinic}
                      AND IsHygiene = 1)) / COUNT(*) * 100 as ReappointmentRate 
                  FROM appointment a 
                  INNER JOIN provider p 
                  ON a.ProvHyg = p.ProvNum 
                  WHERE a.AptDateTime BETWEEN '${config.startDate}' AND '${config.endDate}' 
                  AND a.ClinicNum = ${config.clinic} 
                  AND a.AptStatus = 2
                  AND p.IsSecondary = 1 
                  GROUP BY ProvHyg`,
    };

    const response = await query(body);

    if (response) {
      const report = response.map((row: HygienistReport) => {
        row.FName = row.FName.replaceAll("-2", "");
        row.LName = row.LName.replaceAll("-2", "");
        return row;
      });

      setHygienistReport(report);
    }
  };

  return { hygienistReport };
};

export default useHygienistReport;
