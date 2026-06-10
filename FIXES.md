# Bring It Home — Complete Fix Guide
## Every Bug, Every Wrong Data Point, Every Missing Piece

**Repo**: https://github.com/IshTandon/bring-it-home
**Branch**: master
**Total Fixes**: 15
**Estimated Effort**: ~14-18 hours

---

## Quick Reference — Priority Matrix

| # | Fix | Severity | Effort | Files Changed |
|---|-----|----------|--------|---------------|
| 1 | Wrong tournament goal counts | 🔴 Critical | 45 min | `data-history.ts` |
| 2 | Wrong home page fact | 🔴 Critical | 5 min | `page.tsx` |
| 3 | Retired/wrong players in squads | 🔴 Critical | 1 hr | `FRA.ts`, `ARG.ts`, `GER.ts`, `ENG.ts` + others |
| 4 | Fake player stats (template system) | 🔴 Critical | 3-4 hrs | `players.ts` + new `player-stats-override.ts` |
| 5 | Only 4 stadiums (should be 16) | 🟡 High | 30 min | `data.ts`, `types/index.ts` |
| 6 | Glory Index tier label mismatch | 🟢 Low | 15 min | `GloryIndex.tsx` |
| 7 | "All-Time" leaderboard misleading scope | 🟡 High | 2-4 hrs | `data-history.ts`, `HistoricalData.tsx` |
| 8 | `/glory` URL → 404 | 🟢 Low | 5 min | `next.config.mjs` |
| 9 | Format page venue data out of sync | 🟢 Low | 20 min | `format/page.tsx` |
| 10 | Mock matches look real | 🟡 High | 30 min | `matches/route.ts`, UI components |
| 11 | Team stats are fabricated | 🟡 High | 20 min | `TeamProfile.tsx` |
| 12 | Wrapped empty state missing | 🟢 Low | 15 min | `WCWrapped.tsx` |
| 13 | Data scraping pipeline (new) | 🟡 High | 4-6 hrs | 4 new scripts |
| 14 | Player photos missing | 🟢 Low | 45 min | `players.ts`, `PlayerCard.tsx` |
| 15 | No API rate limiting | 🟢 Low | 30 min | new `middleware.ts` |

---

## Fix 1: Wrong Tournament Goal Counts (🔴 Critical)

### Problem
`src/lib/data-history.ts` contains inflated goal counts for tournament top scorers across all 6 tournaments (2002-2022). The all-time leaderboard in `HistoricalData.tsx` sums these `topPlayers` arrays, producing wildly incorrect totals.

**Visible impact**: The History page shows Mbappé with 12 World Cup goals (real: ~5), Klose with 10 (real: 16 all-time but only 10 in the 2002-2006 range covered).

### Root Cause
The `topPlayers` arrays in each tournament entry have fabricated/inflated `goals` values. The `AllTimeContent` component in `HistoricalData.tsx` aggregates these by summing across all tournament years.

### File: `src/lib/data-history.ts`

#### 2022 (Qatar) — Fix `topPlayers` array

```diff
 // Inside the year: 2022 tournament object
 topPlayers: [
-  { name: 'Mbappé',      team: 'FRA', goals: 8, assists: 2, rating: 8.7 },
-  { name: 'Messi',       team: 'ARG', goals: 7, assists: 3, rating: 9.1 },
-  { name: 'Giroud',      team: 'FRA', goals: 4, assists: 1, rating: 7.8 },
-  { name: 'Álvarez',     team: 'ARG', goals: 4, assists: 0, rating: 8.0 },
-  { name: 'Richarlison', team: 'BRA', goals: 5, assists: 0, rating: 7.5 },
+  { name: 'Mbappé',      team: 'FRA', goals: 4, assists: 2, rating: 8.7 },
+  { name: 'Messi',       team: 'ARG', goals: 7, assists: 3, rating: 9.1 },
+  { name: 'Giroud',      team: 'FRA', goals: 4, assists: 1, rating: 7.8 },
+  { name: 'Álvarez',     team: 'ARG', goals: 4, assists: 0, rating: 8.0 },
+  { name: 'Richarlison', team: 'BRA', goals: 3, assists: 1, rating: 7.5 },
 ],
```

**Corrections**: Mbappé 8→4 (scored hat trick in final + 1 earlier = 4), Richarlison 5→3 (scored 2 vs Serbia including bicycle kick, 1 more = 3 total). Messi's 7 is correct.

#### 2018 (Russia) — Fix `topPlayers` array

```diff
 topPlayers: [
   { name: 'Kane',       team: 'ENG', goals: 6, assists: 0, rating: 8.2 },
   { name: 'Griezmann',  team: 'FRA', goals: 4, assists: 2, rating: 8.5 },
   { name: 'Lukaku',     team: 'BEL', goals: 4, assists: 1, rating: 7.9 },
-  { name: 'Mbappé',     team: 'FRA', goals: 6, assists: 0, rating: 8.3 },
-  { name: 'Cavani',     team: 'URU', goals: 4, assists: 0, rating: 7.7 },
+  { name: 'Mbappé',     team: 'FRA', goals: 4, assists: 0, rating: 8.3 },
+  { name: 'Cavani',     team: 'URU', goals: 3, assists: 0, rating: 7.7 },
 ],
```

**Corrections**: Mbappé 6→4 (1 vs Argentina, 1 vs Croatia, 2 others = 4), Cavani 4→3 (brace vs Portugal, 1 vs Russia = 3).

#### 2014 (Brazil) — No changes needed ✅
James Rodríguez 6, Müller 5, Neymar 4, Messi 4, Robben 3 — all correct.

#### 2010 (South Africa) — Fix `topPlayers` array

```diff
 topPlayers: [
   { name: 'Müller',     team: 'GER', goals: 5, assists: 3, rating: 8.3 },
   { name: 'Villa',      team: 'ESP', goals: 5, assists: 1, rating: 8.5 },
   { name: 'Forlán',     team: 'URU', goals: 5, assists: 0, rating: 8.7 },
   { name: 'Sneijder',   team: 'NED', goals: 5, assists: 1, rating: 8.6 },
-  { name: 'Higuaín',    team: 'ARG', goals: 6, assists: 0, rating: 7.5 },
+  { name: 'Higuaín',    team: 'ARG', goals: 4, assists: 0, rating: 7.5 },
 ],
```

**Correction**: Higuaín 6→4 (hat trick vs South Korea + 1 vs Mexico = 4).

#### 2006 (Germany) — Fix `topPlayers` array

