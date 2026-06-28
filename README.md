# Proxima IT Step 5 Mobile Fix

This patch fixes the mobile overflow issue in Step 5: **Turn findings into action**.

## What it fixes

- Text stacking too tightly on the far left
- Inputs/buttons being pushed off-screen to the right
- Fixed-width or non-wrapping row behavior on mobile

## How to apply

1. Add the CSS from `step5-mobile-fix.css` to your main stylesheet.
2. Make sure the Step 5 card wrapper has this class:

```html
class="step-five-card"
```

For React/JSX:

```jsx
className="step-five-card"
```

3. If your project already has a different class for the Step 5 card, either:
   - add `step-five-card` beside the existing class, or
   - rename the selector in the CSS to match your existing class.

## Also check for these inside Step 5

Replace or remove these if found:

```css
width: 600px;
min-width: 400px;
white-space: nowrap;
```

## Commit message

```text
fix: prevent step five card overflow on mobile
```
