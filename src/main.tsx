import "./locales/i18n";
import './global.css'
import ReactDOM from "react-dom/client";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./routes/components/error-boundary";
import {routesSection} from "./routes/sections";

const router = createBrowserRouter(
  [
    {
      Component: () => (
        <App>
          <Outlet/>
        </App>
      ),
      errorElement: <ErrorBoundary/>,
      children: routesSection,
    },
  ],
  {
    basename: "/",
  },
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router}/>);