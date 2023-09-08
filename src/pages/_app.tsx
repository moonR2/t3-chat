import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/theme-provider";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />;
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
