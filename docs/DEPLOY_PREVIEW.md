# Netlify Deploy Previews

## How it works

Netlify automatically creates a Deploy Preview for every pull request that targets
the `rebuild` (or `main`) branch. Each preview gets a unique URL such as:

```
https://deploy-preview-<pr-number>--usholding-site.netlify.app
```

No code changes are required — Netlify detects open pull requests via the GitHub
integration and triggers a build using the same pipeline as the production deploy.

## What is already configured

| File | Purpose |
|---|---|
| `netlify.toml` | Next.js Runtime plugin, build command, publish dir |
| `.env.example` | Documents required environment variables |

All environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`WEB3FORMS_ACCESS_KEY`, `NEXT_PUBLIC_SENTRY_DSN`) must be set in the Netlify Dashboard
under **Site settings → Environment variables** so that Deploy Previews can build
successfully.

## Enabling Deploy Previews in Netlify Dashboard

1. Open the Netlify Dashboard for the `usholding-site` project.
2. Go to **Site configuration → Build & deploy → Deploy contexts**.
3. Under **Deploy Previews**, select **"Any pull request against your production branch
   or branch deploy branches"**.
4. Save.

From this point every PR opened against `rebuild` will produce a live preview that
can be reviewed before merging.

## Branch deploys

The `rebuild` branch itself is deployed automatically on every push, giving a
permanent staging URL for the in-progress version of the site. The production
branch (`main`) continues to serve live traffic at `usholding.kz` via Netlify.
