import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import TitleBar from "./components/TitleBar";
import MainContent from "./components/MainContent";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "Roboto",
        fontWeight: 300,
      },
    },
  },
});

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <TitleBar />
      <MainContent />
    </ChakraProvider>
  );
};

export default App;
