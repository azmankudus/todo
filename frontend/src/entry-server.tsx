// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="favicon.ico" />
          <script>{`
            let t = localStorage.getItem("theme") || "dark";
            if (t === "dark") document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", t);
          `}</script>
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));

