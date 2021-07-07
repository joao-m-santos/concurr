import {
  Flex,
  Box,
  Heading,
  Spacer,
  FormControl,
  FormLabel,
  Switch
} from "@chakra-ui/react";

function Navbar({ proMode, setProMode }) {
  return (
    <Box as="nav" px={6} borderBottom="1px" borderColor="gray.200">
      <Flex align="center">
        <Box py="3">
          <Heading size="md">concurr</Heading>
        </Box>
        <Spacer />
        <Box>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="pro-mode" mb="0">
              Pro mode
            </FormLabel>
            <Switch
              id="pro-mode"
              colorScheme="cyan"
              defaultChecked={proMode}
              onChange={(e) => {
                setProMode(e.target.checked);
              }}
            />
          </FormControl>
        </Box>
      </Flex>
    </Box>
  );
}

export default Navbar;
