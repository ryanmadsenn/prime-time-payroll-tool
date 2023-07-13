import React, { useState, useEffect } from "react";
import { Flex, Box, CloseButton } from "@chakra-ui/react";
const { ipcRenderer } = window.electron;

const TitleBar = () => {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    const getIsMac = async () => {
      const isMac = await ipcRenderer.invoke("isMac");
      if (!isMac) {
        setIsMac(false);
      }
    };

    getIsMac();
  }, []);

  return (
    <Flex
      id="titlebar"
      position="fixed"
      top="env(titlebar-area-y, 0)"
      height="26.5px"
      width="100%"
      bg="#666"
      borderBottom="solid 1px #555"
      justifyContent="right"
      alignItems="center"
      userSelect="none"
      sx={{
        appRegion: "drag",
        WebKitAppRegion: "drag",
      }}
      gap="15px"
      zIndex={1}
    >
      {!isMac && (
        <>
          <Flex
            h="26.5px"
            _hover={{ bg: "blackAlpha.100" }}
            sx={{
              appRegion: "no-drag",
              WebKitAppRegion: "no-drag",
            }}
            alignItems="center"
            justifyContent="center"
            onClick={() => ipcRenderer.invoke("minimizeWindow")}
          >
            <Box
              w="10px"
              h="1px"
              bg="white"
              m="10px"
              sx={{
                appRegion: "no-drag",
                WebKitAppRegion: "no-drag",
              }}
            />
          </Flex>
          <Flex
            h="26.5px"
            _hover={{ bg: "blackAlpha.100" }}
            sx={{
              appRegion: "no-drag",
              WebKitAppRegion: "no-drag",
            }}
            alignItems="center"
            justifyContent="center"
            onClick={() => ipcRenderer.invoke("maximizeWindow")}
          >
            <Box
              m="10px"
              w="10px"
              h="10px"
              border="solid 1px white"
              sx={{
                appRegion: "no-drag",
                WebKitAppRegion: "no-drag",
              }}
              pos="relative"
              zIndex={1}
            />
          </Flex>
          <CloseButton
            cursor="default"
            color="white"
            userSelect="all"
            position="relative"
            zIndex={1}
            borderRadius="none"
            h="26.5px"
            onClick={() => ipcRenderer.invoke("closeWindow")}
            sx={{
              appRegion: "no-drag",
              WebKitAppRegion: "no-drag",
            }}
          />
        </>
      )}
    </Flex>
  );
};

export default TitleBar;
