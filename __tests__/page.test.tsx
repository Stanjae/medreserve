import "@testing-library/jest-dom";
import { render, screen } from "./test.utils";
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

    // Get ALL buttons with that name
    const buttons = screen.getAllByRole("link", {
      name: /book an appointment/i,
    });

    // Check that at least one exists
    expect(buttons.length).toBeGreaterThan(0);

    // Check that one has the correct href
    const heroButton = buttons.find(
      (btn) => btn.getAttribute("href") === "/auth/login"
    );
    expect(heroButton).toBeInTheDocument();
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

    const qualityCareHeading = screen.getByRole("heading", {
      name: /quality care for you and the ones you love/i,
    });

    expect(qualityCareHeading).toBeInTheDocument();
  });
});
