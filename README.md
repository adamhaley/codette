# Codette

Codette is a lightweight static site generator for agentic website workflows. It is intentionally small: plain HTML, CSS, and a little JavaScript only when a pattern actually needs it.

The core idea is simple:

- `sites/` holds declarative site specs.
- `patterns/` holds reusable frontend layout patterns.
- `themes/` holds design tokens and visual systems.
- `generator/` compiles a site spec into static output.

This repo is optimized for low tech debt and high leverage. The goal is not to become a framework. The goal is to make brochure-style and editorial marketing sites easy to generate, evolve, and reuse.

## Principles

- No heavy frontend framework
- Static output first
- Patterns over one-off pages
- Small, deterministic generator
- Accessibility and responsive behavior built into each pattern

## Current Shape

```text
codette/
├── docs/               # Pattern notes and system documentation
├── generator/          # Minimal compiler from spec to static site
├── patterns/           # Pattern contracts and renderers
├── sites/              # Site definitions
├── themes/             # Theme tokens and shared CSS
├── output/             # Generated sites
├── codette.md          # Legacy design-spec experiment kept for reference
└── README.md
```

## Getting Started

Generate the example site:

```bash
npm run build
```

The generated output lands in `output/<site-slug>/`.

## Authoring Model

Each site spec defines:

- site metadata
- theme selection
- navigation
- footer content
- a sequence of pattern sections

Each pattern owns its rendering and its input contract. The generator stays boring on purpose.

The initial inventory is documented in [docs/pattern-inventory.md](/opt/homebrew/var/www/codette/docs/pattern-inventory.md).
The guiding philosophy is documented in [docs/design-principles.md](/opt/homebrew/var/www/codette/docs/design-principles.md).

## Near-Term Direction

- grow the pattern library slowly
- add more themes without coupling them to content
- keep specs easy for agents to author and edit
- preserve clean static HTML output
