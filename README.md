# CrisKnowsAI Portfolio

Static portfolio website for Crisanto G. Beringuela, AI Automation Specialist & GHL Expert.

## Stack

- HTML
- CSS
- Vanilla JavaScript
- Web3Forms for project inquiries
- Calendly inline widget for discovery calls

No React, Next.js, Vite, npm packages, backend, database, or build step is required.

## Project Structure

```text
index.html
styles.css
script.js
assets/
README.md
.gitignore
```

## Local Testing

Open `index.html` directly in a browser, or run the folder with VS Code Live Server.

The Web3Forms endpoint is external and remains:

```text
https://api.web3forms.com/submit
```

Allowed origins should be managed in the Web3Forms dashboard:

```text
http://localhost:5500
http://127.0.0.1:5500
https://crisknowsai.netlify.app
```

## GitHub

1. Create a GitHub repository.
2. Upload or push this folder contents.
3. Keep `index.html`, `styles.css`, and `script.js` in the repository root.

## Netlify

Connect the GitHub repository to Netlify with these settings:

```text
Build command: leave empty
Publish directory: /
```

Deployment target:

```text
https://crisknowsai.netlify.app
```

