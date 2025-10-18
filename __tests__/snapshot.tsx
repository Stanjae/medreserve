import { render } from "./test.utils"; // Use custom render with MantineProvider
import Page from "../src/app/page";

describe("Snapshot Tests", () => {
  it("renders homepage unchanged", () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
});