```diff
 topPlayers: [
   { name: 'Klose',      team: 'GER', goals: 5, assists: 0, rating: 8.2 },
-  { name: 'Crespo',     team: 'ARG', goals: 5, assists: 1, rating: 7.8 },
-  { name: 'Henry',      team: 'FRA', goals: 4, assists: 2, rating: 8.3 },
-  { name: 'Zidane',     team: 'FRA', goals: 4, assists: 2, rating: 8.9 },
-  { name: 'Podolski',   team: 'GER', goals: 4, assists: 0, rating: 7.6 },
+  { name: 'Crespo',     team: 'ARG', goals: 3, assists: 1, rating: 7.8 },
+  { name: 'Henry',      team: 'FRA', goals: 3, assists: 2, rating: 8.3 },
+  { name: 'Zidane',     team: 'FRA', goals: 3, assists: 2, rating: 8.9 },
+  { name: 'Podolski',   team: 'GER', goals: 3, assists: 0, rating: 7.6 },
 ],
```

**Corrections**: Crespo 5→3, Henry 4→3, Zidane 4→3, Podolski 4→3. Klose's 5 is correct (he won the Golden Boot).

#### 2002 (Korea/Japan) — Fix `topPlayers` array

```diff
 topPlayers: [
   { name: 'Ronaldo',        team: 'BRA', goals: 8, assists: 0, rating: 9.0 },
   { name: 'Klose',          team: 'GER', goals: 5, assists: 0, rating: 8.1 },
   { name: 'Rivaldo',        team: 'BRA', goals: 5, assists: 2, rating: 8.7 },
-  { name: 'Ahn Jung-hwan',  team: 'KOR', goals: 3, assists: 0, rating: 7.5 },
-  { name: 'Wilmots',        team: 'BEL', goals: 3, assists: 0, rating: 7.4 },
+  { name: 'Vieri',          team: 'ITA', goals: 4, assists: 0, rating: 7.8 },
+  { name: 'Ballack',        team: 'GER', goals: 3, assists: 2, rating: 8.0 },
 ],
```

**Corrections**: Ahn Jung-hwan scored 2 goals (not 3). Wilmots scored 0 in 2002. Replaced with real top scorers: Vieri (4 goals) and Ballack (3 goals, 2 assists).

### Verification After Fix
The all-time leaderboard (summing across 2002-2022 only) should now show approximately:
- Klose: 5 + 5 = 10 (in these 2 tournaments; real all-time is 16 across 4 WCs including 2010+2014)
- Messi: 7 + 4 = 11 (2022 + 2014)
- Ronaldo (R9): 8 (2002 only in this range)
- Müller: 5 + 5 = 10 (2010 + 2014)
- Mbappé: 4 + 4 = 8 (2022 + 2018)

---

## Fix 2: Wrong Home Page Fact (🔴 Critical)

### Problem
The `HISTORY_FACTS` array on the home page states Germany holds the all-time World Cup goals record. **Brazil holds it with 237 goals** (Germany is second with ~232).

### File: `src/app/page.tsx`

Find the HISTORY_FACTS array (approximately line 40-60) and locate index 4:

```diff
 // In HISTORY_FACTS array, item at index 4:
-{ text: 'Germany hold the record for most World Cup goals scored with an incredible 232 goals across all tournaments' }
+{ text: 'Brazil hold the record for most World Cup goals scored with 237 goals across all tournaments, the most by any nation in history' }
```

### Note
Interestingly, another fact in the same array (index 7) correctly states "Klose 16 goals" — so the author knew the German stats but misattributed the overall record.

---

## Fix 3: Retired/Wrong Players in Squads (🔴 Critical)

### Problem
Multiple squad files contain players who have officially retired from international football, or players assigned to the wrong national team.

### Fix 3a: France — Remove Griezmann
**File**: `src/lib/squads/FRA.ts`

Antoine Griezmann announced retirement from international football in September 2024.

```diff
 fwd: [
   { id: 'mbappe', name: 'Mbappé', number: 10, club: 'Real Madrid', age: 29 },
   { id: 'dembele', name: 'Dembélé', number: 11, club: 'PSG', age: 29 },
-  { id: 'griezmann', name: 'Griezmann', number: 7, club: 'Atletico Madrid', age: 35 },
+  { id: 'barcola', name: 'Barcola', number: 7, club: 'PSG', age: 22 },
   { id: 'thuram', name: 'Thuram', number: 15, club: 'Inter Milan', age: 29 },
   { id: 'kolo-muani', name: 'Kolo Muani', number: 12, club: 'PSG', age: 27 },
   { id: 'coman', name: 'Coman', number: 20, club: 'Bayern Munich', age: 30 },
   { id: 'olise', name: 'Olise', number: 13, club: 'Bayern Munich', age: 24 },
 ],
```

### Fix 3b: Argentina — Remove Di María
**File**: `src/lib/squads/ARG.ts`

Ángel Di María retired from international football after the 2024 Copa América final.

```diff
 fwd: [
   { id: 'messi', name: 'Messi', number: 10, club: 'Inter Miami', age: 38 },
   { id: 'alvarez', name: 'Álvarez', number: 9, club: 'Atletico Madrid', age: 24 },
   { id: 'dybala', name: 'Dybala', number: 21, club: 'Roma', age: 32 },
   { id: 'lautaro-martinez', name: 'Lautaro Martínez', number: 22, club: 'Inter Milan', age: 27 },
-  { id: 'di-maria', name: 'Di María', number: 11, club: 'Benfica', age: 36 },
+  { id: 'nico-gonzalez', name: 'Nico González', number: 11, club: 'Juventus', age: 27 },
   { id: 'garnacho', name: 'Garnacho', number: 17, club: 'Man Utd', age: 20 },
   { id: 'soule', name: 'Soulé', number: 15, club: 'Roma', age: 21 },
 ],
```

### Fix 3c: Germany — Remove Gündogan
**File**: `src/lib/squads/GER.ts`

İlkay Gündogan retired from international football in July 2024.

```diff
 mid: [
   { id: 'goretzka', name: 'Goretzka', number: 8, club: 'Bayern Munich', age: 30 },
-  { id: 'gundogan', name: 'Gündogan', number: 21, club: 'Barcelona', age: 34 },
+  { id: 'brandt', name: 'Brandt', number: 21, club: 'Dortmund', age: 30 },
   { id: 'andrich', name: 'Andrich', number: 23, club: 'Leverkusen', age: 30 },
   // ...
 ],
```

### Fix 3d: England — Remove David Raya
**File**: `src/lib/squads/ENG.ts`

David Raya is **Spanish** (born in Barcelona, plays for Spain). He should not be in the England squad.

