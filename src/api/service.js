const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = `http://api.exchangeratesapi.io/v1/`;
const ACCESS_KEY = `?access_key=${API_KEY}`;

/**
 * Calls the API `symbols` endpoint and processes the response.
 *
 * @returns { { [key: string]: string } | null } The available symbol list object if successful, `null` otherwise.
 */
async function getSymbols() {
  try {
    const response = await fetch(BASE_URL + "symbols" + ACCESS_KEY);
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
      BASE_URL + "latest" + ACCESS_KEY + `&base=${source}&symbols=${target}`
    );
    const responseObject = await response.json();
    return responseObject.rates[target];
  } catch (error) {
    return 0;
  }
}

/**
 * Calls the API historical rate endpoint and processes the response.
 *
 * @param { string } source The source symbol.
 * @param { string } target The target symbol.
 * @returns { Array<{ date: string, rate: number }> } An array of rates by date if successful, an empty array otherwise.
 */
async function getSeries(source, target) {
  const requestArray = [];
  try {
    for (let i = 6; i >= 0; i--) {
      const format = (date) => date.toISOString().split("T")[0];
      const d = new Date();
      d.setDate(d.getDate() - i);

      const response = await fetch(
        BASE_URL + format(d) + ACCESS_KEY + `&base=${source}&symbols=${target}`
      );
      requestArray.push(await response.json());
    }

    const values = await Promise.all(requestArray);

    return values.map((response) => {
      return {
        date: response.date,
        rate: response.rates[target]
      };
    });
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
