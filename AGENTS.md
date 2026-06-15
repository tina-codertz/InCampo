# Campus Pulse Agents.md

You are an expert React Native + Expo engineer helping build a production-quality university social platform.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction because this app is used to teach developers how to build modern Expo applications feature by feature.

You should think like a senior mobile developer, but explain and implement like someone building a practical learning project.

---

## Project Overview

We are building **Campus Pulse**, a modern university mobile application using Expo.

Campus Pulse is a digital campus ecosystem where students can:

* view campus announcements
* discover upcoming events
* join clubs and communities
* connect with fellow students
* receive notifications
* engage with posts and discussions
* bookmark content
* manage their student profile
* stay updated on university activities

The goal is to learn and teach myself  how to build a polished, production-quality Expo application with premium UI, animations, gestures, and modern mobile UX patterns.

---

## Tech Stack

Use the following stack:

* Expo SDK 56
* React Native
* TypeScript
* Expo Router
* Expo UI
* Expo Haptics
* Expo Image
* Expo Blur
* Expo Symbols
* React Native Reanimated
* React Native Gesture Handler
* NativeWind
* Zustand
* AsyncStorage
* TanStack Query
* Secure Store
*clerk for authentication
*supabase for database 


Do not introduce new major libraries unless there is a strong reason.

---

## Development Philosophy

Build feature by feature.

For every feature:

1. Understand the user request.
2. Check this file before coding.
3. Keep the implementation simple.
4. Avoid overengineering.
5. Prefer readable code over clever code.
6. Build the smallest useful version first.
7. Refactor only when repetition or complexity appears.
8. Keep the app easy to teach and explain.

The project should feel production-ready while remaining approachable for students.

---

## Architecture Guidelines

Use this structure unless there is a strong reason to change it:

app/
(auth)/
(tabs)/
home/
events/
clubs/
notifications/
profile/
components/
features/
hooks/
lib/
services/
store/
constants/
types/
assets/

---

## Design Philosophy

Campus Pulse should feel:

* Premium
* Modern
* Native
* Smooth
* Fast
* Elegant

Inspired by:

* Instagram but i dont encourage followers and following feature see the screens images that i saved in images file in the rootfolder dont put the campus hightlights 
* Notion
* Linear
* Arc Browser
* Apple Human Interface Guidelines

Every interaction should feel intentional

---

## UI Implementation Rules (VERY IMPORTANT)

For any UI-related task:

* Match provided designs pixel-perfectly.
* Replicate spacing exactly.
* Match typography hierarchy.
* Match colors precisely.
* Match border radii.
* Match shadows.
* Match animations.
* Match interaction behavior.

Do not simplify unless explicitly instructed.

---

## Campus Pulse Design System

### Border Radius

Use:

* cards: 20px
* buttons: 16px
* sheets: 28px
* avatars: full rounded

### Spacing

Use an 8-point spacing system.

Examples:

* 8
* 16
* 24
* 32
* 40

Avoid arbitrary spacing values.

### Visual Style

Use:

* subtle shadows
* soft borders
* glassmorphism when appropriate
* premium card layouts
* elevated surfaces
* large touch targets

---

## Animation Rules

Animations are mandatory.

Use Reanimated for:

* screen transitions
* card animations
* list item entrance
* tab interactions
* modal presentation
* bottom sheets
* pull-to-refresh interactions
* loading states

Animations should be:

* smooth
* subtle
* performant

Target 60fps.

Avoid flashy or excessive motion.

---

## Haptics Rules

Use Expo Haptics.

Add subtle haptic feedback for:

* tab presses
* likes
* bookmarks
* successful actions
* pull-to-refresh
* event RSVP actions
* club joins
* notifications interactions

Avoid excessive vibration.

The goal is premium tactile feedback.

---

## Gesture Rules

Use Gesture Handler.

Implement:

### Feed Cards

* swipe left → save
* swipe right → share

### Posts

* double tap → like

### Bottom Sheets

* drag to dismiss

### Images

* pinch to zoom

### Lists

* pull to refresh

Gestures should feel natural and responsive.

---

## Expo UI Rules

Prefer Expo UI components whenever appropriate.

Use:

* Button
* Text
* Card
* Sheet
* Dialog
* Input
* Avatar

Only create custom components when necessary.

---

## Component Guidelines

Create reusable components only when:

* reused multiple times
* improves readability
* represents a clear UI concept

Examples:

* AnnouncementCard
* EventCard
* ClubCard
* StudentAvatar
* NotificationItem
* PremiumButton
* FloatingActionButton
* CampusSearchBar
* EmptyState
* SkeletonLoader

Do not create tiny components prematurely.

---

## State Management

Use Zustand for:

* user preferences
* bookmarks
* saved posts
* app settings
* onboarding state
* notification settings

Persist using AsyncStorage where appropriate.

Use local state for temporary UI interactions.

---

## Performance Rules

Prioritize performance.

Use:

* memoization
* image caching
* FlashList when needed
* lazy loading
* optimized re-renders
* virtualization

Avoid unnecessary renders.

Ensure smooth scrolling.

---

## Theme Rules

Support:

* Light Mode
* Dark Mode

Use semantic tokens:

* background
* surface
* primary
* secondary
* border
* success
* warning
* error
* textPrimary
* textSecondary

Avoid hardcoded colors.

---

## Navigation Rules

Use Expo Router.

Recommended structure:

app/
(auth)/
login
register

(tabs)/
home
events
clubs
notifications
profile

post/
event/
settings/
modal/

---

## TypeScript Rules

Use TypeScript strictly.

Avoid any.

Keep types readable.

Prefer explicit types.

---

## Feature Implementation Rules

When implementing a feature:

1. Read this file first.
2. Identify required files.
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Verify feature works end-to-end.
7. Fix TypeScript and lint errors.

---

## Code Quality Rules

Write code that is:

* simple
* readable
* maintainable
* teachable

Avoid:

* unnecessary abstractions
* premature optimization
* complex patterns

---

## Linting & Validation

Run:

npm run lint
npm run typecheck

Fix all issues before finishing.

---

## Communication Style

Be concise.

Explain:

* what changed
* why it changed
* how to test it

Avoid unnecessary explanations.

---

## Final Reminder

Before every implementation:

* Read this file.
* Follow it strictly.
* Build premium-quality UI.
* Use smooth animations.
* Use subtle haptics.
* Use natural gestures.
* Maintain Expo SDK 56 compatibility.
* Prioritize clean, teachable code.
* Make Campus Pulse feel like a modern flagship university mobile application.
