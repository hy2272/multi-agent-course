# scripts/

Helper scripts for this repo. These are kept in git; their *outputs* are not.

## export_pdf.js

Renders an HTML slide deck (e.g. one made with the `/beautiful-html` skill) to PDF using
Playwright headless Chromium. It forces every slide visible so all pages print (the decks
use transform-based navigation that would otherwise capture only slide 1).

### Setup (one-time)

```bash
npm install            # installs playwright from package.json
npx playwright install chromium
```

### Usage

```bash
node scripts/export_pdf.js path/to/deck.html [more.html ...]
# writes path/to/deck.pdf next to each input
```

> Generated `.html`/`.pdf` decks are gitignored — regenerate them with the skill + this script.