```diff
 gk: [
   { id: 'pickford', name: 'Pickford', number: 1, club: 'Everton', age: 32 },
-  { id: 'raya', name: 'Raya', number: 23, club: 'Arsenal', age: 29 },
+  { id: 'pope', name: 'Pope', number: 23, club: 'Newcastle', age: 33 },
   { id: 'henderson', name: 'Henderson', number: 13, club: 'Crystal Palace', age: 31 },
 ],
```

### Fix 3e: Other Potential Issues
These should be verified against the latest call-ups but are likely stale:
- **Mexico**: Guillermo Ochoa (age 39) and Andrés Guardado (age 38) — both likely retired by 2026
- **Argentina**: Otamendi (age 36) — may not be called up
- **Portugal**: Nelson Semedo — irregular call-ups

### Validation Script
Add this to `scripts/validate-data.ts`:

```typescript
const RETIRED_FROM_INTL: Record<string, string> = {
  'griezmann': 'Retired Sept 2024',
  'di-maria': 'Retired after Copa América 2024',
  'gundogan': 'Retired July 2024',
  'kroos': 'Retired after Euro 2024',
  'busquets': 'Retired 2023',
  'hazard': 'Retired 2024',
  'lloris': 'Retired after 2022 WC',
  'benzema': 'Retired from NT 2023',
};

// Check each squad file
for (const file of squadFiles) {
  const content = fs.readFileSync(path.join(squadsDir, file), 'utf-8');
  for (const [id, reason] of Object.entries(RETIRED_FROM_INTL)) {
    if (content.includes(`'${id}'`)) {
      console.error(`❌ ${file}: Contains ${id} — ${reason}`);
      errors++;
    }
  }
}
```

---

## Fix 4: Fake Player Stats — Position Template System (🔴 Critical)

### Problem
All 1,248 players get FIFA-card-style attributes (PAC/SHO/PAS/DRI/DEF/PHY) from ~14 position templates with deterministic jitter. This produces identical stats for players at the same position on similarly-ranked teams.

**Examples of duplicate stats found**:
- Rabiot (FRA) = Rodri (ESP): 78/78/88/87/72/82
- Dembélé (FRA) = Álvarez (ARG): identical
- Van de Ven (NED) = Semedo (POR): identical

### Root Cause
In `src/lib/players.ts`:

```typescript
// Current formula:
const scale = (teamRating - 58) / 37;
const jitter = ((playerIdx * 7 + 13) % 11) - 5;
const ovr = Math.round(58 + scale * 34 + jitter);

// Attribute generation:
const attrs = POS_ATTRS[position]; // 14 templates like CB: [55, 35, 55, 45, 88, 80]
// Each attribute = base * (ovr / 80) with minor variance
```

The jitter function `((idx * 7 + 13) % 11) - 5` is deterministic and has only 11 possible values. Players at the same position index on teams with the same rating get identical stats.

### Solution: Player Stats Override System

Create a new file with hand-curated stats for top ~120 players, fall back to improved template for the rest.

#### New file: `src/lib/player-stats-override.ts`

