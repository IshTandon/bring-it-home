import type { SquadList } from '@/types';

export { SQUAD_BRA } from './BRA';
export { SQUAD_FRA } from './FRA';
export { SQUAD_ARG } from './ARG';
export { SQUAD_ENG } from './ENG';
export { SQUAD_ESP } from './ESP';
export { SQUAD_GER } from './GER';
export { SQUAD_POR } from './POR';
export { SQUAD_NED } from './NED';
export { SQUAD_BEL } from './BEL';
export { SQUAD_MAR } from './MAR';
export { SQUAD_CRO } from './CRO';
export { SQUAD_URU } from './URU';
export { SQUAD_MEX } from './MEX';
export { SQUAD_KOR } from './KOR';
export { SQUAD_RSA } from './RSA';
export { SQUAD_CZE } from './CZE';
export { SQUAD_SUI } from './SUI';
export { SQUAD_CAN } from './CAN';
export { SQUAD_QAT } from './QAT';
export { SQUAD_BIH } from './BIH';
export { SQUAD_SCO } from './SCO';
export { SQUAD_HAI } from './HAI';
export { SQUAD_USA } from './USA';
export { SQUAD_AUS } from './AUS';
export { SQUAD_PAR } from './PAR';
export { SQUAD_TUR } from './TUR';
export { SQUAD_CIV } from './CIV';
export { SQUAD_ECU } from './ECU';
export { SQUAD_CUW } from './CUW';
export { SQUAD_JPN } from './JPN';
export { SQUAD_SWE } from './SWE';
export { SQUAD_TUN } from './TUN';
export { SQUAD_IRN } from './IRN';
export { SQUAD_EGY } from './EGY';
export { SQUAD_NZL } from './NZL';
export { SQUAD_KSA } from './KSA';
export { SQUAD_CPV } from './CPV';
export { SQUAD_SEN } from './SEN';
export { SQUAD_NOR } from './NOR';
export { SQUAD_IRQ } from './IRQ';
export { SQUAD_AUT } from './AUT';
export { SQUAD_ALG } from './ALG';
export { SQUAD_JOR } from './JOR';
export { SQUAD_COL } from './COL';
export { SQUAD_COD } from './COD';
export { SQUAD_UZB } from './UZB';
export { SQUAD_PAN } from './PAN';
export { SQUAD_GHA } from './GHA';

export async function loadSquad(teamId: string): Promise<SquadList | null> {
  try {
    const mod = await import(`@/lib/squads/${teamId}`);
    const key = `SQUAD_${teamId}`;
    return (mod as Record<string, SquadList>)[key] ?? null;
  } catch {
    return null;
  }
}
