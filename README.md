# concurr

The agreeable online currency converter.

## About

Simple web-based currency converter done as a technical assignment for a Frontend role recruitment process.

**Features requested:**

- ✅ Ability to select the source and target currencies
- ✅ Ability to input the source amount
- ✅ Conversion rates must be pulled from a third-party API. (https://ratesapi.io/ recommended)

**Extra features (recommended):**

- Ability to perform multiple conversions at the same time
- Option to select a different date for the conversion rate
- ✅ Bidirectional conversion (user can input either source or target amount)
- ✅ Show historical rates evolution (e.g. with chart)

## Approach

I started out with the [Create React App](https://create-react-app.dev/) setup. I then re-organized the file structure a bit and removed unnecessary files.

To streamline development, I used the [Chakra UI](https://chakra-ui.com/) component library.

Initially, I got a free tier API key from [exchangeratesapi.io](https://exchangeratesapi.io/) and created a small interface file for API calls (`service.js`). For the historical rates evolution, I had to manually perform requests for specific dates, since the API's Time-Series Endpoint is unnavailable for the free tier.

Due to hosting problems and the free-tier limitations, I switched to the free [exchangerate.host](https://exchangerate.host/#/) API. With this API I was able to undo the weird time-series logic as well.

For the graph visualization, I used [Recharts](https://recharts.org/).

## Usage

Simply select two currencies and input an amount to convert. The conversion will be done automatically.

By enabling the "Pro mode", you'll get access to a higher level of precision, two-way conversion and a historical rate evolution (from last week).

> **NOTE:** The API's free tier is quite limited when it comes to base currencies. `EUR` seems to be the only that doesn't return an error.

### Component rundown

- **App.js**

  Entry point, wraps the other components with some layout elements. Also manages Pro mode.

- **Navbar.js**

  Draws the app's navbar. Toggles Pro mode.

- **Converter.js**

  Controls the amount and currency values. Also has the conversion logic.

- **CurrencyInput.js**

  Draws the number input and the currency selector as a component.

- **Graph.js**

  Draws the historical rates graph.

## Running the app

The setup is very simple:

1. `npm install` to install dependencies.
2. `npm start` to serve the app locally.
3. `npm test` to run unit tests.
4. `npm build` to build the app for production.