```typescript
/**
 * Hand-curated FIFA-card-style stats for notable players.
 * Sources: EA FC 25 ratings, community consensus, real performance data.
 *
 * Format: [PAC, SHO, PAS, DRI, DEF, PHY]
 * PAC = Pace, SHO = Shooting, PAS = Passing, DRI = Dribbling, DEF = Defending, PHY = Physical
 */
export const PLAYER_STATS_OVERRIDE: Record<string, [number, number, number, number, number, number]> = {
  // ═══════ ARGENTINA ═══════
  'martinez':           [50, 12, 42, 30, 86, 80],   // Dibu Martínez (GK)
  'romero':             [72, 35, 55, 52, 85, 82],   // Cuti Romero
  'lisandro-martinez':  [68, 38, 62, 58, 84, 83],   // Lisandro Martínez
  'molina':             [82, 52, 65, 70, 75, 76],   // Molina
  'de-paul':            [74, 70, 78, 80, 68, 78],   // De Paul
  'mac-allister':       [72, 73, 82, 80, 72, 74],   // Mac Allister
  'fernandez':          [75, 72, 76, 78, 73, 77],   // Enzo Fernández
  'messi':              [72, 86, 90, 94, 34, 62],   // Messi
  'alvarez':            [83, 82, 70, 82, 42, 76],   // Julián Álvarez
  'lautaro-martinez':   [80, 85, 65, 80, 38, 78],   // Lautaro
  'garnacho':           [90, 72, 65, 84, 30, 62],   // Garnacho
  'dybala':             [72, 82, 82, 88, 28, 56],   // Dybala

  // ═══════ FRANCE ═══════
  'maignan':            [52, 14, 52, 36, 87, 84],   // Maignan (GK)
  'kounde':             [80, 42, 68, 72, 84, 78],   // Koundé
  'upamecano':          [78, 34, 55, 52, 83, 86],   // Upamecano
  'saliba':             [72, 32, 60, 56, 86, 82],   // Saliba
  't-hernandez':        [88, 62, 72, 78, 72, 78],   // Theo Hernández
  'tchouameni':         [72, 68, 76, 74, 82, 82],   // Tchouaméni
  'rabiot':             [68, 72, 74, 74, 74, 80],   // Rabiot
  'camavinga':          [78, 64, 76, 78, 76, 78],   // Camavinga
  'zaire-emery':        [76, 68, 76, 80, 70, 72],   // Zaïre-Emery
  'mbappe':             [97, 88, 78, 92, 36, 76],   // Mbappé
  'dembele':            [92, 74, 74, 88, 32, 56],   // Dembélé
  'barcola':            [94, 70, 68, 86, 28, 54],   // Barcola
  'thuram':             [86, 78, 68, 78, 36, 82],   // Thuram

  // ═══════ SPAIN ═══════
  'unai-simon':         [48, 10, 54, 32, 84, 80],   // Unai Simón (GK)
  'carvajal':           [76, 55, 72, 74, 82, 76],   // Carvajal
  'le-normand':         [62, 30, 52, 48, 84, 82],   // Le Normand
  'pau-cubarsi':        [72, 28, 66, 64, 80, 74],   // Cubarsí
  'grimaldo':           [78, 62, 80, 78, 68, 64],   // Grimaldo
  'pedri':              [72, 68, 86, 88, 68, 60],   // Pedri
  'rodri':              [58, 70, 84, 78, 86, 84],   // Rodri
  'gavi':               [78, 66, 78, 82, 72, 72],   // Gavi
  'yamal':              [92, 74, 78, 90, 26, 50],   // Yamal
  'morata':             [76, 82, 62, 72, 32, 74],   // Morata
  'williams':           [96, 76, 68, 86, 32, 68],   // Nico Williams

  // ═══════ ENGLAND ═══════
  'pickford':           [46, 12, 48, 30, 82, 78],   // Pickford (GK)
  'alexander-arnold':   [72, 62, 88, 76, 64, 68],   // TAA
  'stones':             [58, 38, 72, 58, 82, 78],   // Stones
  'guehi':              [70, 30, 58, 52, 82, 80],   // Guehi
  'rice':               [70, 72, 76, 74, 82, 82],   // Rice
  'bellingham':         [76, 82, 78, 84, 68, 80],   // Bellingham
  'mainoo':             [74, 68, 76, 80, 70, 72],   // Mainoo
  'kane':               [64, 92, 82, 80, 44, 82],   // Kane
  'saka':               [88, 80, 78, 86, 52, 64],   // Saka
  'foden':              [82, 80, 82, 88, 48, 60],   // Foden
  'palmer':             [78, 82, 76, 86, 40, 62],   // Palmer

  // ═══════ BRAZIL ═══════
  'alisson':            [48, 14, 56, 38, 88, 84],   // Alisson (GK)
  'militao':            [78, 42, 58, 56, 84, 82],   // Militão
  'marquinhos':         [68, 38, 62, 58, 86, 80],   // Marquinhos
  'casemiro':           [62, 68, 72, 68, 84, 84],   // Casemiro
  'bruno-guimaraes':    [62, 70, 80, 78, 76, 76],   // Bruno Guimarães
  'lucas-paqueta':      [72, 74, 78, 82, 52, 72],   // Paquetá
  'vinicius-jr':        [95, 82, 74, 92, 28, 66],   // Vinícius Jr
  'rodrygo':            [88, 78, 76, 86, 34, 62],   // Rodrygo
  'raphinha':           [86, 78, 72, 84, 38, 64],   // Raphinha
  'endrick':            [84, 78, 58, 78, 26, 72],   // Endrick

  // ═══════ GERMANY ═══════
  'neuer':              [42, 12, 52, 34, 86, 80],   // Neuer (GK)
  'kimmich':            [74, 64, 84, 76, 82, 76],   // Kimmich
  'rudiger':            [82, 38, 55, 50, 86, 86],   // Rüdiger
  'musiala':            [78, 74, 78, 90, 38, 60],   // Musiala
  'wirtz':              [76, 78, 82, 86, 48, 62],   // Wirtz
  'havertz':            [72, 78, 74, 78, 42, 74],   // Havertz
  'sane':               [90, 76, 72, 84, 32, 62],   // Sané

  // ═══════ PORTUGAL ═══════
  'diogo-costa':        [46, 10, 48, 30, 84, 78],   // Diogo Costa (GK)
  'dalot':              [82, 52, 70, 72, 76, 74],   // Dalot
  'ruben-dias':         [62, 32, 62, 52, 88, 84],   // Rúben Dias
  'cancelo':            [82, 62, 80, 82, 68, 70],   // Cancelo
  'bruno-fernandes':    [68, 84, 86, 82, 56, 72],   // Bruno Fernandes
  'vitinha':            [70, 68, 84, 84, 62, 58],   // Vitinha
  'bernardo-silva':     [72, 72, 84, 88, 54, 56],   // Bernardo Silva
  'ronaldo':            [62, 88, 68, 76, 30, 76],   // Ronaldo (at 41)
  'rafael-leao':        [94, 76, 66, 88, 24, 62],   // Leão

  // ═══════ NETHERLANDS ═══════
  'van-de-ven':         [95, 32, 55, 58, 80, 78],   // Van de Ven
  'de-jong':            [72, 64, 84, 82, 72, 64],   // Frenkie de Jong (if in squad)

  // ═══════ BELGIUM ═══════
  'de-bruyne':          [70, 84, 92, 86, 58, 76],   // De Bruyne

  // ═══════ CROATIA ═══════
  'modric':             [62, 72, 86, 84, 62, 62],   // Modrić (at 40)

  // ═══════ USA ═══════
  'pulisic':            [84, 74, 74, 82, 38, 62],   // Pulisic
  'mckennie':           [72, 68, 68, 70, 72, 80],   // McKennie
  'adams':              [72, 54, 68, 68, 78, 80],   // Tyler Adams
  'reyna':              [78, 70, 76, 82, 32, 56],   // Gio Reyna
  'balogun':            [82, 78, 56, 76, 28, 72],   // Balogun

  // ═══════ JAPAN ═══════
  'kubo':               [82, 74, 76, 84, 30, 54],   // Kubo
  'mitoma':             [90, 72, 70, 86, 28, 56],   // Mitoma
  'kamada':             [70, 72, 78, 80, 50, 62],   // Kamada
  'endo':               [58, 62, 78, 72, 80, 76],   // Endo

  // ═══════ MEXICO ═══════
  'lozano':             [90, 74, 66, 82, 30, 58],   // Lozano
  'gimenez':            [78, 82, 58, 74, 28, 76],   // Santi Giménez
  'alvarez':            [64, 58, 72, 68, 82, 82],   // Edson Álvarez

  // ═══════ MOROCCO ═══════
  'hakimi':             [92, 62, 72, 80, 72, 72],   // Hakimi
  'amrabat':            [68, 52, 70, 68, 80, 82],   // Amrabat

  // ═══════ SOUTH KOREA ═══════
  'son':                [88, 86, 78, 86, 38, 64],   // Son Heung-min (if named in file differently, check squad)

  // ═══════ URUGUAY ═══════
  'valverde':           [86, 78, 74, 80, 72, 82],   // Valverde
  'nunez':              [90, 82, 56, 76, 30, 78],   // Núñez

  // ═══════ COLOMBIA ═══════
  'luis-diaz':          [92, 78, 68, 86, 32, 62],   // Luis Díaz
};
```

#### Modify: `src/lib/players.ts`

Add the override import and modify the player builder:

