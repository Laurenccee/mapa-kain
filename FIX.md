# FIX

## High Priority (Bugs / Regressions)

### 1) Fix location watcher cleanup leak

**File:** `src/hooks/useLocationTracking.ts`  
**Issue:** The location subscription is stored in state, and the `useEffect` cleanup can close over `null`, leaving a live watcher after unmount.  
**Fix:** Store subscription in `useRef` and always remove `ref.current` in cleanup.

**Checklist**

- [ ] Replace `subscriber` state with `subscriberRef`
- [ ] Assign watcher to `subscriberRef.current`
- [ ] Remove watcher in cleanup using `subscriberRef.current?.remove()`
- [ ] Null out ref after removal

---

### 2) Clear stale building selection on multipolygon miss

**File:** `src/features/map/hooks/useBuildingSelection.ts`  
**Issue:** For `MultiPolygon`, if no polygon contains tap point, previous selection remains highlighted.  
**Fix:** In `if (tapped)` branch add `else setSelection(null)`.

**Checklist**

- [ ] Add explicit clear when `tapped` is falsy
- [ ] Verify tapping outside selected building clears highlight

---

### 3) Normalize tab route keys for icons

**Files:** `src/components/layouts/TabBar.tsx`, `app/(protected)/(tabs)/_layout.tsx`  
**Issue:** Icon map uses `'map/index'` and `'settings/index'`, while tabs are declared as `"map"` and `"settings"`.  
**Fix:** Standardize route keys (`map`, `settings`) and use same keys everywhere.

**Checklist**

- [ ] Update `ROUTE_ICONS` keys
- [ ] Verify icons render on both tabs

---

## Medium Priority (Clean / Best Practices)

### 4) Remove debug log noise from root layout

**File:** `app/_layout.tsx`  
**Issue:** Root render logs in production path add noise and overhead.  
**Fix:** Remove `console.log` or gate behind `__DEV__`.

**Checklist**

- [ ] Delete or dev-gate root render log

---

### 5) Tighten types in custom tab bar

**File:** `src/components/layouts/TabBar.tsx`  
**Issue:** `any` is used for navigation props and route icon map.  
**Fix:** Use `BottomTabBarProps` (React Navigation) and typed icon map.

**Checklist**

- [ ] Replace `state/descriptors/navigation: any`
- [ ] Add strong type for `ROUTE_ICONS`

---

### 6) Remove dead `tabBarIcon` config if custom tab bar owns UI

**File:** `app/(protected)/(tabs)/_layout.tsx`  
**Issue:** `tabBarIcon` options are currently unused by custom `TabBar`.  
**Fix:** Remove dead options or consume `options.tabBarIcon` in custom tab bar.

**Checklist**

- [ ] Pick one source of truth for tab icons

---

## Low Priority (Bloat / Product Readiness)

### 7) Replace hardcoded profile placeholders in settings

**File:** `app/(protected)/(tabs)/settings/index.tsx`  
**Issue:** `John Doe` / `example@email.com` are hardcoded.  
**Fix:** Bind to session/profile store data and loading/error states.

**Checklist**

- [ ] Load actual user name/email
- [ ] Add fallback UI for missing profile

---

### 8) Simplify location hook API if not needed

**File:** `src/hooks/useLocationTracking.ts`  
**Issue:** Exposes `startTracking/stopTracking` but hook auto-starts immediately; API may be broader than usage.  
**Fix:** Keep only needed API surface, or switch to explicit manual start.

**Checklist**

- [ ] Decide auto-start vs manual-start behavior
- [ ] Remove unused returns if staying auto-start

---

### 9) Audit possible unused dependencies

**File:** `package.json`  
**Issue:** `react-native-maps` appears unused with current MapLibre setup.  
**Fix:** Remove unused deps after confirmation.

**Checklist**

- [ ] Confirm no runtime/import usage
- [ ] Uninstall and test build

---

## Optional Refactor

### 10) Reduce logger duplication/noise

**File:** `src/utils/logger.ts`  
**Issue:** Some logger methods double-log and add heavy console output.  
**Fix:** Standardize one output path per level; gate verbose logs to dev.

**Checklist**

- [ ] Remove duplicate calls (`console.*` + `logMessage`)
- [ ] Gate debug/breadcrumb output with `__DEV__`
- [ ] Keep production logging minimal

---

## Verification Plan

- [ ] Run app and verify map selection behavior (tap building, tap empty map, multipolygon edges)
- [ ] Verify location watcher stops on screen/app unmount
- [ ] Verify tab icons render and navigation still works
- [ ] Verify sign out still works and settings shows real user data
- [ ] Run lint and smoke test Android build
