# Getting Started with Create React App

<<<<<<< Updated upstream
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
=======
React + Vite frontend for the SMPS Supplementary Exam System.
Built with a unified corporate design system using the JKUAT navy/gold palette, Tailwind CSS v4, and Flowbite React.
>>>>>>> Stashed changes

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

<<<<<<< Updated upstream
Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
=======
> The `-v` flag wipes any stale volume. Required on first setup or if you get a **password authentication failed** error.
> PostgreSQL only applies `.env` credentials on a fresh volume.
>>>>>>> Stashed changes

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

<<<<<<< Updated upstream
## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
=======
## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 + Flowbite React |
| Routing | React Router v7 |
| HTTP | Axios |
| Auth State | React Context API (`AuthContext`) |
| Icons | Lucide React |
| QR Code | react-qr-code, html5-qrcode |
| Real-time | SignalR (`@microsoft/signalr`) |

## Design System

The UI uses a unified corporate palette inspired by JKUAT's brand identity:

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1B3A6B` | Sidebar, buttons, active states |
| `--gold` | `#C8A951` | Accents, active nav, highlights |
| `--surface` | `#F4F6FA` | Page background |
| `--border` | `#E2E8F0` | Card borders, dividers |

All design tokens are defined in `src/App.css` as CSS custom properties.

---

## Project Structure

```
src/
├── assets/          # Static assets (jkuat-logo.png)
├── components/
│   ├── Auth/        # Login, Register
│   └── ui/          # Badge, Modal (shared primitives)
├── features/
│   ├── auth/        # AuthContext (global auth state)
│   └── booking/     # BookingWizard + step components
├── layouts/         # StudentLayout (sidebar + topbar)
├── pages/           # Route-level page components
├── services/        # api.js (Axios instance)
└── utils/           # mockData.js (temporary, to be replaced by API)
```

---

## Environment Variables

`frontend/.env`:
>>>>>>> Stashed changes

To learn React, check out the [React documentation](https://reactjs.org/).

<<<<<<< Updated upstream
### Code Splitting
=======
`backend/SMPS.SupplementaryExamSystem/SMPS.API/appsettings.json`:
>>>>>>> Stashed changes

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

<<<<<<< Updated upstream
### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
| Error | Cause | Fix |
|-------|-------|-----|
| `password authentication failed for user "smps_user"` | Stale Docker volume | `docker compose down -v && docker compose up -d` |
| `CORS policy blocked` | Frontend on wrong port | Vite is pinned to `5173` in `vite.config.js` — ensure nothing else uses that port |
| `address already in use` on port `5137` | Previous backend process didn't exit | `netstat -ano \| findstr :5137` then `taskkill /PID <pid> /F` |
>>>>>>> Stashed changes