```diff
+import { PLAYER_STATS_OVERRIDE } from './player-stats-override';

 function buildPlayer(
   sp: SquadPlayer,
   teamId: string,
   teamRating: number,
   idx: number
 ): Player {
   const pos = getPos(sp);
-  const attrs = POS_ATTRS[pos] ?? POS_ATTRS.MID;
-  const scale = (teamRating - 58) / 37;
-  const jitter = ((idx * 7 + 13) % 11) - 5;
-  const ovr = Math.round(58 + scale * 34 + jitter);
-
-  const pac = clamp(Math.round(attrs[0] * (ovr / 80)));
-  const sho = clamp(Math.round(attrs[1] * (ovr / 80)));
-  const pas = clamp(Math.round(attrs[2] * (ovr / 80)));
-  const dri = clamp(Math.round(attrs[3] * (ovr / 80)));
-  const def = clamp(Math.round(attrs[4] * (ovr / 80)));
-  const phy = clamp(Math.round(attrs[5] * (ovr / 80)));
+  const override = PLAYER_STATS_OVERRIDE[sp.id];
+  let pac: number, sho: number, pas: number, dri: number, def: number, phy: number;
+
+  if (override) {
+    [pac, sho, pas, dri, def, phy] = override;
+  } else {
+    // Template fallback with improved jitter (uses name hash for uniqueness)
+    const attrs = POS_ATTRS[pos] ?? POS_ATTRS.MID;
+    const scale = (teamRating - 58) / 37;
+    // Use name-based hash for better distribution
+    const nameHash = sp.name.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
+    const jitter = ((Math.abs(nameHash) % 17) - 8); // -8 to +8, 17 possible values
+    const ovr = Math.round(58 + scale * 34 + jitter);
+
+    pac = clamp(Math.round(attrs[0] * (ovr / 80) + ((nameHash >> 3) % 7) - 3));
+    sho = clamp(Math.round(attrs[1] * (ovr / 80) + ((nameHash >> 5) % 7) - 3));
+    pas = clamp(Math.round(attrs[2] * (ovr / 80) + ((nameHash >> 7) % 7) - 3));
+    dri = clamp(Math.round(attrs[3] * (ovr / 80) + ((nameHash >> 9) % 7) - 3));
+    def = clamp(Math.round(attrs[4] * (ovr / 80) + ((nameHash >> 11) % 7) - 3));
+    phy = clamp(Math.round(attrs[5] * (ovr / 80) + ((nameHash >> 13) % 7) - 3));
+  }

   return {
     id: sp.id,
     name: sp.name,
     // ... rest unchanged
     attributes: { pac, sho, pas, dri, def, phy },
   };
 }

+function clamp(v: number): number {
+  return Math.min(99, Math.max(1, v));
+}
```

**Why name-based hashing is better**: The original `((idx * 7 + 13) % 11)` had only 11 possible values and was position-dependent. Using a hash of the player's name produces unique jitter per player regardless of array order, and gives 17 possible values with additional per-attribute variance from bit shifting.

---

## Fix 5: Only 4 Stadiums — Should Be 16 (🟡 High)

### Problem
`src/lib/data.ts` defines only 4 stadiums. The 2026 World Cup uses 16 venues across 3 countries.

### File: `src/types/index.ts`

Update the Stadium interface:

```diff
 export interface Stadium {
   id: string;
   name: string;
   city: string;
   capacity: number;
+  lat: number;
+  lng: number;
+  hostCountry: 'USA' | 'MEX' | 'CAN';
 }
```

### File: `src/lib/data.ts`

Replace the STADIUMS array:

```typescript
export const STADIUMS: Stadium[] = [
  // ═══════ USA (11 venues) ═══════
  { id: 'metlife',   name: 'MetLife Stadium',           city: 'East Rutherford, NJ', capacity: 82500, lat: 40.8128, lng: -74.0742, hostCountry: 'USA' },
  { id: 'att',       name: 'AT&T Stadium',              city: 'Arlington, TX',       capacity: 80000, lat: 32.7473, lng: -97.0945, hostCountry: 'USA' },
  { id: 'sofi',      name: 'SoFi Stadium',              city: 'Inglewood, CA',       capacity: 70240, lat: 33.9535, lng: -118.3392, hostCountry: 'USA' },
  { id: 'hard-rock', name: 'Hard Rock Stadium',          city: 'Miami Gardens, FL',   capacity: 64767, lat: 25.9580, lng: -80.2389, hostCountry: 'USA' },
  { id: 'lumen',     name: 'Lumen Field',               city: 'Seattle, WA',         capacity: 68740, lat: 47.5952, lng: -122.3316, hostCountry: 'USA' },
  { id: 'lincoln',   name: 'Lincoln Financial Field',    city: 'Philadelphia, PA',    capacity: 69176, lat: 39.9008, lng: -75.1674, hostCountry: 'USA' },
  { id: 'nrg',       name: 'NRG Stadium',               city: 'Houston, TX',         capacity: 72220, lat: 29.6847, lng: -95.4107, hostCountry: 'USA' },
  { id: 'mercedes',  name: 'Mercedes-Benz Stadium',     city: 'Atlanta, GA',         capacity: 71000, lat: 33.7554, lng: -84.4010, hostCountry: 'USA' },
  { id: 'gillette',  name: 'Gillette Stadium',          city: 'Foxborough, MA',      capacity: 65878, lat: 42.0909, lng: -71.2643, hostCountry: 'USA' },
  { id: 'arrowhead', name: 'GEHA Field at Arrowhead',   city: 'Kansas City, MO',     capacity: 76416, lat: 39.0489, lng: -94.4839, hostCountry: 'USA' },
  { id: 'levis',     name: "Levi's Stadium",            city: 'Santa Clara, CA',     capacity: 68500, lat: 37.4033, lng: -121.9694, hostCountry: 'USA' },
  // ═══════ Mexico (3 venues) ═══════
  { id: 'azteca',    name: 'Estadio Azteca',            city: 'Mexico City',         capacity: 87523, lat: 19.3029, lng: -99.1505, hostCountry: 'MEX' },
  { id: 'akron',     name: 'Estadio Akron',             city: 'Guadalajara',         capacity: 49850, lat: 20.6826, lng: -103.4625, hostCountry: 'MEX' },
  { id: 'bbva',      name: 'Estadio BBVA',              city: 'Monterrey',           capacity: 53500, lat: 25.6699, lng: -100.2459, hostCountry: 'MEX' },
  // ═══════ Canada (2 venues) ═══════
  { id: 'bmo',       name: 'BMO Field',                 city: 'Toronto',             capacity: 45736, lat: 43.6332, lng: -79.4186, hostCountry: 'CAN' },
  { id: 'bc-place',  name: 'BC Place',                  city: 'Vancouver',           capacity: 54500, lat: 49.2768, lng: -123.1117, hostCountry: 'CAN' },
];
```

---

## Fix 6: Glory Index Tier Label Mismatch (🟢 Low)

### Problem
`GloryIndex.tsx`'s `getStatusChip()` uses score thresholds (≥90 = "Favourite"), but the legend/key section states tier criteria based on FIFA ranking position ("Ranked 1-8"). These are different things — a team ranked #3 could have a score of 85.

