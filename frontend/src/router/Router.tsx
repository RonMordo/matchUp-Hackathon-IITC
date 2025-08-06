import { RootLayout } from "@/layout/root-layout";
import { AuthPage } from "@/pages/AuthPage";

import { createBrowserRouter } from "react-router";
import { ProtectRoutes } from "./ProtectRoutes";

export const Router = createBrowserRouter([
  { path: "/auth", element: <AuthPage /> },

  {
    path: "/",
    element: <ProtectRoutes />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          //{ index: true, element: <HomePage /> },
          //{ path: "/recipes/MyRecipes", element: <MyRecipesPage /> },
          //{ path: "/recipes/create-recipe", element: <CreateRecipeForm /> },
          //{ path: "/recipes/:id/update-recipe", element: <UpdateRecipePage /> },
        ],
      },
    ],
  },
]);
