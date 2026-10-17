# QuickBite

Requires Node.js 24 or newer. No dependency installation is needed.

```powershell
npm.cmd start
```

Open http://localhost:3000. Stop with Ctrl+C; restart after backend changes.

Backend modules live in src/. Browser files live in public/. Restaurant and menu data use integer cents. A session cookie selects each browser's cart.

Cart changes and orders are saved to data/quickbite.json. The folder is created automatically and ignored by Git. Set DATA_PATH to use a separate data file, or PORT to change the listening port.

This classroom demo does not send payments, emails, or orders to real restaurants. Opening hours are fictional; pickup slots use fixed intervals and totals exclude tax.