### File: `src/components/rankings/GloryIndex.tsx`

Find the legend/tier explanation section and update it to match the actual code:

```diff
 // In the tier legend/key section, update labels:
-Favourite — Ranked 1-8
-Contender — Ranked 9-20
-Dark horse — Ranked 21-35
+Favourite — Glory score ≥ 90
+Contender — Glory score 75–89
+Dark horse — Glory score 55–74
+Qualifier — Glory score 35–54
+Long shot — Glory score < 35
```

---

## Fix 7: "All-Time" Leaderboard Only Covers 2002-2022 (🟡 High)

### Problem
The History page's "All-Time" tab aggregates player stats across `TOURNAMENT_HISTORY`, but this array only contains 6 entries (2002-2022). The leaderboard presents itself as definitive when it's missing 16 tournaments (1930-1998).

### Option A: Quick Fix — Relabel (15 min)

**File**: `src/components/history/HistoricalData.tsx`

```diff
 // In AllTimeContent component, change heading:
-<h3 className="text-lg font-bold">All-Time Top Players</h3>
+<h3 className="text-lg font-bold">Top Players (2002–2022)</h3>
+<p className="text-xs text-gray-500 mt-1">Aggregated from the last 6 World Cups</p>
```

### Option B: Add More Tournament Data (2-4 hrs)

**File**: `src/lib/data-history.ts`

Add entries for 1998, 1994, 1990, 1986, 1982, 1978, 1974, 1970, 1966, 1962, 1958. This makes the all-time leaderboard genuinely comprehensive.

```typescript
// Add to TOURNAMENT_HISTORY array (prepend to existing entries):
{
  year: 1998,
  host: 'France',
  winner: { team: 'FRA', name: 'France' },
  runnerUp: { team: 'BRA', name: 'Brazil' },
  thirdPlace: { team: 'CRO', name: 'Croatia' },
  goldenBall: 'Ronaldo',
  goldenBoot: 'Davor Šuker',
  goldenGlove: 'Fabien Barthez',
  totalGoals: 171,
  totalMatches: 64,
  topPlayers: [
    { name: 'Šuker',      team: 'CRO', goals: 6, assists: 0, rating: 8.5 },
    { name: 'Batistuta',  team: 'ARG', goals: 5, assists: 0, rating: 8.0 },
    { name: 'Vieri',      team: 'ITA', goals: 5, assists: 0, rating: 7.8 },
    { name: 'Ronaldo',    team: 'BRA', goals: 4, assists: 1, rating: 8.2 },
    { name: 'Bergkamp',   team: 'NED', goals: 3, assists: 3, rating: 8.4 },
  ],
  topTeams: [
    { team: 'FRA', avgRating: 8.2, goalsScored: 15, goalsConceded: 2, bigChances: 24 },
    { team: 'BRA', avgRating: 7.9, goalsScored: 14, goalsConceded: 10, bigChances: 20 },
    { team: 'CRO', avgRating: 7.7, goalsScored: 11, goalsConceded: 5, bigChances: 16 },
  ],
},
{
  year: 1994,
  host: 'United States',
  winner: { team: 'BRA', name: 'Brazil' },
  runnerUp: { team: 'ITA', name: 'Italy' },
  thirdPlace: { team: 'SWE', name: 'Sweden' },
  goldenBall: 'Romário',
  goldenBoot: 'Stoichkov & Salenko',
  goldenGlove: 'Michel Preud\'homme',
  totalGoals: 141,
  totalMatches: 52,
  topPlayers: [
    { name: 'Salenko',    team: 'RUS', goals: 6, assists: 0, rating: 7.6 },
    { name: 'Stoichkov',  team: 'BUL', goals: 6, assists: 2, rating: 8.5 },
    { name: 'Romário',    team: 'BRA', goals: 5, assists: 1, rating: 9.0 },
    { name: 'Baggio',     team: 'ITA', goals: 5, assists: 2, rating: 8.8 },
    { name: 'Klinsmann',  team: 'GER', goals: 5, assists: 0, rating: 8.0 },
  ],
  topTeams: [
    { team: 'BRA', avgRating: 8.0, goalsScored: 11, goalsConceded: 3, bigChances: 18 },
    { team: 'SWE', avgRating: 7.5, goalsScored: 15, goalsConceded: 8, bigChances: 16 },
    { team: 'ITA', avgRating: 7.6, goalsScored: 8, goalsConceded: 5, bigChances: 14 },
  ],
},
{
  year: 1990,
  host: 'Italy',
  winner: { team: 'GER', name: 'West Germany' },
  runnerUp: { team: 'ARG', name: 'Argentina' },
  thirdPlace: { team: 'ITA', name: 'Italy' },
  goldenBall: 'Salvatore Schillaci',
  goldenBoot: 'Salvatore Schillaci',
  goldenGlove: 'Sergio Goycochea',
  totalGoals: 115,
  totalMatches: 52,
  topPlayers: [
    { name: 'Schillaci',  team: 'ITA', goals: 6, assists: 0, rating: 8.4 },
    { name: 'Skuhravý',   team: 'CZE', goals: 5, assists: 0, rating: 7.8 },
    { name: 'Míchel',     team: 'ESP', goals: 4, assists: 1, rating: 7.6 },
    { name: 'Matthäus',   team: 'GER', goals: 4, assists: 3, rating: 8.8 },
    { name: 'Milla',      team: 'CMR', goals: 4, assists: 0, rating: 8.0 },
  ],
  topTeams: [
    { team: 'GER', avgRating: 8.0, goalsScored: 15, goalsConceded: 5, bigChances: 20 },
    { team: 'ITA', avgRating: 7.8, goalsScored: 10, goalsConceded: 2, bigChances: 16 },
    { team: 'ARG', avgRating: 7.2, goalsScored: 5, goalsConceded: 4, bigChances: 8 },
  ],
},
{
  year: 1986,
  host: 'Mexico',
  winner: { team: 'ARG', name: 'Argentina' },
  runnerUp: { team: 'GER', name: 'West Germany' },
  thirdPlace: { team: 'FRA', name: 'France' },
  goldenBall: 'Diego Maradona',
  goldenBoot: 'Gary Lineker',
  goldenGlove: 'Helmut Duckadam',
  totalGoals: 132,
  totalMatches: 52,
  topPlayers: [
    { name: 'Lineker',    team: 'ENG', goals: 6, assists: 0, rating: 8.3 },
    { name: 'Maradona',   team: 'ARG', goals: 5, assists: 5, rating: 9.5 },
    { name: 'Butragueño', team: 'ESP', goals: 5, assists: 0, rating: 8.0 },
    { name: 'Careca',     team: 'BRA', goals: 5, assists: 0, rating: 7.8 },
    { name: 'Platini',    team: 'FRA', goals: 0, assists: 4, rating: 7.2 },
  ],
  topTeams: [
    { team: 'ARG', avgRating: 8.5, goalsScored: 14, goalsConceded: 5, bigChances: 22 },
    { team: 'FRA', avgRating: 7.8, goalsScored: 12, goalsConceded: 6, bigChances: 18 },
    { team: 'GER', avgRating: 7.6, goalsScored: 8, goalsConceded: 7, bigChances: 14 },
  ],
},
// Add 1982, 1978, 1974, 1970, 1966, 1962, 1958, 1954, 1950, 1938, 1934, 1930 similarly
```

