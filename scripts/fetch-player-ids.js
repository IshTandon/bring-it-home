/**
 * Fetches correct API-Football player IDs for all players in data-squads-top12.ts
 * 
 * Usage:
 *   1. Get a free API key from https://www.api-football.com (100 req/day)
 *   2. Run: FOOTBALL_API_KEY=your_key node scripts/fetch-player-ids.js
 * 
 * Output: prints the correct apiId for each player, ready to paste into the data file.
 */

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_HOST = 'v3.football.api-sports.io';

if (!API_KEY) {
  console.error('Set FOOTBALL_API_KEY env variable. Get free key at https://www.api-football.com');
  process.exit(1);
}

const TEAM_IDS = {
  BRA: 6, FRA: 2, ARG: 26, ENG: 10, ESP: 9,
  GER: 25, POR: 27, NED: 1118, BEL: 1, MAR: 31, CRO: 3, URU: 7,
};

async function fetchSquad(teamId) {
  const url = `https://${API_HOST}/players/squads?team=${teamId}`;
  const res = await fetch(url, {
    headers: { 'x-apisports-key': API_KEY },
  });
  const json = await res.json();
  return json.response?.[0]?.players || [];
}

function normalize(name) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function findMatch(apiPlayers, targetName) {
  const target = normalize(targetName);
  
  for (const p of apiPlayers) {
    const full = normalize(p.name);
    const first = normalize(p.firstname || '');
    const last = normalize(p.lastname || '');
    
    if (full === target || last === target) return p;
    if (target.includes(last) && last.length > 3) return p;
    if (full.includes(target) || target.includes(full)) return p;
  }
  
  const parts = target.split(' ');
  for (const p of apiPlayers) {
    const full = normalize(p.name);
    const last = normalize(p.lastname || '');
    for (const part of parts) {
      if (part.length > 3 && (last === part || full.includes(part))) return p;
    }
  }
  
  return null;
}

async function main() {
  const results = {};
  
  for (const [code, teamId] of Object.entries(TEAM_IDS)) {
    console.error(`Fetching squad for ${code} (team ${teamId})...`);
    const players = await fetchSquad(teamId);
    results[code] = players.map(p => ({
      id: p.id,
      name: p.name,
      number: p.number,
      position: p.position,
      photo: p.photo,
    }));
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
