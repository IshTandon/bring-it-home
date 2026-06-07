const fs = require('fs');
const path = require('path');

const top12Path = path.join(__dirname, '..', 'src', 'lib', 'data-squads-top12.ts');
const restPath = path.join(__dirname, '..', 'src', 'lib', 'data-squads-rest.ts');
const squadsDir = path.join(__dirname, '..', 'src', 'lib', 'squads');

function parseSquads(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = {};

  const teamRegex = /^\s{2}(\w+):\s*\{/gm;
  let match;
  const teamStarts = [];

  while ((match = teamRegex.exec(content)) !== null) {
    teamStarts.push({ id: match[1], start: match.index });
  }

  for (let i = 0; i < teamStarts.length; i++) {
    const teamId = teamStarts[i].id;
    const start = teamStarts[i].start;
    const searchFrom = content.indexOf('{', start);

    let braceCount = 0;
    let end = searchFrom;
    for (let j = searchFrom; j < content.length; j++) {
      if (content[j] === '{') braceCount++;
      if (content[j] === '}') braceCount--;
      if (braceCount === 0) {
        end = j + 1;
        break;
      }
    }

    const squadBody = content.substring(searchFrom, end);
    result[teamId] = squadBody;
  }

  return result;
}

const top12 = parseSquads(top12Path);
const rest = parseSquads(restPath);
const all = { ...top12, ...rest };

const indexExports = [];

for (const [teamId, body] of Object.entries(all)) {
  const fileContent = `import type { SquadList } from '@/types';

export const SQUAD_${teamId}: SquadList = ${body};
`;
  fs.writeFileSync(path.join(squadsDir, `${teamId}.ts`), fileContent);
  indexExports.push(teamId);
}

const indexContent = `import type { SquadList } from '@/types';

${indexExports.map(id => `export { SQUAD_${id} } from './${id}';`).join('\n')}

export async function loadSquad(teamId: string): Promise<SquadList | null> {
  try {
    const mod = await import(\`@/lib/squads/\${teamId}\`);
    const key = \`SQUAD_\${teamId}\`;
    return (mod as Record<string, SquadList>)[key] ?? null;
  } catch {
    return null;
  }
}
`;

fs.writeFileSync(path.join(squadsDir, 'index.ts'), indexContent);
console.log(`Generated ${indexExports.length} squad files + index.ts`);
