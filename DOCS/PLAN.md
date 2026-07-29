# PROJECT BLUEPRINT

> Complete engineering specification for kuberbassi.com

Version: 1.0

Status: Final

---

# Project

Name

Kuber Bassi Portfolio

Type

Modern Multi Page Portfolio

Architecture

SPA Experience

SEO Friendly

Responsive

Fast

Scalable

Maintainable

---

# Goals

• Premium engineering portfolio
• Product-first experience
• Showcase projects professionally
• Showcase music separately
• Easy to maintain
• Easy to extend
• Clean codebase
• Fast loading
• Reusable architecture
• Production ready

---

# Tech Stack

Framework

- React 19

Language

- TypeScript

Bundler

- Vite

Styling

- Tailwind CSS v4

Animation

- Framer Motion
- GSAP (only when necessary)

3D

- Three.js
- React Three Fiber
- Drei

Icons

- Lucide React

Utilities

- clsx
- class-variance-authority

Deployment

- Vercel

Version Control

- Git
- GitHub

---

# Project Structure

src/

    app/

    assets/
        images/
        videos/
        icons/
        logos/
        fonts/

    components/
        layout/
        navigation/
        sections/
        ui/
        common/
        forms/
        feedback/
        typography/

    pages/

    layouts/

    hooks/

    data/

    lib/

    styles/

    types/

    utils/

---

# Styles Structure

styles/

    globals.css

    variables.css

    typography.css

    animations.css

    utilities.css

Only shared styling belongs here.

Never duplicate styles.

---

# CSS Rules

• Use CSS variables.
• Never hardcode colors.
• Never hardcode spacing.
• Never duplicate utilities.
• Tailwind first.
• Custom CSS only when needed.
• Keep selectors simple.
• Avoid nested selectors.
• Avoid !important.
• Keep specificity low.

---

# Global CSS

Contains

• Reset

• Scrollbar

• Selection

• Body

• Root

• Smooth Scroll

• Default transitions

• Utility helpers

---

# variables.css

Contains

Colors

Spacing

Radius

Shadows

Transitions

Container Width

Z Index

Opacity

Never place component styles here.

---

# typography.css

Contains

Font Family

Heading Sizes

Paragraph Sizes

Line Heights

Letter Spacing

Text Utilities

---

# animations.css

Contains

Fade

Slide

Scale

Reveal

Hover

Page Transition

Shared Keyframes

Only reusable animations.

---

# utilities.css

Contains

Reusable helper classes.

Example

.container

.section

.glass

.text-gradient

.visually-hidden

---

# Fonts

Primary

Space Grotesk

Usage

Headings

Secondary

Inter

Usage

Body

Buttons

Inputs

Cards

Rules

Maximum two font families.

Never mix additional fonts.

---

# Colors

Background

Primary Surface

Secondary Surface

Border

Primary Text

Secondary Text

Muted Text

Accent

Success

Warning

Error

Rules

• One accent color.
• High contrast.
• Dark theme only.
• All values from variables.css.

---

# Spacing

Use consistent spacing scale.

Never use random values.

Sections

Large

Cards

Medium

Components

Small

---

# Border Radius

One global scale.

Small

Medium

Large

Rounded Full

No random radius values.

---

# Shadows

Small

Medium

Large

Glow

Only use shadows to improve hierarchy.

Never excessive.

---

# Layout

Max Width

Container

Section

Grid

Flex

Rules

• Consistent spacing
• Equal alignment
• Predictable layouts
• Plenty of whitespace

---

# Breakpoints

Mobile

Tablet

Laptop

Desktop

Large Desktop

Design mobile first.

---

# Routes

/

about

projects

projects/:slug

music

contact

404

---

# Navigation

Maximum five links.

Always visible.

Current page highlighted.

Responsive.

Keyboard accessible.

Simple.

---

# Pages

Home

About

Projects

Project Details

Music

Contact

404

Each page has one purpose.

---

# Home

Sections

Hero

Featured Projects

About Preview

Tech Stack

Current Focus

Music Preview

Contact CTA

---

# About

Sections

Introduction

Journey

Skills

Values

Current Focus

Interests

---

# Projects

Sections

Featured

All Projects

Optional Future Ideas

---

# Project Details

Sections

Hero

Overview

Problem

Solution

Architecture

Tech Stack

Gallery

Challenges

Lessons Learned

Links

Related Projects

---

# Music

Sections

Latest Releases

Platforms

Selected Works

Future Projects

---

# Contact

Sections

Contact Info

Social Links

Email

Optional Contact Form

---

# Shared Components

Navbar

Footer

Container

Section

