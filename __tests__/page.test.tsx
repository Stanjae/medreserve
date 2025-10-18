import "@testing-library/jest-dom";
import { render, screen } from "./test.utils";// Use the custom render with MantineProvider
import Page from "../src/app/page";

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Page />);

    const heading = screen.getByRole("heading", {
      name: /doctors who treat with care/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders book appointment button", () => {
    render(<Page />);

    const button = screen.getByRole("link", {
      name: /book an appointment/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/book-appointment");
  });

  it("renders working hours section", () => {
    render(<Page />);

    const workingHoursHeading = screen.getByRole("heading", {
      name: /working hours/i,
    });

    expect(workingHoursHeading).toBeInTheDocument();
  });

  it("renders quality care section", () => {
    render(<Page />);

    const qualityCareHeading = screen.getByRole("heading", {
      name: /quality care for you and the ones you love/i,
    });

    expect(qualityCareHeading).toBeInTheDocument();
  });

  it("renders condition cards", () => {
    render(<Page />);

    // This will find the condition cards from conditionData mock
    const learnMoreButtons = screen.getAllByRole("link", {
      name: /learn more/i,
    });

    expect(learnMoreButtons.length).toBeGreaterThan(0);
  });
});