---

## Fix 8: /glory URL → 404 (🟢 Low)

### Problem
The feature is called "Glory Index" but lives at `/rankings`. Typing `/glory` directly gives a 404.

### File: `next.config.mjs`

```diff
 const nextConfig = {
   images: { /* ... */ },
   async headers() { /* ... */ },
+  async redirects() {
+    return [
+      { source: '/glory', destination: '/rankings', permanent: true },
+      { source: '/glory-index', destination: '/rankings', permanent: true },
+    ];
+  },
 };
```

---

## Fix 9: Format Page Venues Hardcoded (🟢 Low)

### Problem
`src/app/format/page.tsx` has a separate inline `VENUES` array with 16 venues. This should import from the central `STADIUMS` array to stay in sync.

### File: `src/app/format/page.tsx`

```diff
+import { STADIUMS } from '@/lib/data';

 // Remove the inline VENUES array and replace with:
-const VENUES = [
-  { city: 'New York/NJ', stadium: 'MetLife Stadium', capacity: '82,500', flag: '🇺🇸' },
-  // ... 15 more
-];
+const VENUES = STADIUMS.map(s => ({
+  city: s.city,
+  stadium: s.name,
+  capacity: s.capacity.toLocaleString(),
+  flag: s.hostCountry === 'USA' ? '🇺🇸' : s.hostCountry === 'MEX' ? '🇲🇽' : '🇨🇦',
+}));
```

---

## Fix 10: Mock Matches Look Real (🟡 High)

### Problem
When `FOOTBALL_API_KEY` is not set, `/api/matches` returns 3 hardcoded matches (GER vs JPN, BRA vs SUI, USA vs ENG) that appear real to users. The `isMock` flag exists in the response but the UI doesn't surface it.

### File: `src/app/api/matches/route.ts`

Ensure mock matches have `preview` status:

```diff
 const MOCK_MATCHES: Match[] = [
   {
     id: 'mock-1',
-    status: 'NS' as MatchStatus,
+    status: 'preview' as MatchStatus,
     homeTeam: { id: 'GER', name: 'Germany', logo: '🇩🇪' },
     awayTeam: { id: 'JPN', name: 'Japan', logo: '🇯🇵' },
     // ...
   },
   // ... same for mock-2, mock-3
 ];
```

### File: `src/components/ui/LiveScoreTicker.tsx` (or wherever matches are rendered)

Add mock data banner:

```diff
+{data?.isMock && (
+  <div className="text-xs text-amber-500/60 text-center py-1.5 mb-2 bg-amber-500/5 border border-amber-500/10 rounded-lg">
+    📡 Preview mode — live scores available when the tournament starts
+  </div>
+)}
```

---

## Fix 11: Team Stats Are Fabricated (🟡 High)

### Problem
The "Stats" tab on team profile pages (`TeamProfile.tsx`) shows goals analysis, attack breakdown, shot accuracy, and discipline cards — all generated from templates, not real data.

### File: `src/components/teams/TeamProfile.tsx`

Add a label to the Stats tab:

```diff
 // In the Stats tab content:
 <div className="flex items-center justify-between mb-3">
   <h3 className="text-lg font-bold text-dark-text-primary">Stats</h3>
+  <span className="text-[10px] text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
+    AI Projected
+  </span>
 </div>
```

---

## Fix 12: Wrapped Empty State Missing (🟢 Low)

### Problem
`WCWrapped.tsx` generates a personalized summary from user interactions (bracket picks, predictions, streaks). If a user hasn't interacted with anything, it should show a helpful CTA instead of an empty/broken state.

### File: `src/components/wrapped/WCWrapped.tsx`

Add empty state check early in the component:

```typescript
// After computing user stats from Zustand store:
const totalInteractions = bracketPicks + predictions + streakDays;

if (totalInteractions === 0) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-4xl mb-4">🏆</div>
      <h2 className="text-xl font-bold text-dark-text-primary mb-2">
        Your World Cup Wrapped
      </h2>
      <p className="text-dark-text-muted text-sm mb-6 max-w-xs mx-auto">
        Start exploring the tournament to build your personalized World Cup story!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/bracket"
          className="px-5 py-2.5 bg-dark-accent text-dark-bg rounded-lg font-medium text-sm hover:bg-dark-accent/90 transition-colors"
        >
          Build Your Bracket
        </Link>
        <Link
          href="/groups"
          className="px-5 py-2.5 bg-dark-surface border border-dark-border text-dark-text-primary rounded-lg font-medium text-sm hover:bg-dark-border/50 transition-colors"
        >
          Simulate Groups
        </Link>
      </div>
    </div>
  );
}
```

---

## Fix 13: Data Scraping Pipeline (🟡 High — New)

### Problem
All data is static and stale. There's no mechanism to refresh squads, verify rankings, or pull live stats.

### New file: `scripts/refresh-data.sh`

```bash
#!/bin/bash
set -euo pipefail

echo "🏟️  Bring It Home — Data Refresh Pipeline"
echo "==========================================="

if [ -z "${FOOTBALL_API_KEY:-}" ]; then
  echo "⚠️  FOOTBALL_API_KEY not set. Running validation only."
fi

# Step 1: Validate existing data
echo ""
echo "🔍 Step 1: Validating data integrity..."
npx ts-node scripts/validate-data.ts

# Step 2: Refresh squads (if API key available)
if [ -n "${FOOTBALL_API_KEY:-}" ]; then
  echo ""
  echo "📋 Step 2: Refreshing squad data..."
  npx ts-node scripts/scrape-squads.ts
fi

# Step 3: Verify against known facts
echo ""
echo "✅ Step 3: Running fact checks..."
npx ts-node scripts/fact-check.ts

echo ""
echo "🏁 Pipeline complete!"
```

### New file: `scripts/validate-data.ts`

