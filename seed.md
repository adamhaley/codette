# Web Design Spec: "Modern Minimal Editorial"

## Meta
site_name: "Atlas Studio"
tagline: "Designing a smarter future"
author: "Adam Haley"
layout_style: "responsive, mobile-first"
theme_variant: "light"

---

## Typography
body_font: "Inter, sans-serif"
heading_font: "Playfair Display, serif"
font_scale: "1.25 modular"
base_font_size: 16px
line_height: 1.6
letter_spacing: 0.01em
font_weights:
  heading: 700
  body: 400
uppercase_headings: true

---

## Layout
page_structure:
  - header
  - hero
  - content_grid
  - call_to_action
  - footer

grid_system:
  type: "CSS Grid"
  columns: 12
  gutter: 24px
  max_width: 1280px

breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1440px

nav:
  position: sticky
  style: minimal
  behavior: hide_on_scroll_down

footer:
  layout: "3 columns"
  theme: "inverted"

---

## Color Palette
primary: "#6A5ACD"       # Slate Blue
accent: "#FFB347"        # Soft Orange
background: "#FFFFFF"
text: "#222222"
muted: "#666666"
link: "#3B82F6"
link_hover: "#1E40AF"

color_mode: "light"
supports_dark_mode: true

---

## Graphics
svg_elements:
  - wave_divider_bottom
  - dotted_background_overlay
  - icon_set: "lineal-minimal"

decorative_borders:
  section: "angled"
  image: "rounded-soft"

media_guidelines:
  image_ratio: "16:9"
  feature_images: "full-bleed"

---

## Components
buttons:
  default:
    shape: "pill"
    font_weight: 600
    padding: "0.75em 1.5em"
    hover_effect: "scale + shadow"

card:
  layout: "image top, text below"
  border_radius: "12px"
  hover: "elevate"

navbar:
  layout: "logo left, links right"
  collapse_on_mobile: true
  toggle_icon: "hamburger"

---

## Animation
scroll_effects:
  on_enter: "fadeInUp"
  delay_between_sections: 0.2s

page_transitions:
  type: "slide"
  direction: "left"
  duration: 300ms

microinteractions:
  button_hover: "grow + color shift"
  link_underline: "slide in from left"

---

## Accessibility
contrast_level: "AA"
keyboard_navigation: true
reduced_motion_support: true

---

## Notes
- Use generous spacing and white space
- Avoid drop shadows except on hover
- No carousels or sliders
- Prioritize clarity and clean hierarchy


