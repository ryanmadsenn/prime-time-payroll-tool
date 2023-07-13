import { useEffect, useState } from "react";
import useQuery from "./useQuery";

const useFrontDeskReport = (report?: QueryConfig) => {
  const { query } = useQuery();
  const [frontDeskReport, setFrontDeskReport] = useState<AssistantReport[]>();

  useEffect(() => {
    if (report?.report === 1) {
      getFrontDeskReport(report);
    }
  }, [report]);

  const getFrontDeskReport = async (config: QueryConfig) => {
    const ptPayBody = {
      SqlCommand: `SELECT DATE_FORMAT(AptDateTime, '%Y-%m-%d') as AptDate, 
                    COUNT(*) as NumPrimeTimeAppts,
                    COUNT(*) * ${
                      config.frontDeskPay
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
                        AND ug.usergroupnum IN (4))
                    AND ClinicNum IN (${config.clinic})
                    GROUP BY EmployeeNum ORDER BY c.EmployeeNum`,
    };

    const ptPay = await query(ptPayBody);
    const frontDeskReportRaw = await query(timeClockBody);

    if (ptPay && frontDeskReportRaw) {
      let frontDeskReport = frontDeskReportRaw.map(
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
        frontDeskReport.forEach((employee: AssistantReport) => {
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
                (config.frontDeskPay * day.NumPrimeTimeAppts) /
                day.NumHygienists,
            });
          }
        });
      });

      frontDeskReport = frontDeskReport?.map((row: AssistantReport) => {
        row.FName = row.FName.replaceAll("-2", "");
        row.LName = row.LName.replaceAll("-2", "");
        return row;
      });

      setFrontDeskReport(frontDeskReport);
    }
  };

  return { frontDeskReport };
};

export default useFrontDeskReport;
