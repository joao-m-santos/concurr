import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";
import service from "../api/service";

test("renders ok", () => {
  render(<App />);
  const conversionElement = screen.getByText(/I want to convert/i);
  expect(conversionElement).toBeInTheDocument();
});

// Needs valid API key in .env
test("symbol list call ok", async () => {
  const result = await service.getSymbols();
  expect(result["EUR"]).toMatch("Euro");
});

test("conversion rate call ok", async () => {
  const result = await service.getRate("EUR", "USD");
  expect(typeof result).toBe("number");
});
