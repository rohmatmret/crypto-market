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
          aria-label="Send email"
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
    <Container maxW="container.xl" centerContent>
      <SwitchTheme />
      <Box padding="4" maxW="3xl">
        Market Crypto
      </Box>
      <Home />
    </Container>
  );
}

export default App;
