const BASE_URL = `https://api.exchangerate.host/`;

/**
 * Calls the API `symbols` endpoint and processes the response.
 *
 * @returns { { [key: string]: string } | null } The available symbol list object if successful, `null` otherwise.
 */
async function getSymbols() {
  try {
    const response = await fetch(BASE_URL + "symbols");
    const responseObject = await response.json();
    return responseObject.symbols;
  } catch (error) {
    return null;
  }
}

/**
 * Calls the API `latest` endpoint and processes the response.
 *
 * @param { string } source The source symbol.
 * @param { string } target The target symbol.
 * @returns { number } The conversion rate if successful, `0` otherwise.
 */
async function getRate(source, target) {
  try {
    const response = await fetch(
      BASE_URL + `latest?base=${source}&symbols=${target}`
    );
    const responseObject = await response.json();
    return responseObject.rates[target];
  } catch (error) {
    return 0;
  }
}

/**
 * Calls the API `timeseries` endpoint and processes the response.
 *
 * @param { string } source The source symbol.
 * @param { string } target The target symbol.
 * @returns { Array<{ date: string, rate: number }> } An array of rates by date if successful, an empty array otherwise.
 */
async function getSeries(source, target) {
  try {
    const format = (date) => date.toISOString().split("T")[0];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();

    const response = await fetch(
      BASE_URL +
        `timeseries?base=${source}&symbols=${target}&start_date=${format(
          startDate
        )}&end_date=${format(endDate)}`
    );
    const responseObject = await response.json();

    return Object.entries(responseObject.rates).map(([date, rate]) => ({
      date: date,
      rate: rate[target]
    }));
  } catch (error) {
    return [];
  }
}

const service = {
  getSymbols,
  getRate,
  getSeries
};
export default service;
