import React, { useState, useEffect, useCallback } from "react";
import { Box, FormControl, FormLabel, useToast } from "@chakra-ui/react";

import CurrencyInput from "./CurrencyInput";
import Graph from "./Graph";

import service from "../api/service";
import { debounce } from "../util/util";

function Converter({ proMode }) {
  const toast = useToast();
  const __rateCache = {};

  const [source, setSource] = useState("1.00");
  const [target, setTarget] = useState("0.00");

  const [sourceSymbol, setSourceSymbol] = useState("EUR");
  const [targetSymbol, setTargetSymbol] = useState("USD");

  const [symbolList, setSymbolList] = useState(null);

  useEffect(() => {
    // Get available symbol list on start-up
    getSymbols();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Run conversion again when entering or leaving Pro mode
    convert(source, sourceSymbol, targetSymbol, proMode);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proMode]);

  /**
   * Gets the symbol list from the service and sets it to the `symbolList` state.
   */
  const getSymbols = async () => {
    let list = await service.getSymbols();

    // Handle API error
    if (list === null) {
      toast({
        title: "Symbol list error.",
        description: `There was an issue getting the available symbols list`,
        status: "error",
        duration: 6000,
        isClosable: true
      });
      list = {};
    }

    setSymbolList(list);
  };

  /**
   * Converts an amount of a currency into another currency.
   * Uses the `useCallback` hook for debouncing inside `useEffect`.
   *
   * @param { number } amount The amount to convert.
   * @param { string } source The source currency.
   * @param { string } target The target currency.
   * @param { boolean } proMode An indicator if the converter is in Pro mode or not.
   * @param { boolean } isReverse An indicator if the conversion is reversed (for bi-directional conversion).
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const convert = useCallback(
    debounce(async (amount, source, target, proMode, isReverse = false) => {
      if (amount && source) {
        const rate = await getRate(source, target, proMode);
        amount = parseFloat(amount);
        const value = parseFloat(amount * rate).toFixed(proMode ? 6 : 2);
        isReverse ? setSource(value) : setTarget(value);
      }
    }, 400),
    []
  );

  /**
   * Returns the conversion rate for a provided currency pair.
   * Will use cached values if available and if not in Pro mode.
   *
   * @param { string } source The source currency.
   * @param { string } target The target currency.
   * @param { boolean } isReverse An indicator if the conversion is reversed (for bi-directional conversion).
   * @returns { number } The rate for the provided currency pair.
   */
  const getRate = async (source, target, proMode) => {
    // Get rate from cache to prevent unnecessary API calls
    if (!proMode && __rateCache[source + target]) {
      return __rateCache[source + target];
    }

    let rate = await service.getRate(source, target);

    // Handle API error
    if (rate === 0) {
      toast({
        title: "Conversion rate error.",
        description: `There was an issue getting the conversion rate for ${source}${target}.`,
        status: "error",
        duration: 6000,
        isClosable: true
      });
      rate = __rateCache[source + target] || 1;
    } else {
      // If API call is successful, cache the rates for future use
      __rateCache[source + target] = rate;
      __rateCache[target + source] = 1 / rate;
    }

    return rate;
  };

  // Event handlers

  /**
   * Sets the new source amount and converts the values.
   *
   * @param { number } value The new source amount value.
   */
  const handleSourceChange = (value) => {
    setSource(value);
    convert(value, sourceSymbol, targetSymbol, proMode);
  };

  /**
   * Sets the new target amount and, if in Pro mode, converts the values inversely.
   *
   * @param { number } value The new target amount value.
   */
  const handleTargetChange = (value) => {
    setTarget(value);
    if (proMode) convert(value, targetSymbol, sourceSymbol, proMode, true);
  };

  /**
   * Sets the new source symbol value. If it is the same as the target value, swap both. Also converts the values.
   *
   * @param { Event } ev The symbol change event.
   */
  const handleSourceSymbolChange = (ev) => {
    const value = ev.target.value;
    setSourceSymbol(value);
    if (value === targetSymbol) {
      setTargetSymbol(sourceSymbol); // Swap symbols
      convert(source, value, sourceSymbol, proMode);
    } else {
      convert(source, value, targetSymbol, proMode);
    }
  };

  /**
   * Sets the new target symbol value. If it is the same as the source value, swap both. Also converts the values.
   *
   * @param { Event } ev The symbol change event.
   */
  const handleTargetSymbolChange = (ev) => {
    const value = ev.target.value;
    setTargetSymbol(value);
    if (value === sourceSymbol) {
      setSourceSymbol(targetSymbol); // Swap symbols
      convert(source, targetSymbol, value, proMode);
    } else {
      convert(source, sourceSymbol, value, proMode);
    }
  };

  return (
    <>
      <Box p={4} mb={8} border="1px" borderColor="gray.200" borderRadius="md">
        <FormControl id="source" mb={4}>
          <FormLabel>I want to convert</FormLabel>
          <CurrencyInput
            name="source"
            precision={proMode ? 6 : 2}
            symbolList={symbolList}
            value={source}
            onChange={handleSourceChange}
            symbol={sourceSymbol}
            onSymbolChange={handleSourceSymbolChange}
          ></CurrencyInput>
        </FormControl>
        <FormControl id="target">
          <FormLabel>into</FormLabel>
          <CurrencyInput
            name="target"
            precision={proMode ? 6 : 2}
            symbolList={symbolList}
            readOnly={!proMode}
            value={target}
            onChange={handleTargetChange}
            symbol={targetSymbol}
            onSymbolChange={handleTargetSymbolChange}
          ></CurrencyInput>
        </FormControl>
      </Box>
      {proMode && <Graph source={sourceSymbol} target={targetSymbol}></Graph>}
    </>
  );
}

export default Converter;