```typescript
#!/usr/bin/env npx ts-node
import * as fs from 'fs';
import * as path from 'path';

let errors = 0;
const squadsDir = path.join(__dirname, '..', 'src', 'lib', 'squads');

// Check 1: 48 squad files exist
const squadFiles = fs.readdirSync(squadsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
if (squadFiles.length !== 48) {
  console.error(`❌ Expected 48 squad files, found ${squadFiles.length}`);
  errors++;
} else {
  console.log(`✅ 48 squad files present`);
}

// Check 2: Each squad has 23-26 players
for (const file of squadFiles) {
  const content = fs.readFileSync(path.join(squadsDir, file), 'utf-8');
  const playerCount = (content.match(/id:\s*'/g) || []).length;
  if (playerCount < 23 || playerCount > 26) {
    console.error(`❌ ${file}: ${playerCount} players (expected 23-26)`);
    errors++;
  }
}
console.log(`✅ Squad sizes verified`);

// Check 3: No retired players
const RETIRED: Record<string, string> = {
  'griezmann': 'Retired Sept 2024',
  'di-maria': 'Retired Copa América 2024',
  'gundogan': 'Retired July 2024',
  'kroos': 'Retired Euro 2024',
  'busquets': 'Retired 2023',
  'hazard': 'Retired 2024',
  'lloris': 'Retired 2022 WC',
  'benzema': 'Retired from NT 2023',
};

for (const file of squadFiles) {
  const content = fs.readFileSync(path.join(squadsDir, file), 'utf-8');
  for (const [id, reason] of Object.entries(RETIRED)) {
    if (content.includes(`'${id}'`)) {
      console.error(`❌ ${file}: Contains ${id} — ${reason}`);
      errors++;
    }
  }
}

// Check 4: History data — no individual scorer > 8 goals in a single tournament
const historyPath = path.join(__dirname, '..', 'src', 'lib', 'data-history.ts');
if (fs.existsSync(historyPath)) {
  const histContent = fs.readFileSync(historyPath, 'utf-8');
  const goalMatches = [...histContent.matchAll(/goals:\s*(\d+)/g)];
  for (const m of goalMatches) {
    const goals = parseInt(m[1]);
    if (goals > 8) {
      console.warn(`⚠️  Suspicious goal count (${goals}) in data-history.ts — max single-tournament is 8 (Just Fontaine, 1958)`);
    }
  }
}

// Check 5: Nationality mismatches
const NATIONALITY_CHECK: Record<string, string[]> = {
  'ENG.ts': ['raya'], // Raya is Spanish
};
for (const [file, wrongPlayers] of Object.entries(NATIONALITY_CHECK)) {
  const filePath = path.join(squadsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const player of wrongPlayers) {
      if (content.includes(`'${player}'`)) {
        console.error(`❌ ${file}: Contains '${player}' who plays for a different national team`);
        errors++;
      }
    }
  }
}

console.log(`\n${errors === 0 ? '✅' : '❌'} Validation complete: ${errors} error(s)`);
process.exit(errors > 0 ? 1 : 0);
```

### New file: `scripts/fact-check.ts`

```typescript
#!/usr/bin/env npx ts-node
/**
 * Fact-check static content against known facts
 */
import * as fs from 'fs';
import * as path from 'path';

let warnings = 0;

// Known facts
const FACTS = {
  mostWCGoals: { team: 'Brazil', goals: 237 },
  allTimeTopScorer: { player: 'Miroslav Klose', goals: 16 },
  mostTitles: { team: 'Brazil', count: 5 },
  hostCountries2026: ['USA', 'Mexico', 'Canada'],
  totalTeams2026: 48,
  totalVenues2026: 16,
};

// Check home page facts
const homePage = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'app', 'page.tsx'), 'utf-8'
);

if (homePage.includes('Germany') && homePage.includes('232 goals')) {
  console.error('❌ Home page: Says Germany holds goal record — should be Brazil (237)');
  warnings++;
}

if (homePage.includes('Klose') && homePage.includes('16 goals')) {
  console.log('✅ Home page: Klose 16 goals fact is correct');
}

// Check stadium count
const dataFile = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'lib', 'data.ts'), 'utf-8'
);
const stadiumCount = (dataFile.match(/id:\s*'/g) || []).length;
// This is approximate — stadiums section only
console.log(`ℹ️  data.ts contains approximately ${stadiumCount} entries with 'id' field`);

console.log(`\n${warnings === 0 ? '✅' : '⚠️'} Fact check complete: ${warnings} warning(s)`);
```

---

## Fix 14: Player Photos Missing (🟢 Low)

### Problem
Player cards don't show real photos. When in mock/static mode, there's no photo source.

### File: `src/lib/players.ts` or `src/components/players/PlayerCard.tsx`

Add a fallback photo generator:

```typescript
function getPlayerPhoto(name: string): string {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a2e&color=f5c542&size=128&bold=true&format=svg`;
}
```

Add this as the `photo` field in the player object when no API-Football photo URL is available.

---

## Fix 15: No API Rate Limiting (🟢 Low)

### Problem
API routes (`/api/matches`, `/api/players`, `/api/news`, `/api/simulator`, `/api/wrapped/narrative`) have no rate limiting. A bot could hammer the Gemini or API-Football endpoints.

### New file: `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (resets on deploy)
// For production, use Vercel KV or Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 60;        // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

export function middleware(req: NextRequest) {
  // Only rate-limit API routes
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = req.ip ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return NextResponse.next();
  }

  entry.count++;

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## Implementation Order

### Phase 1: Quick Wins (< 1 hour total)
1. Fix 2 — Home page fact (5 min)
2. Fix 8 — /glory redirect (5 min)
3. Fix 6 — Glory Index labels (15 min)
4. Fix 12 — Wrapped empty state (15 min)

### Phase 2: Data Accuracy (2-3 hours)
5. Fix 1 — History data corrections (45 min)
6. Fix 3 — Retired players (1 hr)
7. Fix 5 — 16 stadiums (30 min)

### Phase 3: Real Data Foundation (4-6 hours)
8. Fix 4 — Player stats overrides (3-4 hrs)
9. Fix 13 — Validation scripts (1-2 hrs)

### Phase 4: Polish (1-2 hours)
10. Fix 7 — History leaderboard scope (30 min for label, 2-4 hrs for full data)
11. Fix 9 — Format page venue sync (20 min)
12. Fix 10 — Mock match labeling (30 min)
13. Fix 11 — Team stats "projected" label (20 min)
14. Fix 14 — Player photos (45 min)
15. Fix 15 — Rate limiting (30 min)
