# BKArch Student Frontend – Project Context (for GitHub Copilot)

This project is part of the BKArch Tutor/Mentor System.

## Tech stack:
- React + Vite
- TailwindCSS v4
- React Router DOM v6
- lucide-react (icons)
- framer-motion (animations)
- Pattern: SPA, layout + nested routes

## Module: STUDENT MODULE

### Student pages (6 pages total):
1. DashboardPage.jsx
2. ProgramRegisterPage.jsx (mockup page 57)
3. LibraryPage.jsx (mockup page 71)
4. EventsPage.jsx (mockup page 63)
5. CommunityPage.jsx (mockup page 64)
6. HistoryPage.jsx (mockup page 60–61)

All pages live in:
src/modules/student/pages/

## Layout:
MainLayout.jsx inside:
src/modules/student/layouts/

MainLayout contains:
- Sidebar: menu items (Dashboard, Register, Library, Events, Community, History)
- Header: student avatar + name “Nguyễn Đắc Nghĩa”
- <Outlet/> for nested routes

Routes:
- /student/dashboard
- /student/register
- /student/library
- /student/events
- /student/community
- /student/history

## Rules for Copilot:
- Wait for mockup images before designing UI.
- Follow Tailwind UI + clean component structure.
- Do NOT invent extra features or UI not in mockup.
- Always use functional components + hooks.
- Keep components small and reusable.

giao tiếp với tôi bằng tiếng việt