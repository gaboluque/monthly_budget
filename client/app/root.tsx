import {
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { UIRoot } from "./lib/ui/components/UIRoot";

import "./tailwind.css";

export async function loader() {
  console.log(process.env.BASE_API_URL);
  const envVars = {
    BASE_API_URL: process.env.BASE_API_URL,
  };

  return { envVars };
}

export default function App() {
  const { envVars } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
      </head>
      <body>
        <Outlet />
        <UIRoot />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: envVars,
            })}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
