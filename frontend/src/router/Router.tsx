import { RootLayout } from "@/layout/root-layout";
import { LoginPage } from "@/pages/SignInPage";
import { RegistrationPage } from "@/pages/SignUpPage";
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectRoutes } from "./ProtectRoutes";
import { HomePage } from "@/pages/HomePage";
import EventMap from "@/pages/EventMapPage";
import { EventsPage } from "@/pages/EventsPage";
import EventsCalendarPage from "@/pages/EventsCalendarPage";
import { MyEventsPage } from "@/pages/MyEventsPage";
import ProfilePage from "@/pages/ProfilePage";
export const Router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      { index: true, element: <Navigate to="/auth/signin" replace /> },
      { path: "signin", element: <LoginPage /> },
      { path: "signup", element: <RegistrationPage /> },
      { path: "*", element: <Navigate to="/auth/signin" replace /> },
    ],
  },

  {
    element: <ProtectRoutes />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/events/map", element: <EventMap /> },
          { path: "/events/", element: <EventsPage /> },
          { path: "/events/calendar", element: <EventsCalendarPage /> },
          { path: "/events/My", element: <MyEventsPage /> },
        ],
      },
    ],
  },

  // Catch-all route for any other invalid paths
  { path: "*", element: <Navigate to="/auth/signin" replace /> },
]);
