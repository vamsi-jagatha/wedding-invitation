# Ananya & Arjun — Wedding Invitation

A premium, single-page wedding invitation built with plain HTML, CSS and
JavaScript — no build step, no frameworks, no backend. Open `index.html`
in a browser and it works.

## Project structure

```
wedding-invitation/
├── index.html
├── css/style.css
├── js/config.js       ← all your wedding details live here
├── js/script.js        countdown, animations, RSVP, music, nav
├── assets/images/      (site currently links directly to licensed Unsplash photos)
├── assets/music/wedding-song.mp3   ← add your own track here
└── README.md
```

## 1. Customize the couple information

Open `js/config.js`. Everything on the page — names, dates, venues,
addresses, the timeline, RSVP endpoint and the music track — is read
from the `weddingConfig` object at the top of that file. Edit the
values there; you never need to touch `index.html` for text changes.

Key fields:

- `couple.bride` / `couple.groom` — the short first names shown in the hero.
- `weddingDateISO` — drives the live countdown. Use ISO format with your
  timezone offset, e.g. `"2027-02-14T16:00:00+05:30"`.
- `wedding` / `reception` — date, time, venue and address for each event card.
- `timeline` — an array of `{ time, title, description }`; add, remove or
  reorder entries and the timeline section updates automatically.

## 2. Replace the photographs

The page currently links directly to a small set of freely-licensed
Unsplash photos (hero, story, venue) so the site works out of the box.
To use your own photos:

1. Add your image files to `assets/images/`.
2. In `index.html`, swap the relevant `<img src="https://images.unsplash.com/...">`
   with `assets/images/your-file.jpg`.
3. Keep (or rewrite) the `alt` text so it still describes the image.
4. For best performance, export photos as WebP where possible and keep
   the hero photo under ~300KB.

## 3. Replace the music

1. Add your own track as `assets/music/wedding-song.mp3` (MP3 works
   everywhere; keep the same filename or update the path).
2. In `js/config.js`, set `music.enabled` to `true` or `false` to show
   or hide the floating music button entirely.
3. Music never autoplays with sound — it only starts after a visitor
   taps the floating button, and their choice is remembered for that
   browser tab only (not stored permanently).

## 4. Configure Google Maps

For each location (`wedding.mapsUrl`, `reception.mapsUrl`, and
`venueSection.directionsUrl` in `js/config.js`):

1. Search your venue on [Google Maps](https://maps.google.com).
2. Click **Share → Copy link**.
3. Paste that URL into `venueSection.directionsUrl` in `config.js`. The
   "Get directions" button uses this exact link directly — no API key required.

## 5. Configure RSVP

The RSVP form posts to a static-form service so there's no backend to run.

1. Create a free form at [Formspree](https://formspree.io) (or any
   service with a compatible POST endpoint, e.g. Getform, Basin).
2. Copy the endpoint URL it gives you (looks like
   `https://formspree.io/f/xxxxxxx`).
3. Paste it into `rsvp.formEndpoint` in `js/config.js`.
4. Submit a test RSVP once the site is deployed to confirm you receive it.

On success, the form is replaced with a "Thank You" confirmation. On
failure (e.g. offline, endpoint misconfigured), a gentle inline error
is shown so guests know to try again.

## 6. Deploy with GitHub Pages

1. Create a new GitHub repository and push this folder's contents to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and `/ (root)` folder.
4. Save — GitHub will publish the site at
   `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## 7. Deploy with Netlify or Cloudflare Pages

**Netlify**
1. Drag and drop the `wedding-invitation` folder onto
   [app.netlify.com/drop](https://app.netlify.com/drop), or connect the
   GitHub repo via **Add new site → Import an existing project**.
2. No build command is needed — set the publish directory to the
   project root (`/`).

**Cloudflare Pages**
1. Go to the Cloudflare dashboard → **Workers & Pages → Create → Pages**.
2. Connect your GitHub repository.
3. Leave the build command empty and set the output directory to `/`.
4. Deploy — Cloudflare will give you a `*.pages.dev` URL, and you can
   attach a custom domain afterwards.

---

Built with semantic HTML5, CSS custom properties, and the Intersection
Observer API. No React, no build tools, no tracking.
