# Agent Skills Integration Guide

This repository uses [@vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) for AI-powered development assistance.

## Overview

Agent Skills is a package manager for AI coding agents that provides reusable capabilities (skills) to help with:
- **React & Next.js best practices** - Performance optimization rules based on 10+ years of experience
- **Web design guidelines** - UI/UX and accessibility best practices
- **Deployment automation** - Agent-triggered Vercel deployments

These skills are used by AI coding assistants (like Cursor, Claude Code, GitHub Copilot, etc.) to provide better code suggestions and reviews.

## Setup

### Installation

Agent Skills is **not** an npm package. Instead, it's installed using the skill manager:

```bash
npx add-skill vercel-labs/agent-skills
```

This installs the skills locally or globally, and AI agents (like Cursor, Claude Code, etc.) will automatically discover and use them.

### Available Skills

The `vercel-labs/agent-skills` package includes:

1. **react-best-practices** - 40+ React & Next.js performance optimization rules
2. **web-design-guidelines** - 100+ UI/UX/accessibility best practices
3. **vercel-deploy-claimable** - Enables agent-triggered deployments to Vercel

### Configuration

Agent skills are automatically discovered by compatible AI agents. No additional configuration is typically needed.

### Optional: Install Specific Skills

You can also install individual skills:

```bash
npx add-skill vercel-labs/agent-skills/react-best-practices
npx add-skill vercel-labs/agent-skills/web-design-guidelines
```

## Usage in Pull Requests

When creating a pull request that involves agent skills:

1. Check the "Agent integration or update" box in the PR template
2. Fill out the "Agent Skills Integration" section
3. Describe what agent capabilities are being used or modified
4. Include any new agent prompts or instructions

## How It Works

When you install agent skills, AI coding assistants can:

1. **Automatically apply best practices** - Agents use the installed skills to suggest React/Next.js optimizations
2. **Review code quality** - Check against accessibility and design guidelines
3. **Suggest improvements** - Provide context-aware recommendations based on the skills

The skills work automatically - you don't need to explicitly call them. Compatible AI agents will discover and use them when providing code suggestions.

## Best Practices

1. **Install skills once** - Run `npx add-skill vercel-labs/agent-skills` once per machine/environment
2. **Always review agent suggestions** - Agents provide suggestions, but human review is essential
3. **Test agent-generated code** - Ensure all agent-generated code is thoroughly tested
4. **Document agent usage** - Note when and how agents were used in your PR
5. **Keep skills updated** - Skills may be updated over time; re-run the install command to get updates

## Do You Need It?

✅ **Yes, if you:**
- Use AI coding assistants (Cursor, Claude Code, GitHub Copilot, etc.)
- Want standardized React/Next.js best practices
- Want automated code quality checks

❌ **No, if you:**
- Don't use AI coding assistants
- Prefer manual code reviews
- Have your own established coding standards

## Resources

- [Agent Skills Documentation](https://github.com/vercel-labs/agent-skills)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Agent Integrations Guide](https://vercel.com/docs/agent-integrations)

## Support

For issues or questions about agent skills integration:
- Open an issue in this repository
- Check the [Agent Skills GitHub Discussions](https://github.com/vercel-labs/agent-skills/discussions)
