import React, { useState, useEffect } from "react";
import { Box, Heading, useToast } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line
} from "recharts";

import service from "../api/service";

function Graph({ source, target }) {
  const toast = useToast();
  const [data, setData] = useState(null);

  const tickStyle = { fontSize: 12, fontFamily: "var(--chakra-fonts-body)" };

  useEffect(() => {
    // Get new data every time the symbols change
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, target]);

  /**
   * Gets the historical rate data from the service and sets it to the `data` state.
   */
  const getData = async () => {
    const series = await service.getSeries(source, target);

    if (!series.length) {
      toast({
        title: "Historical data error.",
        description: `There was an issue collecting the historical data for ${source}${target}.`,
        status: "error",
        duration: 6000,
        isClosable: true
      });
    }
    setData(series);
  };

  /**
   * Formats the dates to a shorter, readable format.
   *
   * @param { string } date The date string to format.
   * @returns { string } The formatted value.
   */
  const dateFormatter = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  /**
   * Formats the rate to a fixed decimal number.
   *
   * @param { number } number The rate to format.
   * @returns { number } The formatted value.
   */
  const rateFormatter = (number) => {
    return parseFloat(number).toFixed(6);
  };

  return (
    <Box alignSelf="stretch">
      <Heading as="h5" size="sm">
        {source}
        {target} week rate history
      </Heading>
      <ResponsiveContainer height={320}>
        <LineChart
          data={data}
          margin={{ top: 32, right: 0, left: 0, bottom: 4 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={dateFormatter}
            tick={tickStyle}
          />
          <YAxis
            tickCount={7}
            tick={tickStyle}
            tickFormatter={rateFormatter}
            padding={{ top: 16, bottom: 16 }}
            domain={["dataMin", "dataMax"]}
          />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line
            type="linear"
            dataKey="rate"
            stroke="#00B5D8"
            dot={{ stroke: "#76E4F7", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default Graph;
