# Radar Monitor

Build the first Radar 1.0 prototype only. This is an independent project called RADAR. Goal: a very simple mobile-first web app whose core promise is: “Tell me what you want to monitor, and I’ll tell you when it changes.” Do NOT build the full platform, backend monitoring engine, Chrome/Edge extension, payments, ads, business dashboard, or broad internet crawling yet. Build only the prototype UI and local interaction flow so we can test the concept before adding real monitoring.

Critical language rule: on first open, regardless of country, browser language, or device language, the default UI must be English. Provide a clear language selector with exactly three options: English, Français, العربية. Save the user’s selected language for future visits. Arabic UI must be RTL; English/French LTR. The user’s monitoring request may be typed in any of these three languages regardless of UI language.

Create only these core screens/flows:
1) Landing/home screen: RADAR logo/name, tagline “Tell me what you want to monitor, and I’ll tell you when it changes.”, a prominent input with placeholder “What do you want me to monitor?”, small examples such as “Product price”, “Company”, “Topic”, and a primary button “Start monitoring”. Keep it extremely clean, modern, fast, mobile-first, no unnecessary sections, ads, news feeds, or marketing clutter.
2) Task understanding/confirmation screen: after a user enters a request, show “I understood your request” and a structured summary of what Radar thinks should be monitored, what condition should trigger an alert, and the sources conceptually to be monitored. Include “Start monitoring” and “Edit request”. For the prototype, use simple deterministic parsing/demo behavior rather than real AI or external APIs. Support demo requests in English, French, and Arabic.
3) Monitoring result screen: show an active monitoring state with a green “No important change” state and a simulated important-change state showing a clear before/after difference (for example a product price dropping 15%). Include source, what changed, and “Was this useful?” with Useful / Not useful buttons. The prototype must allow switching between the no-change and change-demo states so we can test the UX.

Design direction: premium but minimal, trustworthy, not flashy. Mobile first but responsive on desktop. Make the experience understandable within seconds. Use a restrained radar-inspired visual identity, strong typography, generous spacing, accessible contrast, subtle animations only where useful. Avoid making it look like a generic AI chat app.

Architecture requirement: keep components clean and modular so a real monitoring engine, authentication, notifications, analytics, and future personal Radar can be added later without rebuilding the UI from scratch. Do not provision a database yet unless absolutely required for this prototype. Do not deploy yet. After implementation, provide the preview for testing.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6e55e80e-0289-4246-a196-e3906996791f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
