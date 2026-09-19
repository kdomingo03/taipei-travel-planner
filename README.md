# Taipei Travel Planner

This folder contains the web version of `Taipei_Travel_Planner.xlsx`.

## Run locally

For the easiest option on Windows, double-click `open-planner.cmd`. It starts the local server and opens the correct planner URL in Chrome.

Serve this folder over HTTP so the browser can fetch the workbook:

```powershell
cd c:\Users\kdpor\playwright\taipei-travel-planner
npx http-server . -p 4173
```

Then open `http://localhost:4173`.

The page loads every workbook sheet into tabs, provides search, and stores checklist/status changes in the current browser. The Excel file stays alongside the site, so the same folder can be uploaded to a static host such as GitHub Pages, Netlify, or Vercel.
