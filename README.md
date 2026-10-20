# Wat Maek Pok — វត្តមែកពក

A Khmer-first Next.js + TypeScript website starter for temple information, news, events, gallery, location, and an admin UI.

## Requirements
- Node.js 20.9+ (recommended)
- npm
- Supabase project for persistent database, authentication, and image storage

## Run locally
1. Extract the ZIP and open the folder in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and public anon/publishable key to `.env.local`.
5. Start development:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000

If Supabase credentials are not set, the public pages still render using sample content, but database-backed admin operations are not enabled.

## Supabase setup
1. Create a project at https://supabase.com.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication, create a trusted user for the temple administrator.
4. Add a row to `public.profiles` for that user's UUID and set role to `admin`:
   ```sql
   insert into public.profiles (id, display_name, role)
   values ('YOUR_AUTH_USER_UUID', 'Temple Administrator', 'admin');
   ```
5. Create a private Storage bucket named `temple-gallery`. Define Storage policies allowing authenticated editors to upload/update/delete and public visitors to read only published images (or use a public bucket only if the temple explicitly accepts public access).
6. Add environment values to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
   ```
7. Restart `npm run dev`.

## Important current implementation status
This ZIP contains a working frontend scaffold and admin page layouts. The admin forms are currently demo UI: buttons show a notice instead of writing to the database. Supabase schema and a basic Supabase client are included, but full CRUD, login/session enforcement, upload policies, and contact-form submission still need implementation before production. Do not represent the admin UI as production-secure until those features are completed and tested.

## Customize temple content
- Edit `lib/content.ts` to replace sample copy and image URLs.
- Replace illustrative photos with verified photographs of Wat Maek Pok.
- Edit `components/SiteHeader.tsx` and `components/SiteFooter.tsx` for official navigation and contact information.
- Add the verified address and coordinates to `app/location/page.tsx`.
- Update `app/layout.tsx` metadata and canonical URL for the deployed domain.

## Deploy to Vercel
1. Push this project to a private or public Git repository.
2. Import the repository into https://vercel.com.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables in Project Settings.
4. Deploy and test all pages on desktop and mobile.
5. Configure your real domain and update `metadataBase` in `app/layout.tsx`.

## Before public launch
- Replace all illustrative images and placeholder temple details.
- Implement and test Supabase CRUD operations and admin login/session checks.
- Verify RLS policies and Storage policies.
- Add spam protection and server-side validation to the contact form.
- Test keyboard accessibility, page performance, and Khmer Unicode on mobile.
