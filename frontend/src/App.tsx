import { RouterProvider } from "react-router";
import { Router } from "./router/Router";
import { EventsPage } from "./pages/EventsPage";

function App() {
  return <EventsPage></EventsPage>
  //<RouterProvider router={Router} />;
}

export default App;
