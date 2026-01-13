# SlammedU Interview Sandbox

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Supabase (local)
- **Storage**: Supabase Storage (local)
- **ORM**: Drizzle ORM
- **Auth**: Better Auth
- **UI**: shadcn/ui + Tailwind CSS v4
- **State**: TanStack Query

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed

### Setup

```bash
bunx supabase start
bun i
bun db:push
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Interview Features!
Feel free to use whatever architecture you want, but you need to implement both backend
and frontend for the features. Make sure to use AI otherwise this will take too long lol

### 1. Infinite Scroll Feed (`/app`)

The home page should display a feed of posts from all users with infinite scroll.

- Fetch posts from the database with cursor-based or offset pagination
- Load more posts as the user scrolls to the bottom
- Display each post with:
  - User avatar and name
  - Post image
  - Caption
  - Created date
- Handle loading and empty states

### 2. My Posts Page (`/app/posts`)

A page showing only the current user's posts.

- Display posts created by the authenticated user
- Same post card design as the feed
- Handle empty state when user has no posts

### 3. Create Post Modal

Triggered by the "+" button in the sidebar.

- Image upload using the provided `/api/upload` endpoint
- Caption input field
- Create post and save to database
- Close modal and refresh feed on success

### 4. User Profile Page (`/app/user`)

Allow users to view and update their profile information.

- Display current user info (name, email, avatar)
- Form to update name and profile picture
- Save changes to the database


Happy Coding :)

## Available Resources

### Upload API

```
POST /api/upload
Content-Type: multipart/form-data

Body: file (File)

Response: { success: true, path: string, url: string }
```

### Database

Access via `db` from `@/db`:

```typescript
import { db, posts, user } from "@/db";
```

### Auth

Get current session:

```typescript
import { auth } from "@/lib/auth";
const session = await auth.api.getSession({ headers: await headers() });
```

Client-side:

```typescript
import { authClient } from "@/lib/auth-client";
const { data: session } = authClient.useSession();
```

### UI Components

shadcn/ui components are available in `@/components/ui/`. Add more with:

```bash
bunx shadcn@latest add [component-name]
```

## Project Structure

```
src/
├── app/
│   ├── app/                # Authenticated app routes
│   │   ├── posts/          # My posts page
│   │   ├── user/           # User profile page
│   │   ├── layout.tsx      # App layout with sidebar
│   │   └── page.tsx        # Feed page (home)
│   ├── api/
│   │   ├── auth/           # Better Auth API routes
│   │   └── upload/         # Image upload API
│   └── page.tsx            # Sign in page
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── sidebar.tsx         # Main navigation
├── db/
│   ├── schema/             # Drizzle schema definitions
│   └── index.ts            # Database connection
├── hooks/                  # Custom React hooks
├── lib/
│   ├── auth.ts             # Better Auth server config
│   ├── auth-client.ts      # Better Auth client
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Utilities
└── providers/              # React context providers
```

## Commands

| Command        | Description                    |
| -------------- | ------------------------------ |
| `bun dev`      | Start development server       |
| `bun build`    | Production build               |
| `bun db:push`  | Push schema to database        |
| `bun db:studio`| Open Drizzle Studio            |

## Stopping Supabase

```bash
bunx supabase stop
```

