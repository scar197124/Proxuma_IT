# Online Intel Vercel Deploy Notes

## Safe deployment path

1. Keep GitHub Pages as the public static frontend if desired.
2. Import the same repository into Vercel.
3. Vercel will expose the serverless endpoint under the Vercel deployment domain.
4. Do not add provider API keys to frontend files.
5. Future provider keys, if needed, must live only in Vercel environment variables.

## Test endpoint

After Vercel deploys the repo, test:

```text
https://YOUR-VERCEL-APP.vercel.app/api/proxuma-rdap?domain=example.com
```

Expected response shape:

```json
{
  "ok": true,
  "type": "rdap-domain-summary",
  "result": {
    "provider": "rdap.org",
    "domain": "example.com",
    "created": "...",
    "updated": "...",
    "expires": "...",
    "status": []
  }
}
```

## Privacy rule

No frontend page should call this endpoint until the user explicitly enables Online Intel and confirms consent.
