import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import Toast from "./components/toast"
import { MotionLazy } from "./components/animate/motion-lazy";
import { RouteLoading } from "./components/loading";

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

function App({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Helmet>
        <link rel="icon" sizes="64x64" href="favicon.ico"/>
        <title>PodDeck</title>
      </Helmet>
      <RouteLoading />
      <Toast />
      <MotionLazy>{children}</MotionLazy>
    </QueryClientProvider>
  );
}

export default App;