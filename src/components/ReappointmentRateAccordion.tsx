import { useState, useEffect } from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";
import useHygienistAppointmentQuery from "../hooks/useHygienistAppointmentQuery";

interface ReappointmentRateAccordionProps {
  reappointmentRateReport: ReappointmentRateReport;
  config: QueryConfig;
}

const ReappointmentRateAccordion = ({
  reappointmentRateReport,
  config,
}: ReappointmentRateAccordionProps) => {
  const { hygienistAppointments, getHygienistAppointments } =
    useHygienistAppointmentQuery();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isExpanded && !hygienistAppointments) {
      setLoading(true);
      getHygienistAppointments(reappointmentRateReport, config);
    }

    setLoading(false);
  }, [isExpanded, hygienistAppointments]);

  return (
    <AccordionItem key={reappointmentRateReport.ProvHyg}>
      {({ isExpanded }) => (
        <>
          <AccordionButton
            transition="border 0.05s step-end"
            borderLeft={isExpanded ? "solid 1px #999" : "none"}
            borderRight={isExpanded ? "solid 1px #999" : "none"}
            borderTop={isExpanded ? "solid 1px #999" : "none"}
            borderBottom={isExpanded ? "solid 1px #DEDEDE" : "none"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Grid templateColumns="1fr 1fr 1fr 1fr 20px" w="100%" px="10px">
              <Text
                textAlign="left"
                fontWeight={300}
              >{`${reappointmentRateReport.FName} ${reappointmentRateReport.LName}`}</Text>
              <Text textAlign="left" fontWeight={300}>
                {reappointmentRateReport.CompletedAppts}
              </Text>
              <Text
                textAlign="left"
                fontWeight={300}
              >{`${reappointmentRateReport.ReappointmentRate.toFixed(
                2
              )}%`}</Text>
              <AccordionIcon justifySelf="right" />
            </Grid>
          </AccordionButton>
          <AccordionPanel
            p="0 10px"
            borderLeft="solid 1px #999"
            borderRight="solid 1px #999"
            borderBottom="solid 1px #999"
          >
            {hygienistAppointments && !loading ? (
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th py="10px">Appt Date</Th>
                    <Th py="10px">Appt Hour</Th>
                    <Th py="10px">Patient</Th>
                    <Th py="10px">Re-appointed</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hygienistAppointments.map((appointment) => (
                    <Tr key={`${appointment.AptNum}`}>
                      <Td>{appointment.ApptDate}</Td>
                      <Td>
                        {appointment.ApptHour < 12
                          ? `${appointment.ApptHour} am`
                          : appointment.ApptHour % 12 !== 0
                          ? `${appointment.ApptHour % 12} pm`
                          : `12 pm`}
                      </Td>
                      <Td>{`${appointment.PatFName} ${appointment.PatLName}`}</Td>
                      <Td>
                        {appointment.Reappointed ? (
                          <CheckCircleIcon color="green.400" />
                        ) : (
                          <SmallCloseIcon
                            color="white"
                            bg="red.400"
                            borderRadius="50%"
                          />
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Center p="10px">
                <Spinner />
              </Center>
            )}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

export default ReappointmentRateAccordion;