Section Title

Button

Icon Button

Badge

Chip

Tag

Project Card

Featured Project Card

Music Card

Tech Card

Timeline Item

Image

Video

Modal

Tooltip

Input

Textarea

Form

Loading

Empty State

Error State

Success State

Toast

Divider

Social Links

---

# Component Rules

• One responsibility.
• Reusable.
• Typed.
• Responsive.
• Accessible.
• No duplicated logic.
• No page-specific logic.
• Accept props.
• No hardcoded data.

---

# Data Structure

data/

projects.ts

music.ts

profile.ts

socials.ts

navigation.ts

experience.ts

Everything dynamic lives here.

Never hardcode content inside components.

---

# Project Object

title

slug

summary

description

overview

technologies

year

status

featured

gallery

links

timeline

---

# Music Object

title

cover

genre

releaseDate

platforms

description

links

---

# Profile Object

name

title

bio

location

email

skills

socials

avatar

---

# Socials

GitHub

LinkedIn

Instagram

YouTube

Spotify

Email

Centralized.

Never duplicate links.

---

# State Management

React State

Context API

Avoid external state unless required.

---

# Routing Rules

Simple hierarchy.

No nested routing beyond project pages.

Use descriptive URLs.

Use lowercase.

Use hyphens.

Avoid query parameters where unnecessary.

---

# Images

Responsive

Optimized

Lazy Loaded

Alt Text Required

Use modern formats.

Avoid oversized assets.

---

# Videos

Lazy Load

Poster Image

Responsive

No autoplay with sound.

---

# Icons

Single icon library.

Consistent sizes.

Accessible labels.

No mixed icon styles.

---

# Forms

Minimal.

Clear labels.

Validation.

Helpful errors.

Keyboard friendly.

---

# Animations

Purposeful only.

Support interaction.

Never distract.

Short duration.

Consistent easing.

Respect reduced motion.

---

# Motion

Page Transition

Section Reveal

Hover

Image Reveal

Button Feedback

Card Lift

No unnecessary effects.

---

# Responsive Rules

Mobile First.

Redesign layouts.

Do not simply scale desktop.

Touch friendly.

Readable typography.

Flexible grids.

---

# Accessibility

Semantic HTML

Keyboard Navigation

Visible Focus

Proper Labels

Screen Reader Friendly

Reduced Motion Support

High Contrast

Alt Text

ARIA where necessary

Never rely on color alone.

---

# SEO

Unique Title

Unique Description

Canonical URL

Open Graph

Twitter Card

Structured Data

Sitemap

Robots.txt

Semantic HTML

Descriptive URLs

---

# Metadata

Every page defines

Title

Description

Keywords

Social Image

Canonical URL

---

# Performance

Lazy Load

Code Splitting

Image Optimization

Tree Shaking

Route Splitting

Deferred Heavy Components

Minimal Bundle Size

Avoid unnecessary renders.

---

# Three.js Rules

Use only when it improves storytelling.

Keep scenes lightweight.

Lazy load.

Dispose resources.

Avoid decorative 3D.

---

# Animation Rules

Default

Framer Motion

GSAP only for

Complex timelines

Advanced sequences

Never mix libraries for one animation.

---

# Naming

Folders

lowercase

Files

PascalCase

Components

PascalCase

Hooks

camelCase

Utilities

camelCase

Types

PascalCase

Constants

UPPER_CASE

CSS Variables

kebab-case

Routes

lowercase

---

# Code Rules

• Functional components only.
• Strict TypeScript.
• No any.
• Keep components under ~250 lines where practical.
• Keep functions focused.
• Prefer composition.
• Remove dead code.
• Remove unused imports.
• No commented-out code.
• No duplicated logic.
• No duplicated styles.
• No magic numbers.
• No hardcoded content.
• Keep code readable.

---

# Component Rules

Every component should

• Solve one problem.
• Accept reusable props.
• Avoid business logic.
• Avoid direct data access.
• Be independently reusable.
• Be easy to test.

---

# Props Rules

Keep props minimal.

Prefer booleans only when meaningful.

Use interfaces.

Provide defaults when appropriate.

Avoid deeply nested props.

---

# Hooks

Create hooks for

Scroll

Mouse

Viewport

Theme

Intersection Observer

Media Query

Window Size

Never duplicate hook logic.

---

# Utils

Examples

formatDate

slugify

cn

clamp

debounce

throttle

Only pure functions.

---

# Types

Centralize shared interfaces.

Avoid repeating types.

Keep names descriptive.

---

# Lib

Contains

Configuration

Constants

Third-party wrappers

Shared helpers

No UI code.

