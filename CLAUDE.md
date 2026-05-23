# FitForge — Claude Context File

## What this app is
A Singapore-focused fitness web app called **FitForge**. Built as a PWA (installable on phone). No backend, no login — everything stored in localStorage. Deployed on Vercel, code on GitHub.

- **Live URL:** https://fitness-app-kappa-self.vercel.app
- **GitHub:** https://github.com/ianpils83-code/FitnessApp
- **Deploy method:** `git push` → Vercel auto-deploys from main branch

---

## Tech Stack
- **React 18** with functional components and hooks only (no class components)
- **Vite 5** build tool
- **vite-plugin-pwa** for PWA/installable app support
- **No CSS library** — all styling via inline styles + `src/index.css` CSS variables
- **No chart library** — all charts are hand-built SVG (polyline, polygon, circle)
- **No router** — single `page` state in App.jsx with a switch statement
- **No backend** — all data in localStorage
- **Images** — Unsplash CDN URLs in `src/data/exercises.json`

---

## File Structure
```
src/
  App.jsx              # Root: manages page state + theme toggle
  main.jsx             # Entry point
  index.css            # All CSS variables, base styles, glassmorphism cards

  pages/
    Home.jsx           # Dashboard: greeting, progress rings, heatmap, quick actions
    Plans.jsx          # Workout plans + custom plan builder + checklist
    Library.jsx        # 30-exercise library with search/filter
    Calculator.jsx     # BMR, TDEE, macros, BMI, 1RM calculator
    Diet.jsx           # Diet guidance page linking to Macros/Calculator
    Macros.jsx         # Daily food log, macro tracking vs targets
    Water.jsx          # Water intake tracker with ring + 7-day chart
    Progress.jsx       # Weight log with SVG line chart + PNG export
    Measurements.jsx   # Body measurements (waist, chest, bicep, hips, thigh)
    Records.jsx        # Personal Records (PR) tracker per exercise
    History.jsx        # Workout history log grouped by date
    WeeklySummary.jsx  # Auto-generated weekly recap from all data sources
    Profile.jsx        # Avatar, name, stats, achievement badges (14 badges)

  components/
    Nav.jsx            # Sticky nav with hamburger menu on mobile
    Footer.jsx         # Simple footer
    RestTimer.jsx      # Floating rest timer widget (bottom-right, SVG ring, Web Audio beep)
    ExerciseCard.jsx   # Exercise card with image, tips toggle, PR logging form
    PlanBuilder.jsx    # Custom plan builder (search exercises, set reps/sets/rest)

  data/
    exercises.json     # 30 exercises: id, name, muscle, equipment, img, tips[]
```

---

## Navigation / Routing
All routing is handled in `App.jsx` via a `page` state + switch statement.
To add a new page:
1. Create `src/pages/NewPage.jsx`
2. Import it in `App.jsx`
3. Add `case 'newpage': return <NewPage />` to the switch
4. Add `{ id: 'newpage', label: '...' }` to the links array in `Nav.jsx`

---

## Design System

### Colours (CSS variables in index.css)
```css
--brand:   #ff6a00   /* orange — primary CTA buttons */
--accent:  #e879f9   /* purple/fuchsia — highlights, active states */
--green:   #4ade80   /* success, completion, fat loss */
--blue:    #60a5fa   /* info, water */
--orange:  #fb923c   /* warning, calories, streak */
```

### Card style
Cards use `.card` class — glassmorphism with `backdrop-filter: blur(18px)`, CSS variable backgrounds, subtle border, hover glow effect. Do NOT use plain `background: #111` for cards — always use `.card` class or CSS variables.

### Buttons
- Primary: `background: linear-gradient(135deg, #ff6a00, #ff9a00)` with white text
- Accent: `background: #e879f9` with black text
- Ghost: `background: none, border: 1px solid rgba(255,255,255,0.12)`

### Typography
- Page title: `<h2>` (auto-styled)
- Section label: `fontSize: 12, color: 'var(--c-subtle)', fontWeight: 600, letterSpacing: '0.08em'` in CAPS
- Body: `var(--c-muted)` for secondary text, `var(--c-subtle)` for tertiary

### Theming
- Dark/light mode via `data-theme` attribute on `<html>`
- Toggle button in Nav — saves to `ff_theme` localStorage key
- Always use CSS variables (`var(--c-text)`, `var(--bg-card)`, etc.) not hardcoded colours for structural elements

---

## localStorage Keys (all prefixed `ff_`)
| Key | Type | Used by |
|-----|------|---------|
| `ff_history` | Array of entries | Plans, History, Home, WeeklySummary |
| `ff_checklist` | Object `{key: bool}` | Plans |
| `ff_custom_plans` | Array of plan objects | Plans, PlanBuilder |
| `ff_prs` | Object `{exerciseName: {history, best}}` | ExerciseCard, Records |
| `ff_progress` | Array `{date, weight}` | Progress, Home |
| `ff_food_log` | Object `{"YYYY-MM-DD": [items]}` | Macros, Home, WeeklySummary |
| `ff_water_log` | Object `{"YYYY-MM-DD": count}` | Water, Home, WeeklySummary |
| `ff_water_goal` | Number (default 8) | Water, Home |
| `ff_measurements` | Array of measurement entries | Measurements |
| `ff_weight` | Number (kg) | Calculator, Macros, Home |
| `ff_height` | Number (cm) | Calculator |
| `ff_age` | Number | Calculator |
| `ff_sex` | 'male' or 'female' | Calculator |
| `ff_activity` | Number (1.2–1.9) | Calculator |
| `ff_goal` | 'lose', 'maintain', 'gain' | Calculator, Diet, Macros |
| `ff_muscle` | String (filter value) | Library |
| `ff_theme` | 'dark' or 'light' | App, Nav |
| `ff_profile_name` | String | Profile, Home |
| `ff_profile_emoji` | String (emoji) | Profile, Home |
| `ff_profile_joined` | 'YYYY-MM-DD' | Profile |

### Workout history entry shape
```js
{
  id: string,
  date: 'YYYY-MM-DD',
  planId: string | number,
  planTitle: string,
  planEmoji: string,
  weekLabel: string,
  dayLabel: string,
  exerciseCount: number,
  note: string,         // optional, added when logging
}
```

---

## Exercise data shape (exercises.json)
```js
{
  id: number,
  name: string,
  muscle: 'Chest' | 'Back' | 'Legs' | 'Core' | 'Shoulders' | 'Arms' | 'Full Body',
  equipment: 'Bodyweight' | 'Dumbbell' | 'Barbell' | 'Cable' | 'Kettlebell',
  img: string,          // Unsplash CDN URL
  tips: string[]        // exactly 3 tips
}
```

---

## Key Patterns

### Reading localStorage safely
```js
const ls = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }
```

### Today's date string
```js
const today = () => new Date().toISOString().slice(0, 10)
```

### SVG progress ring pattern (used in Home, Water, RestTimer)
```jsx
const R = 70, CIRC = 2 * Math.PI * R
const offset = CIRC * (1 - pct)  // pct = 0..1
<circle r={R} strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
```

---

## How to deploy
```bash
git add [files]
git commit -m "description"
git push
# Vercel auto-deploys in ~1 min
```

Always run `npm run build` first to catch errors before pushing.

---

## What's NOT in this app (yet)
- No user accounts / backend (everything is localStorage)
- No Stripe / payments
- No AI-generated workout plans
- No social/sharing features (only image export)
- No push notifications (PWA supports it but not implemented)
