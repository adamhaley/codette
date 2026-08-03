# Design Principles

Codette is not aiming for total CSS/markup separation in the strict CSS Zen Garden sense.

The target is a pragmatic hybrid:

- markup carries structural intent
- patterns carry a minimal default visual contract
- themes can still restyle patterns heavily
- utilities can ship with opinionated interaction behavior

This is deliberate. Codette is meant to help generate working websites quickly without becoming a heavy framework or a blank styling laboratory.

## Core Stance

Codette should preserve:

- clean static HTML output
- low-tech-debt pattern contracts
- strong default UI patterns
- clear theme hooks for restyling
- framework-free or near-framework-free frontend behavior

Codette should avoid:

- excessive abstraction in the spec language
- hard-to-override pattern CSS
- deeply entangled runtime JavaScript
- heavy framework dependencies for common UI needs
- one-off pattern logic that cannot generalize

## Coupling Standard

Not all coupling is bad.

These kinds of coupling are acceptable:

- semantic coupling
  - a hero pattern can imply headline hierarchy and CTA placement
- structural coupling
  - a pattern can define a default layout structure
- baseline aesthetic coupling
  - a pattern can ship with default spacing, alignment, and interaction treatment

These kinds of coupling are not acceptable:

- brittle coupling
  - markup that only works with one exact stylesheet
- hidden coupling
  - behavior or styling assumptions that are hard to discover
- dependency coupling
  - requiring a large library for a small reusable pattern

## Practical Rule

Each pattern may define a base visual contract, but that contract should remain:

- legible
- override-friendly
- low-specificity
- stable in markup shape
- reusable outside a single site

Themes do not need to own every visual detail. They do need a real chance to reinterpret the patterns without rewriting the generator.

## Implication For Codette

Codette is best understood as:

- a lightweight static pattern system
- a small frontend toolkit for agentic workflows
- a hybrid between structured markup generation and themeable UI primitives

It is not trying to be:

- a pure CSS demonstration platform
- a full design framework
- a component runtime
- a complicated site builder

## Design Bar

When adding a new pattern, the test is:

1. Does it solve a real recurring frontend problem?
2. Does it work as a strong default out of the box?
3. Can it be restyled without rewriting the markup?
4. Is the interaction small enough to stay native to Codette?
5. Does it reduce future work instead of creating future debt?

If the answer to those questions is mostly yes, the pattern fits Codette.
