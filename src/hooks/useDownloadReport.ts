import * as XLSX from "sheetjs-style";

const columnWidths = {
  1: 20,
  2: 12,
  3: 12,
  4: 12,
  5: 12,
  6: 12,
  7: 12,
  8: 12,
  9: 12,
  10: 12,
};

const useDownloadReport = (
  config?: QueryConfig,
  hygienistReport?: HygienistReport[],
  assistantReport?: AssistantReport[],
  frontDeskReport?: AssistantReport[]
) => {
  const getColFromIndex = (index: number) => {
    let i = index;
    let col = "";
    while (i > 0) {
      const remainder = i % 26;
      col = String.fromCharCode(65 + remainder - 1) + col;
      i = Math.floor(i / 26);
    }
    return col;
  };

  const generateArrayOfArrays = () => {
    // eslint-disable-next-line
    const combinedReport: any[][] = [];

    if (hygienistReport) {
      hygienistReport.forEach((report: HygienistReport) => {
        // eslint-disable-next-line
        combinedReport.push([
          `${report.FName} ${report.LName}`,
          ,
          ,
          ,
          ,
          report.Pay.toFixed(2),
        ]);
      });
    }

    if (assistantReport) {
      assistantReport.forEach((report: AssistantReport) => {
        // eslint-disable-next-line
        combinedReport.push([
          `${report.FName} ${report.LName}`,
          ,
          ,
          ,
          ,
          report.Pay.toFixed(2),
        ]);
      });
    }

    if (frontDeskReport) {
      frontDeskReport.forEach((report: AssistantReport) => {
        // eslint-disable-next-line
        combinedReport.push([
          `${report.FName} ${report.LName}`,
          ,
          ,
          ,
          ,
          report.Pay.toFixed(2),
        ]);
      });
    }

    combinedReport.sort((a, b) => a[0].localeCompare(b[0]));
    combinedReport.unshift([
      "Employee",
      "Regular Pay",
      "Overtime",
      "PTO",
      "PT Calls",
      "PT Bonus",
      "Sealants",
      "Holiday Pay",
      "Birthday Pay",
      "Mileage",
    ]);

    return combinedReport;
  };

  const downloadReport = () => {
    // Get array of arrays.
    const report = generateArrayOfArrays();
    // Create new worksheet with report.
    const ws = XLSX.utils.aoa_to_sheet(report);
    ws["!cols"] = [];

    // Add column widths and bold headers.
    for (let i = 1; i < 11; i++) {
      ws["!cols"].push({
        width: columnWidths[i as keyof typeof columnWidths],
      });

      ws[`${getColFromIndex(i)}1`].s = {
        font: {
          bold: true,
        },
      };
    }

    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;

    const startDate = dateRegex.exec(config?.startDate as string);
    const endDate = dateRegex.exec(config?.endDate as string);

    const startDateStr = `${startDate?.[2]}-${startDate?.[3]}-${startDate?.[1]}`;
    const endDateStr = `${endDate?.[2]}-${String(
      Number(endDate?.[3]) + 1
    ).padStart(2, "0")}-${endDate?.[1]}`;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${startDateStr} - ${endDateStr}`);

    XLSX.writeFile(wb, `pt_pay_report_${startDateStr}-${endDateStr}.xlsx`);
  };

  return { downloadReport };
};

export default useDownloadReport;
