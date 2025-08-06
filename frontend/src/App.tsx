import { RouterProvider } from "react-router";
import { Router } from "./router/Router";
import { EventsPage } from "./pages/EventsPage";
import {EventsCalendarPage} from "./pages/EventsCalendarPage";

function App() {
  return <EventsCalendarPage></EventsCalendarPage>;
  //<RouterProvider router={Router} />;
}

export default App;
