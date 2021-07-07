import React, { useState } from "react";
import { Box, Container, Text } from "@chakra-ui/react";

import Navbar from "./components/Navbar";
import Converter from "./components/Converter";

function App() {
  const [proMode, setProMode] = useState(false);

  return (
    <Box className="app">
      <Navbar proMode={proMode} setProMode={setProMode}></Navbar>
      <Container centerContent>
        <Text my={12} align="center">
          The agreeable online currency converter.
        </Text>
        <Converter proMode={proMode}></Converter>
      </Container>
    </Box>
  );
}

export default App;
