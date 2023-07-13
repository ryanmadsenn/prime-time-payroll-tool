import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Grid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface AssistantReportAccordionProps {
  assistantReport: AssistantReport;
}

const AssistantReportAccordion = ({
  assistantReport,
}: AssistantReportAccordionProps) => {
  return (
    <AccordionItem key={assistantReport.EmployeeNum}>
      {({ isExpanded }) => (
        <>
          <AccordionButton
            transition="border 0.05s step-end"
            borderLeft={isExpanded ? "solid 1px #999" : "none"}
            borderRight={isExpanded ? "solid 1px #999" : "none"}
            borderTop={isExpanded ? "solid 1px #999" : "none"}
            borderBottom={isExpanded ? "solid 1px #DEDEDE" : "none"}
          >
            <Grid templateColumns="1fr 1fr 20px" w="100%" px="10px">
              <Text
                textAlign="left"
                fontWeight={300}
              >{`${assistantReport.FName} ${assistantReport.LName}`}</Text>
              <Text textAlign="left" fontWeight={300}>
                ${assistantReport.Pay.toFixed(2)}
              </Text>
              <AccordionIcon justifySelf="right" />
            </Grid>
          </AccordionButton>
          <AccordionPanel
            p="0 10px"
            borderLeft="solid 1px #999"
            borderRight="solid 1px #999"
            borderBottom="solid 1px #999"
          >
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th py="10px">Date</Th>
                  <Th py="10px"># Completed Prime Time Appts</Th>
                  <Th py="10px"># Hygienists Working</Th>
                  <Th py="10px">Prime Time Pay</Th>
                </Tr>
              </Thead>
              <Tbody>
                {assistantReport?.DateInfo &&
                  assistantReport?.DateInfo.map((row) => (
                    <Tr>
                      <Td>{row.Date}</Td>
                      <Td>{row.NumPrimeTimeAppts}</Td>
                      <Td>{row.NumHygienists}</Td>
                      <Td>${row.Pay.toFixed(2)}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

export default AssistantReportAccordion;
