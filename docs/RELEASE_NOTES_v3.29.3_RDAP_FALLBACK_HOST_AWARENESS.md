# Proxuma IT v3.29.3 — RDAP Fallback + Host Awareness Polish

## Purpose

Improve the consent-gated RDAP lookup experience when the app is not hosted on a serverless platform.

## Changes

- GitHub Pages and local file previews now show a clear RDAP bridge fallback instead of a generic failure.
- Vercel/serverless deployments remain eligible to run `/api/proxuma-rdap` after consent and user click.
- No new public cards were added.
- No hidden online calls were added.
- No frontend API keys were added.

## Privacy rule

RDAP can only run after the user arms Online Intel consent and clicks Run RDAP Lookup.
