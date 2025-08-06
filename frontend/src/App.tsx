import { RouterProvider } from "react-router";
import { Router } from "./router/Router";
import { EventsPage } from "./pages/EventsPage";
import MyMap from "./pages/EventMapPage";

function App() {
  return <MyMap></MyMap>;
  //return <EventsPage></EventsPage>
  //<RouterProvider router={Router} />;
}

export default App;
