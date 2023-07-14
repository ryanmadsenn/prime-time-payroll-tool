import {
  Flex,
  Grid,
  Box,
  Center,
  Text,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Skeleton,
  Accordion,
} from "@chakra-ui/react";
import HygienistReportAccordion from "./HygienistReportAccordion";
import AssistantReportAccordion from "./AssistantReportAccordion";
import ReappointmentRateAccordion from "./ReappointmentRateAccordion";

interface ReportViewerProps {
  config?: QueryConfig;
  currentReport?: number;
  hygienistReport?: HygienistReport[];
  assistantReport?: AssistantReport[];
  frontDeskReport?: AssistantReport[];
  reappointmentRateReport?: ReappointmentRateReport[];
  loading?: boolean;
}

const ReportViewer = ({
  config,
  currentReport,
  hygienistReport,
  assistantReport,
  frontDeskReport,
  reappointmentRateReport,
  loading,
}: ReportViewerProps) => {
  return currentReport === 1 &&
    !loading &&
    config &&
    hygienistReport &&
    assistantReport &&
    frontDeskReport ? (
    <Tabs colorScheme="teal" w="100%" overflowY="auto">
      <TabList>
        <Tab>Hygienists</Tab>
        <Tab>Assistants</Tab>
        <Tab>Front Desk</Tab>
        <Tab>Combined</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p="none">
          <Accordion allowMultiple={true}>
            <Grid
              templateColumns="1fr 1fr 1fr 1fr 20px"
              p="10px 25px"
              fontFamily="heading"
              textTransform="uppercase"
              fontWeight="bold"
              fontSize="12px"
              color="gray.600"
            >
              <Box textAlign="left">Hygienist</Box>
              <Box>Appts Completed</Box>
              <Box>Prime-time Pay</Box>
              <Box>Reappointment Rate</Box>
            </Grid>
            {hygienistReport?.map((row) => (
              <HygienistReportAccordion hygienistReport={row} config={config} />
            ))}
          </Accordion>
        </TabPanel>
        <TabPanel p="none">
          <Accordion allowMultiple={true}>
            <Grid
              templateColumns="1fr 1fr 20px"
              p="10px 25px"
              fontFamily="heading"
              textTransform="uppercase"
              fontWeight="bold"
              fontSize="12px"
              color="gray.600"
            >
              <Box textAlign="left">Assistant</Box>
              <Box>Prime-time Pay</Box>
            </Grid>
            {assistantReport?.map((row) => (
              <AssistantReportAccordion assistantReport={row} />
            ))}
          </Accordion>
        </TabPanel>
        <TabPanel p="none">
          <Accordion allowMultiple={true}>
            <Grid
              templateColumns="1fr 1fr 20px"
              p="10px 25px"
              fontFamily="heading"
              textTransform="uppercase"
              fontWeight="bold"
              fontSize="12px"
              color="gray.600"
            >
              <Box textAlign="left">Assistant</Box>
              <Box>Prime-time Pay</Box>
            </Grid>
            {frontDeskReport?.map((row) => (
              <AssistantReportAccordion assistantReport={row} />
            ))}
          </Accordion>
        </TabPanel>
        <TabPanel p="0 10px">
          <TableContainer overflowY="auto" flexGrow={1}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th p="10px 15px" w="50%">
                    Hygienist
                  </Th>
                  <Th p="10px 15px" w="50%">
                    Prime-time Pay
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {hygienistReport?.map((row) => (
                  <Tr key={row.ProvHyg}>
                    <Td>{`${row.FName} ${row.LName}`}</Td>
                    <Td>${row.Pay}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Table variant="simple" size="sm">
              <Thead
                py="10px"
                position="sticky"
                top="0"
                zIndex={1}
                bg="white"
                outline="solid 1px #efefef"
              >
                <Tr>
                  <Th p="10px 15px" w="50%">
                    Assistant
                  </Th>
                  <Th p="10px 15px" w="50%">
                    Prime-time Pay
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {assistantReport?.map((row) => (
                  <Tr key={row.EmployeeNum}>
                    <Td>{`${row.FName} ${row.LName}`}</Td>
                    <Td>${row.Pay.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Table variant="simple" size="sm">
              <Thead
                py="10px"
                position="sticky"
                top="0"
                zIndex={1}
                bg="white"
                outline="solid 1px #efefef"
              >
                <Tr>
                  <Th p="10px 15px" w="50%">
                    Front Desk Employee
                  </Th>
                  <Th p="10px 15px" w="50%">
                    Prime-time Pay
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {frontDeskReport?.map((row) => (
                  <Tr key={row.EmployeeNum}>
                    <Td>{`${row.FName} ${row.LName}`}</Td>
                    <Td>${row.Pay.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ) : currentReport === 2 && !loading && config && reappointmentRateReport ? (
    <Accordion allowMultiple={true} w="100%">
      <Grid
        templateColumns="1fr 1fr 1fr 1fr 20px"
        p="10px 25px"
        fontFamily="heading"
        textTransform="uppercase"
        fontWeight="bold"
        fontSize="12px"
        color="gray.600"
      >
        <Box textAlign="left">Hygienist</Box>
        <Box>Appts Completed</Box>
        <Box>Prime-time Pay</Box>
        <Box>Reappointment Rate</Box>
      </Grid>
      {reappointmentRateReport?.map((row) => (
        <ReappointmentRateAccordion
          reappointmentRateReport={row}
          config={config}
        />
      ))}
    </Accordion>
  ) : loading ? (
    <>
      <Flex flexDir="column" p="10px" gap="10px" w="100%">
        <Flex gap="5px">
          <Skeleton w="100px" h="30px" />
          <Skeleton w="100px" h="30px" />
          <Skeleton w="100px" h="30px" />
        </Flex>
        <Skeleton w="100%" h="30px" />
        <Flex flexDir="column" gap="5px" w="100%">
          <Skeleton w="100%" h="40px" />
          <Skeleton w="100%" h="40px" />
          <Skeleton w="100%" h="40px" />
          <Skeleton w="100%" h="40px" />
          <Skeleton w="100%" h="40px" />
        </Flex>
      </Flex>
    </>
  ) : (
    <Center h="100%" w="100%">
      <Text>Select a Report to View</Text>
    </Center>
  );
};

export default ReportViewer;
