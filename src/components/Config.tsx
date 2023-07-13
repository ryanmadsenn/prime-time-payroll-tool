import { Box } from "@chakra-ui/react";
import ConfigForm from "./ConfigForm";

interface ConfigProps {
  setConfig: (report: QueryConfig) => void;
  loading?: boolean;
  currentReport?: number;
  downloadReport: () => void;
}

const Config = ({
  setConfig,
  loading,
  currentReport,
  downloadReport,
}: ConfigProps) => {
  return (
    <Box
      position="sticky"
      display="inline-block"
      w="300px"
      flexShrink={0}
      bg="whitesmoke"
      p="10px"
    >
      <ConfigForm
        setConfig={setConfig}
        loading={loading}
        currentReport={currentReport}
        downloadReport={downloadReport}
      />
    </Box>
  );
};

export default Config;
