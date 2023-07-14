import React, { useState, useEffect } from "react";
import { IpcRenderer } from "electron";
import {
  Text,
  Box,
  Center,
  Flex,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";
import useWindowSize from "../hooks/useWindowSize";
import useHygienistReport from "../hooks/useHygienistReport";
import useAssistantReport from "../hooks/useAssistantReport";
import useReapointmentRateReport from "../hooks/useReappointmentRateReport";
import Banner from "./Banner";
import Config from "./Config";
import ReportViewer from "./ReportViewer";
import useDownloadReport from "../hooks/useDownloadReport";
import useFrontDeskReport from "../hooks/useFrontDeskReport";
import { Formik, Form, Field } from "formik";
const ipcRenderer: IpcRenderer = window.electron.ipcRenderer;

const MainContent = () => {
  const [mainContentHeight, setMainConentHeight] = useState(0);
  const [config, setConfig] = useState<QueryConfig>();
  const [loading, setLoading] = useState<boolean>();
  const [apiKeyLoading, setApiKeyLoading] = useState<boolean>(true);
  const [currentReport, setCurrentReport] = useState<number>();
  const [apiKey, setApiKey] = useState("");
  const { windowHeight } = useWindowSize();
  const { hygienistReport } = useHygienistReport(config);
  const { assistantReport } = useAssistantReport(config);
  const { frontDeskReport } = useFrontDeskReport(config);
  const { reappointmentRateReport } = useReapointmentRateReport(config);
  const { downloadReport } = useDownloadReport(
    config,
    hygienistReport,
    assistantReport,
    frontDeskReport
  );

  useEffect(() => {
    const getApiKey = async () => {
      const key = await ipcRenderer.invoke("getApiKey");
      window.apiKey = key;
      setApiKey(key);
      setApiKeyLoading(false);
    };

    getApiKey();
  }, []);

  useEffect(() => {
    if (config) {
      setCurrentReport(config.report);
      setLoading(true);
    }
  }, [config]);

  useEffect(() => {
    if (
      (hygienistReport && assistantReport && frontDeskReport) ||
      reappointmentRateReport
    ) {
      setLoading(false);
    }
  }, [
    hygienistReport,
    assistantReport,
    frontDeskReport,
    reappointmentRateReport,
  ]);

  useEffect(() => {
    const titlebar = document.getElementById("titlebar");
    const banner = document.getElementById("banner");

    if (titlebar && banner) {
      setMainConentHeight(
        windowHeight - titlebar.offsetHeight - banner.offsetHeight
      );
    }
  }, [windowHeight]);

  return (
    <Box position="absolute" left="0" right="0" bottom="0" top="26.5">
      <Banner />
      {apiKey ? (
        <Flex h={mainContentHeight}>
          <Config
            setConfig={setConfig}
            loading={loading}
            currentReport={currentReport}
            downloadReport={downloadReport}
          />
          <ReportViewer
            config={config}
            currentReport={currentReport}
            hygienistReport={hygienistReport}
            assistantReport={assistantReport}
            frontDeskReport={frontDeskReport}
            reappointmentRateReport={reappointmentRateReport}
            loading={loading}
          />
        </Flex>
      ) : apiKeyLoading ? (
        <Center h={mainContentHeight}>
          <Spinner />
        </Center>
      ) : (
        <Center h={mainContentHeight}>
          <Flex flexDir="column" gap="5px">
            <Text>Please enter your Open Dental API Key</Text>
            <Formik
              initialValues={{
                key: "",
              }}
              onSubmit={async (values) => {
                setApiKey(values.key);
                window.apiKey = values.key;
                ipcRenderer.invoke("updateApiKey", values.key);
              }}
            >
              <Form>
                <Flex flexDir="column" gap="10px">
                  <Input
                    as={Field}
                    name="key"
                    type="text"
                    focusBorderColor="teal.400"
                  />
                  <Button type="submit">Submit</Button>
                </Flex>
              </Form>
            </Formik>
          </Flex>
        </Center>
      )}
    </Box>
  );
};

export default MainContent;
