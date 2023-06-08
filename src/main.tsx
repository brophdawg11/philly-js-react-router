import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout, { loader as layoutLoader } from "./Layout";
import Home from "./Home";
import Collection, { loader as collectionLoader } from "./Collection";
import Product, {
  loader as productLoader,
  action as productAction,
} from "./Product";
import Login, { loader as loginLoader, action as loginAction } from "./Login";
import { logoutUser } from "./api";

const router = createBrowserRouter(
  [
    {
      path: "/",
      loader: layoutLoader,
      Component: Layout,
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: "collection/:handle",
          loader: collectionLoader,
          Component: Collection,
        },
        {
          path: "product/:handle",
          action: productAction,
          loader: productLoader,
          Component: Product,
        },
        {
          path: "login",
          action: loginAction,
          loader: loginLoader,
          Component: Login,
        },
      ],
    },
    {
      path: "/api/logout",
      action: logoutUser,
    },
  ],
  {
    future: { v7_normalizeFormMethod: true },
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

/*
Outline
 - Intro
 - Explain decoupling of fetching and rendering
 - Not the first ones to do this for loading (ui-router resolvers)
 - AFAIK first ones to do it for mutations
 - Mostly following what the browser would do
 - Writing your React Router app should feel like writing HTML

 - Create homepage showing collections
 - Add cart icon via loader, make it slow, move to fetcher
 - Create collection page showing products
 - Add pagination and sorting
 - Add product page with sku selection
 - Lazy routes
 - Deferred product reviews
*/
