import { component$, useStyles$ } from "@builder.io/qwik";
import {
  QwikCity,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import globalStyles from "./global.css?inline";
import "normalize.css";
import "./typeplate.css";
import { Auth0Provider } from "~/lib/auth";
import SVGIconSymbols from "./components/icons/iconSymbols";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  useStyles$(globalStyles);

  return (
    <QwikCity>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
        <SVGIconSymbols />
        <Auth0Provider>
          <RouterOutlet q:slot="children" />
        </Auth0Provider>
        <ServiceWorkerRegister />
      </body>
    </QwikCity>
  );
});
