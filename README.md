# flavglen.dev

Portfolio website for Glen Flavian Pais - AI-Enhanced Full Stack Developer

## Tech Stack

- **Framework**: Next.js 16.1.3 (with Turbopack)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Features

- Portfolio showcase
- Blog system with rich text editor
- Expense tracking and analytics
- Gallery
- Admin dashboard
- PWA support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup
- Environment variables configured

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with:

```env
# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
ROLE_ADMIN_EMAIL=admin@example.com

# Other environment variables...
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Agent Skills Integration

This repository integrates with [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) for AI-powered development assistance.

See [.github/AGENT_SKILLS.md](.github/AGENT_SKILLS.md) for detailed information about agent skills integration.

### Using Agent Skills in Pull Requests

When creating a pull request:
1. Use the PR template (`.github/pull_request_template.md`)
2. Check the "Agent integration or update" box if applicable
3. Fill out the "Agent Skills Integration" section
4. Reference any agent-generated code or suggestions

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utility functions and services
├── hooks/            # Custom React hooks
├── data/             # Static data files
└── styles/           # Global styles
```

## Contributing

1. Create a branch from `main`
2. Make your changes
3. Use the PR template when creating a pull request
4. Ensure all checks pass before requesting review

## License

Private project - All rights reserved
