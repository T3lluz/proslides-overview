#!/usr/bin/env python3
"""Generate arch-desc-en.js from index.html node descriptions."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf-8")

pairs = {}
for m in re.finditer(r'data-node-title="([^"]*)"[^>]*data-node-desc="([^"]*)"', html):
    pairs[m.group(1)] = m.group(2)
for m in re.finditer(r'data-node-desc="([^"]*)"[^>]*data-node-title="([^"]*)"', html):
    pairs[m.group(2)] = m.group(1)

# English descriptions keyed by data-node-title (code paths / identifiers stay as-is)
EN = {
    "users": "User accounts with email, password hash and OAuth identity. Own presentations.",
    "presentations": "Owner presentations with title, theme and status. Has many slides, polls and live sessions.",
    "slides": "Slides for one presentation. Content (canvas objects, embeds, poll references) stored as JSONB.",
    "polls": "Multiple-choice questions tied to a slide. Each poll has poll_options and collects poll_responses.",
    "poll_options": "Answer options for a poll (text per option).",
    "poll_responses": "Single vote per user. Stores chosen option as answer text.",
    "presentation_sessions": "Live sessions for a presentation. join_code generated as LIVE-XXXX (4 chars). Active when ended_at is null.",
    "session_participants": "Link between user and live session. Guests created as User with JWT; name from users.name.",
    "backend/": "Rails 8.1 API in API mode. Serves REST (/api/v1), Action Cable (/cable) and SPA assets from public/ in production.",
    "backend/app/": "Rails app: channels, controllers, models, services and serializers.",
    "backend/app/channels/": "Action Cable channels. PresentationChannel handles slide_change, poll_results and participant_joined for live presentations.",
    "presentation_channel.rb": "Action Cable channel broadcasting slide changes, poll results and participants in a presentation.",
    "application_cable/connection.rb": "Authenticates WebSocket connections via JWT in query/headers before channels subscribe.",
    "backend/app/controllers/": "Rails controllers. Versioned REST API under api/v1 and spa_controller catch-all in production.",
    "backend/app/controllers/api/v1/": "Versioned REST API for auth, presentations, sessions and polls.",
    "auth_controller.rb": "Login, signup, /me and OmniAuth callbacks (Google, GitHub). Issues JWT tokens.",
    "presentations_controller.rb": "CRUD for presentations. PUT uses ReplaceSlidesService for atomic slide replacement.",
    "sessions_controller.rb": "Live sessions: start, join (code/QR), end and participant list.",
    "polls_controller.rb": "Polls: create, vote and fetch live results. Votes broadcast via PresentationChannel.",
    "spa_controller.rb": "Production catch-all. Serves frontend build (backend/public/) for routes not matching /api, /cable, /up or /rails.",
    "authenticatable.rb": "Concern validating Bearer JWT in Authorization header and setting current_user.",
    "backend/app/models/": "ActiveRecord models for the domain. Concerns and serializers live here too.",
    "user.rb": "User account. Validates email, hashes password with bcrypt and links OmniAuth (provider/uid).",
    "presentation.rb": "Presentation with title, theme and status. Owns slides, polls and live sessions.",
    "slide.rb": "Slide with JSONB payload. Includes SlidePayloadNormalizer before save.",
    "presentation_session.rb": "Live session with LIVE code (4 chars, format LIVE-XXXX). Active when ended_at is null.",
    "session_participant.rb": "User ↔ live session link (session_id + user_id). Guests are User records with JWT.",
    "poll.rb / poll_option.rb / poll_response.rb": "Poll domain: multiple choice with options and votes (multiple_choice).",
    "backend/app/services/": "Domain services (PORO). Heavier business logic not belonging in controllers or models.",
    "presentations/replace_slides_service.rb": "Replaces all slides for a presentation atomically in one transaction.",
    "json_web_token.rb": "JWT issue and verify with HS256. Tokens valid 24h.",
    "presentation_serializer.rb": "JSON serializer for presentations. Includes slides, active_session_id and polls.",
    "backend/config/": "Rails config: routes, cable, deploy and OmniAuth initializer.",
    "config/routes.rb": "Routes for /api/v1, /cable, /up and catch-all to spa_controller.",
    "config/cable.yml": "Action Cable adapter: async in development, redis in production.",
    "config/deploy.yml": "Kamal 2 deploy config: image, accessories (Redis), proxy (Traefik), env.",
    "config/initializers/omniauth.rb": "OmniAuth initializer for Google and GitHub. Disabled when env vars missing.",
    "backend/db/": "Database schema and migrations. db:prepare via bin/setup.",
    "db/schema.rb": "Generated schema with tables, indexes and FKs for the domain.",
    "db/migrate/": "Migration files for all tables. Run with bin/rails db:migrate.",
    "backend/spec/": "RSpec tests (request, model, service and channel specs).",
    "Dockerfile": "Multi-stage Docker build: frontend built first, copied to backend/public/. Same image serves API and SPA.",
    "Gemfile": "Ruby deps: Rails 8.1, pg, redis, jwt, omniauth, rspec-rails, bcrypt.",
    "frontend/": "Vite/React SPA in TypeScript. Built to public/ and served by Rails in production.",
    "frontend/src/": "SPA source: app shell, features, services, hooks and UI components.",
    "src/app/": "App shell: routing, providers, layout and top-level auth state.",
    "src/features/": "Feature modules: editor, live, dashboard, auth.",
    "src/features/editor/": "WYSIWYG slide editor with Fabric.js canvas.",
    "src/features/live/": "Live presentation: host, audience and join flows.",
    "src/features/dashboard/": "Presentation list and management after login.",
    "src/services/": "API client, WebSocket and auth helpers.",
    "src/components/ui/": "shadcn/ui components (Button, Dialog, etc.).",
    "package.json": "Frontend deps: React 18, Vite, Fabric.js, Tailwind, recharts, dnd-kit.",
    "vite.config.ts": "Vite config with React plugin and path aliases.",
    "React SPA": "Vite + React 18 + TypeScript SPA. Component structure with shadcn/ui and Tailwind. Built to public/ for production.",
    "POST /api/v1/auth/register": "Register new user. Returns JWT on success.",
    "POST /api/v1/auth/login": "Login with email/password. Returns JWT.",
    "GET /api/v1/auth/me": "Current user from Bearer JWT.",
    "GET /api/v1/auth/:provider/callback": "OAuth callback (Google/GitHub). Issues JWT.",
    "GET /api/v1/presentations": "List presentations for current user.",
    "POST /api/v1/presentations": "Create presentation with slides.",
    "GET /api/v1/presentations/:id": "Fetch presentation with slides and polls.",
    "PUT /api/v1/presentations/:id": "Replace all slides atomically (ReplaceSlidesService).",
    "DELETE /api/v1/presentations/:id": "Delete presentation.",
    "POST /api/v1/presentations/:id/start": "Start live session, returns join_code.",
    "POST /api/v1/presentations/:id/end_session": "End active live session.",
    "POST /api/v1/sessions/guest_join": "Guest join with LIVE code. Creates guest User + JWT.",
    "POST /api/v1/sessions/join_by_code": "Logged-in user joins session by code.",
    "POST /api/v1/polls/:id/vote": "Cast vote on poll. Broadcasts poll_results.",
    "GET /api/v1/polls/:id/results": "Live poll results for audience.",
    "GET /cable": "Action Cable WebSocket mount.",
    "GET /up": "Rails 8 health check – 200 OK when DB connected. Used by Kamal/Traefik.",
    "concerns/authenticatable.rb": "Concern validating Bearer JWT in Authorization header and setting current_user.",
    "backend/app/serializers/presentation_serializer.rb": "JSON serializer for presentations. Includes slides, active_session_id and polls in response.",
    "backend/Dockerfile": "Multi-stage Docker build: frontend built first, copied to backend/public/. Same image serves API and SPA.",
    "backend/Gemfile": "Ruby dependencies: Rails 8.1, pg, redis, jwt, omniauth, rspec-rails, bcrypt.",
    "app/App.tsx": "Top-level component setting up providers, routing and global layout.",
    "AudiencePollView.tsx": "Mobile-friendly voting UI for audience. Live-updates results as they arrive.",
    "DELETE /api/v1/polls/:id": "Deletes a poll with cascade on poll_options and poll_responses. Owner only.",
    "GET /api/v1/presentations/:id/participants": "Lists participants in active session with name, email and joined_at.",
    "GET /up — Rails health check": "Rails 8 built-in health check. Returns 200 OK if app and DB connection are OK. Used by Kamal/Traefik.",
    "JoinPage.tsx": "Join page: connects audience via link, LIVE code (4 chars) or QR scan. No login required.",
    "LivePresentationAudience.tsx": "Audience view receiving slide_change events and rendering new slide immediately.",
    "LivePresentationHost.tsx": "Presenter live mode: changes slides, starts polls, sends events via PresentationChannel.",
    "POST /api/v1/polls": "Create multiple-choice poll. Requires at least 2 options in poll[options][].",
    "PollsPage.tsx": "Admin page to create and manage polls tied to a presentation.",
    "PresentationEditor.tsx": "Main editor component: connects canvas, slide thumbnails, toolbar and save.",
    "README.md": "Monorepo overview with setup, scripts and deploy instructions.",
    "SessionLobby.tsx": "Lobby screen for presenter and participants before live session. Shows join_code + QR.",
    "SlideThumbnails.tsx": "Drag-and-drop slide thumbnails to switch and reorder slides.",
    "SyncedHostedEmbed.tsx": "Embed element synced between presenter and audience (e.g. external pages/iframes).",
    "WS /cable — PresentationChannel": "Action Cable WebSocket channel. Subscribers send presentation_id and receive slide_change, poll_results and participant_joined.",
    "components/ui/": "shadcn/ui components (Button, Dialog, Tooltip, etc.) built on Radix + Tailwind.",
    "features/auth/": "Login and signup pages, plus OAuth callbacks for Google and GitHub.",
    "features/editor/": "WYSIWYG slide editor with Fabric.js canvas, slide thumbnails and toolbar.",
    "features/live/": "Live mode: presenter host, audience view, join page and SessionLobby.",
    "features/polls/": "Poll administration and audience view. Results shown as bar chart (recharts).",
    "frontend/package.json": "Frontend dependencies: React, Vite, TypeScript, Tailwind, Fabric.js, @rails/actioncable, Playwright.",
    "frontend/playwright.config.ts": "Playwright config: baseURL, browsers, retry policy and reporter.",
    "frontend/tests/": "Playwright E2E tests. Run in GitHub Actions on push and pull request.",
    "frontend/vite.config.ts": "Vite config with proxy to Rails API and Action Cable in development.",
    "hooks/useAuth.ts": "React hook exposing current_user, login/logout and JWT tokens.",
    "hooks/useIsMobileDevice.ts": "Detects mobile devices to adapt UX (e.g. join via QR instead of keyboard).",
    "hooks/usePresentation.ts": "Subscribes to PresentationChannel and keeps slides/polls in sync.",
    "main.tsx": "Vite entrypoint rendering <App /> to #root.",
    "scripts/kamal.ps1": "Windows helper for Kamal deploy. Aliases for console, shell and deploy commands.",
    "src/components/": "UI components, mainly shadcn/ui-based primitives.",
    "src/hooks/": "Reusable React hooks for realtime, auth and mobile detection.",
    "src/lib/fabric*.ts": "Fabric.js wrapper layer: custom canvas helpers, serialization and rendering.",
    "src/services/api.ts": "HTTP client with JWT handling, auto-refresh and typed responses.",
}

missing = [k for k in pairs if k not in EN]
if missing:
    # Fallback: keep Norwegian for any missing keys (should not happen in prod)
    for k in missing:
        EN[k] = pairs[k]
    print(f"Warning: {len(missing)} keys used Norwegian fallback:", missing[:5], file=__import__("sys").stderr)

out = ROOT / "js" / "arch-desc-en.js"
lines = ["/* English architecture node descriptions — keyed by data-node-title */"]
lines.append("(function () {")
lines.append("  window.ARCH_NODE_DESC_EN = " + json.dumps({k: EN.get(k, pairs[k]) for k in sorted(pairs)}, ensure_ascii=False, indent=2) + ";")
lines.append("})();")
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {out} ({len(pairs)} entries, {len(missing)} fallbacks)")
