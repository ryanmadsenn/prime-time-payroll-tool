import { Flex, Heading, Image } from "@chakra-ui/react";

const Banner = () => {
  return (
    <Flex
      id="banner"
      backgroundColor="#666"
      justifyContent="space-between"
      alignItems="center"
      padding="10px"
      h="58px"
    >
      <Image
        src="./images/pd_logo_white.png"
        alt="Prime Dental Logo"
        w="90px"
      />
      <Heading as="h1" fontSize="18px" fontWeight={300} color="white">
        Prime Time Payroll Tool
      </Heading>
    </Flex>
  );
};

export default Banner;
