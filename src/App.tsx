import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import {Toaster} from "@/components/ui/sonner"
import {MotionLazy} from "./components/animate/motion-lazy";
import {RouteLoading} from "./components/loading";
import {ThemeProvider} from "next-themes";

if (import.meta.env.DEV) {
  import("react-scan").then(({scan}) => {
    scan({
      enabled: false,
      showToolbar: true,
      log: false,
      animationSpeed: "fast",
    });
  });
}

function App({children}: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Helmet>
          <link rel="icon" sizes="64x64" href="favicon.ico"/>
          <title>PodDeck</title>
        </Helmet>
        <RouteLoading/>
        <Toaster/>
        <MotionLazy>{children}</MotionLazy>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;