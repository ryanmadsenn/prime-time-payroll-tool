import { Form, Formik } from "formik";
import { Grid, Flex, Text, Button, Box } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormCheckbox from "./FormCheckbox";

interface ConfigFormProps {
  setConfig: (report: QueryConfig) => void;
  loading?: boolean;
  currentReport?: number;
  downloadReport: () => void;
}

const primeTimePaySchema = Yup.object({
  report: Yup.number().required("Please select a report"),
  clinic: Yup.number().required("Please select a clinic"),
  startDate: Yup.date().required("Please select a start date"),
  endDate: Yup.date().required("Please select an end date"),
  hygienistPay: Yup.number().when("report", {
    is: 1,
    then: (schema) => schema.required("Please enter a hygienist pay rate"),
  }),
  assistantPay: Yup.number().when("report", {
    is: 1,
    then: (schema) => schema.required("Please enter an assistant pay rate"),
  }),
  frontDeskPay: Yup.number().when("report", {
    is: 1,
    then: (schema) => schema.required("Please enter a front desk pay rate"),
  }),
});

const ConfigForm = ({
  setConfig,
  loading,
  currentReport,
  downloadReport,
}: ConfigFormProps) => {
  return (
    <>
      <Flex h="100%" flexDir="column" justifyContent="space-between">
        <Flex flexDir="column" gap="10px">
          <Formik
            validationSchema={primeTimePaySchema}
            validateOnChange
            validateOnBlur
            initialValues={{
              report: "",
              clinic: "",
              startDate: "",
              endDate: "",
              hour: [],
              hygienistPay: "",
              assistantPay: "",
              frontDeskPay: "",
            }}
            onSubmit={async (values) => {
              // Increment end date by one day so report is inclusive
              // of the end date.
              const endDate = new Date(values.endDate);
              endDate.setDate(endDate.getDate() + 1);
              values.endDate = endDate.toISOString().split("T")[0];

              const report = {
                report: Number(values.report),
                clinic: Number(values.clinic),
                startDate: values.startDate,
                endDate: values.endDate,
                hour: values.hour.map((h: string) => Number(h)) ?? [],
                hygienistPay: Number(values?.hygienistPay) ?? undefined,
                assistantPay: Number(values?.assistantPay),
                frontDeskPay: Number(values?.frontDeskPay),
              };
              setConfig(report);
            }}
          >
            {({ handleSubmit, values, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <FormSelect
                  label="Report"
                  name="report"
                  error={errors.report}
                  touched={touched.report}
                >
                  <option value="">Select a Report</option>
                  <option value={1}>Prime-time Pay</option>
                  <option value={2}>Reappointment Rate</option>
                </FormSelect>
                <FormSelect
                  label="Clinic"
                  name="clinic"
                  error={errors.clinic}
                  touched={touched.clinic}
                >
                  <option value="">Select a Clinic</option>
                  <option value="3">Prime Dental Pasco</option>
                  <option value="1">West Richland Family Dental</option>
                </FormSelect>
                <FormInput
                  label="Start Date"
                  type="date"
                  name="startDate"
                  error={errors.startDate}
                  touched={touched.startDate}
                />
                <FormInput
                  label="End Date"
                  type="date"
                  name="endDate"
                  error={errors.endDate}
                  touched={touched.endDate}
                />
                <Box display={Number(values.report) === 1 ? "block" : "none"}>
                  <Grid mb="10px" templateColumns="1fr 1fr">
                    <Text gridColumn="1/3">Prime Time Hours</Text>
                    <Flex flexDir="column">
                      <FormCheckbox label="7am — 8am" name="hour" value="7" />
                      <FormCheckbox label="8 am — 9 am" name="hour" value="8" />
                      <FormCheckbox
                        label="9 am — 10 am"
                        name="hour"
                        value="9"
                      />
                      <FormCheckbox
                        label="10 am — 11 am"
                        name="hour"
                        value="10"
                      />
                      <FormCheckbox
                        label="11 am — 12pm"
                        name="hour"
                        value="11"
                      />
                      <FormCheckbox
                        label="12 pm — 1 pm"
                        name="hour"
                        value="12"
                      />
                    </Flex>
                    <Flex flexDir="column">
                      <FormCheckbox
                        label="1 pm — 2 pm"
                        name="hour"
                        value="13"
                      />
                      <FormCheckbox
                        label="2 pm — 3 pm"
                        name="hour"
                        value="14"
                      />
                      <FormCheckbox
                        label="3 pm — 4 pm"
                        name="hour"
                        value="15"
                      />
                      <FormCheckbox
                        label="4 pm — 5 pm"
                        name="hour"
                        value="16"
                      />
                      <FormCheckbox
                        label="5 pm — 6 pm"
                        name="hour"
                        value="17"
                      />
                      <FormCheckbox
                        label="6 pm — 7 pm"
                        name="hour"
                        value="18"
                      />
                    </Flex>
                  </Grid>
                  <FormInput
                    label="Hygienist Pay Rate"
                    type="number"
                    name="hygienistPay"
                    leftElement="$"
                    error={errors.hygienistPay}
                    touched={touched.hygienistPay}
                  />
                  <FormInput
                    label="Assistant Pay Rate"
                    type="number"
                    name="assistantPay"
                    leftElement="$"
                    error={errors.assistantPay}
                    touched={touched.assistantPay}
                  />
                  <FormInput
                    label="Front Desk Pay Rate"
                    type="number"
                    name="frontDeskPay"
                    leftElement="$"
                    error={errors.frontDeskPay}
                    touched={touched.frontDeskPay}
                  />
                </Box>
                {values.report && (
                  <Button
                    type="submit"
                    bg="#dedede"
                    boxShadow="sm"
                    w="100%"
                    _hover={{
                      borderStyle: "solid",
                      borderWidth: "2px",
                      borderColor: "teal.400",
                    }}
                    isLoading={loading}
                  >
                    Submit
                  </Button>
                )}
              </form>
            )}
          </Formik>
          {!loading && currentReport === 1 && (
            <Button
              bg="teal.400"
              _hover={{
                bg: "teal.300",
              }}
              rightIcon={<DownloadIcon />}
              onClick={downloadReport}
            >
              Download Report
            </Button>
          )}
        </Flex>
        <Text alignSelf="center">
          &copy; Prime Dental Partners {new Date(Date.now()).getFullYear()}
        </Text>
      </Flex>
    </>
  );
};

export default ConfigForm;
