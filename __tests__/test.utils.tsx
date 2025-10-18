/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { ReactElement } from "react";
import { MedStoreProvider } from "@/providers/med-provider";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  // Add any custom provider props here if needed
  initialStoreState?: any;
}

function AllTheProviders({
  children,
  initialStoreState,
}: {
  children: React.ReactNode;
  initialStoreState?: any;
}) {
  return (
    <MedStoreProvider
      {...(initialStoreState && { initialState: initialStoreState })}
    >
      <MantineProvider>{children}</MantineProvider>
    </MedStoreProvider>
  );
}

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { initialStoreState, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialStoreState={initialStoreState}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

export * from "@testing-library/react";
export { customRender as render };
