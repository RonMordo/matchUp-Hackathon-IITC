import { RootLayout } from "@/layout/root-layout";
import { LoginPage } from "@/pages/SignInPage";
import { RegistrationPage } from "@/pages/SignUpPage";
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectRoutes } from "./ProtectRoutes";
import { HomePage } from "@/pages/HomePage";
import EventMap from "@/pages/EventMapPage";

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
          { path: "/events/map", element: <EventMap /> },
          //{ path: "/recipes/create-recipe", element: <CreateRecipeForm /> },
          //{ path: "/recipes/:id/update-recipe", element: <UpdateRecipePage /> },
        ],
      },
    ],
  },

  // Catch-all route for any other invalid paths
  { path: "*", element: <Navigate to="/auth/signin" replace /> },
]);
