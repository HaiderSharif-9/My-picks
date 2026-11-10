# My Picks

A curated, global product-discovery and affiliate website. Visitors can browse without accounts; one privately provisioned admin manages the collection.

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS
- Supabase Auth, Postgres and Storage (Storage bucket setup is optional; initial admin accepts image URLs)
- Vercel deployment

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and anon key.
4. Run `npm run dev` and open http://localhost:3000.

## Supabase setup
1. Create a Supabase project.
2. In Authentication, create the owner's admin user manually. Do not enable public sign-ups.
3. Run `supabase/schema.sql` in the SQL Editor.
4. Copy the admin user's UUID from Authentication > Users and insert it into `public.profiles` using the SQL comment at the bottom of the schema.
5. Configure the environment variables in Vercel and redeploy.

The admin panel is at `/admin`. Database row-level security is the authority for write access. Do not rely on hiding the admin route as security.

## Affiliate links
Use affiliate URLs that comply with each merchant/network's terms. Disclose affiliate relationships clearly. Product links use `rel="sponsored nofollow noopener noreferrer"`.

## Important launch checklist
- Replace sample/demo picks and placeholder affiliate destinations with approved product images and your actual affiliate links.
- Add privacy policy, contact details and region-appropriate affiliate disclosures before public promotion.
- Configure Supabase Auth redirect URLs for your Vercel domain.
- Keep the Supabase service-role key private; only the anon/publishable key belongs in browser environment variables.
