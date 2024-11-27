import { Box, Container, IconButton, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import Home from "./pages/Home"
import { SunIcon } from "@chakra-ui/icons";

function SwitchTheme() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
        <IconButton
          onClick={toggleColorMode}
          variant="outline"
          colorScheme="teal"
          aria-label="color mode"
          icon={<SunIcon >
          
          </SunIcon>}
        >
          {colorMode === "light" ? "Dark" : "Light"}
        </IconButton>
    </header>
  )
}
function App() {
  useEffect(() => {
    document.title = "Crypto Market"
  }, [])
  return (
    <Container
      maxW={["full", "container.sm", "container.md", "container.lg"]} // Responsive max width
      centerContent
      p={["2", "4", "6"]} // Padding adjusts for mobile and larger screens
    >
      <SwitchTheme />
      <Box
        padding={["2", "4"]}
        maxW={["90%", "80%", "3xl"]} // Responsive width
        fontSize={["sm", "md", "lg"]} // Responsive font size
        textAlign="center" // Align text for smaller screens
      >
        Market Crypto
      </Box>
      <Home />
    </Container>
  );
}

export default App;
