import React from "react";
import {
  Box,
  InputGroup,
  InputRightElement,
  Select,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";

function CurrencyInput(props) {
  const {
    precision,
    value,
    onChange,
    readOnly,
    name,
    symbolList,
    symbol,
    onSymbolChange
  } = props;

  return (
    <InputGroup>
      <NumberInput
        value={value}
        step={0.01}
        precision={precision}
        onChange={onChange}
        onFocus={(ev) => !readOnly && ev.target.select()}
      >
        <NumberInputField
          name={name}
          pr={20}
          placeholder="Amount"
          readOnly={readOnly}
        ></NumberInputField>
      </NumberInput>
      <InputRightElement w={20}>
        <Box borderLeft="1px" borderColor="gray.200">
          <Select
            ps={4}
            fontFamily="monospace"
            variant="unstyled"
            placeholder=""
            value={symbol}
            onChange={onSymbolChange}
          >
            {symbolList ? (
              Object.entries(symbolList).map(([symbol, label]) => (
                <option value={symbol} key={symbol}>
                  {symbol} ({label})
                </option>
              ))
            ) : (
              <option value="" disabled>
                Loading...
              </option>
            )}
          </Select>
        </Box>
      </InputRightElement>
    </InputGroup>
  );
}

export default CurrencyInput;
