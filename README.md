# My Picks

A curated, global product-discovery and affiliate website. Visitors can browse without accounts; one privately provisioned admin manages the collection.

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS
- Neon PostgreSQL for product data
- Neon Managed Auth (Better Auth) for the private admin login
- Vercel deployment

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill in the three server-only Neon variables:
   - `DATABASE_URL`: Neon pooled connection string for the production branch/database.
   - `NEON_AUTH_BASE_URL`: Neon Auth base URL from the Neon dashboard.
   - `NEON_AUTH_COOKIE_SECRET`: a random secret of at least 32 characters.
5. Run `npm run dev` and open http://localhost:3000.

## Neon setup
The production Neon database needs the `public.pins` and `public.admin_users` tables. The initial schema has already been applied to the My Picks Neon project.

Public visitors can only read published picks through the public API. Admin operations run on the server and require a valid Neon Auth session plus a matching user ID in `public.admin_users`. The database connection string is server-only and must never be prefixed with `NEXT_PUBLIC_` or committed to Git.

Public sign-up is disabled. Create the owner's account privately in Neon Auth, then add that account's user ID to the admin allowlist:

```sql
INSERT INTO public.admin_users (user_id)
VALUES ('YOUR_NEON_AUTH_USER_UUID');
```

The admin studio is at `/admin`. Do not add public registration or expose database credentials.

## Vercel deployment
1. Import this GitHub repository into Vercel.
2. Add `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and `NEON_AUTH_COOKIE_SECRET` to the Production, Preview, and Development environments as appropriate.
3. Deploy the `main` branch.
4. Add the final Vercel domain to Neon Auth trusted origins before testing admin sign-in.
5. Redeploy after changing environment variables.

## Affiliate links and launch checklist
- Replace sample/demo picks and placeholder destinations with approved product images and real affiliate URLs.
- Use affiliate URLs that comply with each merchant/network's terms.
- Disclose affiliate relationships clearly. Product links use `rel="sponsored nofollow noopener noreferrer"`.
- Add a privacy policy, contact details and region-appropriate affiliate disclosures before public promotion.
- Keep the Neon database URL and auth cookie secret private.
