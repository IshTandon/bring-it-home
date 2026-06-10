import type { SquadList } from '@/types';
import { SQUAD_BRA } from './squads/BRA';
import { SQUAD_FRA } from './squads/FRA';
import { SQUAD_ARG } from './squads/ARG';
import { SQUAD_ENG } from './squads/ENG';
import { SQUAD_ESP } from './squads/ESP';
import { SQUAD_GER } from './squads/GER';
import { SQUAD_POR } from './squads/POR';
import { SQUAD_NED } from './squads/NED';
import { SQUAD_BEL } from './squads/BEL';
import { SQUAD_MAR } from './squads/MAR';
import { SQUAD_CRO } from './squads/CRO';
import { SQUAD_URU } from './squads/URU';

export const SQUADS_TOP12: Record<string, SquadList> = {
  BRA: SQUAD_BRA,
  FRA: SQUAD_FRA,
  ARG: SQUAD_ARG,
  ENG: SQUAD_ENG,
  ESP: SQUAD_ESP,
  GER: SQUAD_GER,
  POR: SQUAD_POR,
  NED: SQUAD_NED,
  BEL: SQUAD_BEL,
  MAR: SQUAD_MAR,
  CRO: SQUAD_CRO,
  URU: SQUAD_URU,
};