---

# Assets

images/

videos/

icons/

logos/

fonts/

Keep assets organized.

Compress before adding.

Never mix asset types.

---

# Images

Modern formats

Responsive sizes

Meaningful names

Lazy loading

Proper alt text

Avoid massive files.

---

# Icons

Use one icon library.

Consistent size.

Consistent stroke.

Accessible labels.

---

# Forms

Validate inputs.

Show clear errors.

Keyboard friendly.

Simple layout.

Minimal fields.

---

# Contact

Preferred

Email

GitHub

LinkedIn

Instagram

YouTube

Spotify

Optional

Contact Form

---

# Project Cards

Show

Cover

Title

Summary

Technology

Year

Status

One clear CTA

---

# Featured Projects

Highlight best work.

Larger layout.

More spacing.

More visual emphasis.

---

# Music Cards

Cover

Title

Genre

Platforms

Release Date

Play Link

---

# Loading States

Use

Skeletons

Placeholder Cards

Progress Indicators

Avoid

Long spinners

Blocking screens

---

# Empty States

Explain why.

Suggest next action.

Never show blank screens.

---

# Error States

Human language.

Helpful message.

Recovery action.

Never expose technical details.

---

# Success States

Short.

Positive.

Minimal.

---

# Hover

Quick.

Subtle.

Consistent.

No exaggerated motion.

---

# Page Transitions

Fast.

Smooth.

Consistent.

Never delay navigation.

---

# Scroll

Natural.

Smooth.

Purposeful.

No scroll hijacking.

---

# Current Focus

Easy to update.

Stored in data.

No hardcoding.

---

# Featured Content

Controlled from data.

Never manually duplicate.

---

# Project Management

Adding a project requires

1 new object

0 duplicated components

0 routing changes

---

# Music Management

Adding music requires

1 new object

0 component changes

---

# Social Links

Single source of truth.

Reuse everywhere.

Never duplicate URLs.

---

# Maintainability

Keep folders clean.

Keep files focused.

Reuse before creating new.

Delete unused code.

Refactor regularly.

Avoid technical debt.

Document important decisions.

---

# Reusability

Build once.

Reuse everywhere.

Extract repeating UI.

Extract repeating logic.

Extract repeating styles.

Never copy-paste components.

---

# Scalability

Support

Unlimited Projects

Unlimited Music

Additional Pages

Additional Sections

Without restructuring.

---

# Security

Never expose

API Keys

Secrets

Environment Variables

Private Data

Validate inputs.

Sanitize user content.

---

# Browser Support

Chrome

Edge

Firefox

Safari

Latest stable versions.

---

# Testing

Verify

Navigation

Routing

Buttons

Forms

Responsive Layout

Animations

Project Pages

404 Page

Accessibility

---

# Git

main

Production

feature/*

Development

Small commits.

Clear messages.

---

# Commit Format

feat:

fix:

refactor:

style:

perf:

docs:

test:

chore:

---

# Deployment

Platform

Vercel

Production Branch

main

Automatic Deployments

Verify after every deployment.

---

# Lighthouse Goals

Performance

95+

Accessibility

100

Best Practices

100

SEO

100

---

# Things To Avoid

✗ Hardcoded data

✗ Hardcoded colors

✗ Hardcoded spacing

✗ Duplicate components

✗ Duplicate styles

✗ Duplicate logic

✗ Random animations

✗ Unused libraries

✗ Large dependencies

✗ Deep nesting

✗ Huge components

✗ Huge CSS files

✗ Huge utility files

✗ Inconsistent naming

✗ Console logs

✗ Dead code

✗ Placeholder content

✗ Lorem Ipsum

✗ Random breakpoints

✗ Inline styles

✗ Magic numbers

✗ Over engineering

✗ Feature creep

---

# Quality Checklist

✓ Clean folder structure

✓ Consistent naming

✓ Responsive

✓ Accessible

✓ Reusable components

✓ Reusable styles

✓ Centralized data

✓ Strong typing

✓ Optimized assets

✓ Smooth animations

✓ Excellent performance

✓ SEO complete

✓ No duplication

✓ Maintainable

✓ Scalable

✓ Production Ready

---

# Final Principles

Build for clarity.

Keep everything simple.

Prefer readability over cleverness.

Prefer consistency over uniqueness.

Every page should have one purpose.

Every section should answer one question.

Every component should solve one problem.

Every style should be reusable.

Every animation should improve usability.

Every file should be easy to understand.

Every folder should have a clear responsibility.

If something can be simpler,

make it simpler.

If something is duplicated,

reuse it.

If something adds complexity without value,

remove it.