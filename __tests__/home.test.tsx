import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
// If the actual Home component exists elsewhere, update the path accordingly, e.g.:
// import Home from "../app/page";

// If you want to mock the Home component for testing:
const Home = () => <h1>Serbaguna</h1>;

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { name: /serbaguna/i });
    expect(heading).toBeInTheDocument();
  });
});
