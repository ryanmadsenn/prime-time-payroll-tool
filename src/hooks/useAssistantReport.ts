import { useEffect, useState } from "react";
import useQuery from "./useQuery";

const useAssistantReport = (report?: QueryConfig) => {
  const { query } = useQuery();
  const [assistantReport, setAssistantReport] = useState<AssistantReport[]>();

  useEffect(() => {
    if (report?.report === 1) {
      getAssistantReport(report);
    }
  }, [report]);

  const getAssistantReport = async (config: QueryConfig) => {
    const ptPayBody = {
      SqlCommand: `SELECT DATE_FORMAT(AptDateTime, '%Y-%m-%d') as AptDate, 
                    COUNT(*) as NumPrimeTimeAppts,
                    COUNT(*) * ${
                      config.assistantPay
                    } / COUNT(DISTINCT ProvHyg) as PtPay,
                    COUNT(DISTINCT ProvHyg) as NumHygienists
                    FROM appointment 
                    WHERE AptDateTime BETWEEN '${config.startDate}' AND '${
        config.endDate
      }' 
                    AND HOUR(AptDateTime) IN (${config.hour.join(", ")}) 
                    AND ClinicNum in (${config.clinic}) 
                    AND IsHygiene = 1 
                    AND AptStatus = 2 
                    GROUP BY AptDate`,
    };

    const timeClockBody = {
      SqlCommand: `SELECT e.FName, e.LName, c.EmployeeNum, GROUP_CONCAT(DATE_FORMAT(TimeEntered1, '%Y-%m-%d') SEPARATOR ', ') as DatesWorked 
                    FROM clockevent c
                    INNER JOIN employee e
                    ON e.EmployeeNum = c.EmployeeNum
                    WHERE TimeEntered1 BETWEEN '${config.startDate}' AND '${config.endDate}'
                    AND c.EmployeeNum IN
                        (SELECT u.EmployeeNum
                        FROM userod u
                        INNER JOIN usergroupattach ug
                        ON u.UserNum = ug.UserNum
                        INNER JOIN employee e1
                        ON u.EmployeeNum = e1.EmployeeNum
                        WHERE u.IsHidden != 1
                        AND ug.usergroupnum IN (2))
                    AND ClinicNum IN (${config.clinic})
                    GROUP BY EmployeeNum ORDER BY c.EmployeeNum`,
    };

    const ptPay = await query(ptPayBody);
    const assistantReportRaw = await query(timeClockBody);

    if (ptPay && assistantReportRaw) {
      let assistantReport = assistantReportRaw.map(
        (employee: AssistantReportRaw) => {
          const datesWorked = employee.DatesWorked.split(", ");

          return {
            ...employee,
            DatesWorked: datesWorked,
            Pay: 0,
          } as AssistantReport;
        }
      );

      ptPay.forEach((day: PrimeTimePayReport) => {
        assistantReport.forEach((employee: AssistantReport) => {
          if (employee.DatesWorked.includes(day.AptDate)) {
            employee.Pay += day.PtPay;
            if (!employee.DateInfo) {
              employee.DateInfo = [];
            }
            employee.DateInfo?.push({
              Date: day.AptDate,
              NumPrimeTimeAppts: day.NumPrimeTimeAppts,
              NumHygienists: day.NumHygienists,
              Pay:
                (config.assistantPay * day.NumPrimeTimeAppts) /
                day.NumHygienists,
            });
          }
        });
      });

      assistantReport = assistantReport?.map((row: AssistantReport) => {
        row.FName = row.FName.replaceAll("-2", "");
        row.LName = row.LName.replaceAll("-2", "");
        return row;
      });

      setAssistantReport(assistantReport);
    }
  };

  return { assistantReport };
};

export default useAssistantReport;
