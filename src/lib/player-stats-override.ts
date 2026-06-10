/**
 * Hand-curated [PAC, SHO, PAS, DRI, DEF, PHY] tuples keyed by `${teamId}:${playerId}`.
 * Used by buildPlayer to bypass the position-template formula for known players.
 */
export const PLAYER_STATS_OVERRIDE: Record<
  string,
  [number, number, number, number, number, number]
> = {
  // ARGENTINA
  'ARG:martinez':           [50, 12, 42, 30, 86, 80],
  'ARG:romero':             [72, 35, 55, 52, 85, 82],
  'ARG:lisandro-martinez':  [68, 38, 62, 58, 84, 83],
  'ARG:molina':             [82, 52, 65, 70, 75, 76],
  'ARG:de-paul':            [74, 70, 78, 80, 68, 78],
  'ARG:mac-allister':       [72, 73, 82, 80, 72, 74],
  'ARG:fernandez':          [75, 72, 76, 78, 73, 77],
  'ARG:messi':              [72, 86, 90, 94, 34, 62],
  'ARG:alvarez':            [83, 82, 70, 82, 42, 76],
  'ARG:lautaro-martinez':   [80, 85, 65, 80, 38, 78],
  'ARG:garnacho':           [90, 72, 65, 84, 30, 62],
  'ARG:dybala':             [72, 82, 82, 88, 28, 56],

  // FRANCE
  'FRA:maignan':            [52, 14, 52, 36, 87, 84],
  'FRA:kounde':             [80, 42, 68, 72, 84, 78],
  'FRA:upamecano':          [78, 34, 55, 52, 83, 86],
  'FRA:saliba':             [72, 32, 60, 56, 86, 82],
  'FRA:t-hernandez':        [88, 62, 72, 78, 72, 78],
  'FRA:tchouameni':         [72, 68, 76, 74, 82, 82],
  'FRA:rabiot':             [68, 72, 74, 74, 74, 80],
  'FRA:camavinga':          [78, 64, 76, 78, 76, 78],
  'FRA:zaire-emery':        [76, 68, 76, 80, 70, 72],
  'FRA:mbappe':             [97, 88, 78, 92, 36, 76],
  'FRA:dembele':            [92, 74, 74, 88, 32, 56],
  'FRA:barcola':            [94, 70, 68, 86, 28, 54],
  'FRA:thuram':             [86, 78, 68, 78, 36, 82],

  // SPAIN
  'ESP:unai-simon':         [48, 10, 54, 32, 84, 80],
  'ESP:carvajal':           [76, 55, 72, 74, 82, 76],
  'ESP:le-normand':         [62, 30, 52, 48, 84, 82],
  'ESP:pau-cubarsi':        [72, 28, 66, 64, 80, 74],
  'ESP:grimaldo':           [78, 62, 80, 78, 68, 64],
  'ESP:pedri':              [72, 68, 86, 88, 68, 60],
  'ESP:rodri':              [58, 70, 84, 78, 86, 84],
  'ESP:gavi':               [78, 66, 78, 82, 72, 72],
  'ESP:yamal':              [92, 74, 78, 90, 26, 50],
  'ESP:morata':             [76, 82, 62, 72, 32, 74],
  'ESP:williams':           [96, 76, 68, 86, 32, 68],

  // ENGLAND
  'ENG:pickford':           [46, 12, 48, 30, 82, 78],
  'ENG:alexander-arnold':   [72, 62, 88, 76, 64, 68],
  'ENG:stones':             [58, 38, 72, 58, 82, 78],
  'ENG:guehi':              [70, 30, 58, 52, 82, 80],
  'ENG:rice':               [70, 72, 76, 74, 82, 82],
  'ENG:bellingham':         [76, 82, 78, 84, 68, 80],
  'ENG:mainoo':             [74, 68, 76, 80, 70, 72],
  'ENG:kane':               [64, 92, 82, 80, 44, 82],
  'ENG:saka':               [88, 80, 78, 86, 52, 64],
  'ENG:foden':              [82, 80, 82, 88, 48, 60],
  'ENG:palmer':             [78, 82, 76, 86, 40, 62],

  // BRAZIL
  'BRA:alisson':            [48, 14, 56, 38, 88, 84],
  'BRA:militao':            [78, 42, 58, 56, 84, 82],
  'BRA:marquinhos':         [68, 38, 62, 58, 86, 80],
  'BRA:casemiro':           [62, 68, 72, 68, 84, 84],
  'BRA:bruno-guimaraes':    [62, 70, 80, 78, 76, 76],
  'BRA:lucas-paqueta':      [72, 74, 78, 82, 52, 72],
  'BRA:vinicius-jr':        [95, 82, 74, 92, 28, 66],
  'BRA:rodrygo':            [88, 78, 76, 86, 34, 62],
  'BRA:raphinha':           [86, 78, 72, 84, 38, 64],
  'BRA:endrick':            [84, 78, 58, 78, 26, 72],

  // GERMANY
  'GER:neuer':              [42, 12, 52, 34, 86, 80],
  'GER:kimmich':            [74, 64, 84, 76, 82, 76],
  'GER:rudiger':            [82, 38, 55, 50, 86, 86],
  'GER:musiala':            [78, 74, 78, 90, 38, 60],
  'GER:wirtz':              [76, 78, 82, 86, 48, 62],
  'GER:havertz':            [72, 78, 74, 78, 42, 74],
  'GER:sane':               [90, 76, 72, 84, 32, 62],

  // PORTUGAL
  'POR:diogo-costa':        [46, 10, 48, 30, 84, 78],
  'POR:dalot':              [82, 52, 70, 72, 76, 74],
  'POR:ruben-dias':         [62, 32, 62, 52, 88, 84],
  'POR:cancelo':            [82, 62, 80, 82, 68, 70],
  'POR:bruno-fernandes':    [68, 84, 86, 82, 56, 72],
  'POR:vitinha':            [70, 68, 84, 84, 62, 58],
  'POR:bernardo-silva':     [72, 72, 84, 88, 54, 56],
  'POR:ronaldo':            [62, 88, 68, 76, 30, 76],
  'POR:rafael-leao':        [94, 76, 66, 88, 24, 62],

  // NETHERLANDS
  'NED:van-de-ven':         [95, 32, 55, 58, 80, 78],
  'NED:de-jong':            [72, 64, 84, 82, 72, 64],

  // BELGIUM
  'BEL:de-bruyne':          [70, 84, 92, 86, 58, 76],

  // CROATIA
  'CRO:modric':             [62, 72, 86, 84, 62, 62],

  // USA
  'USA:pulisic':            [84, 74, 74, 82, 38, 62],
  'USA:mckennie':           [72, 68, 68, 70, 72, 80],
  'USA:adams':              [72, 54, 68, 68, 78, 80],
  'USA:reyna':              [78, 70, 76, 82, 32, 56],
  'USA:balogun':            [82, 78, 56, 76, 28, 72],

  // JAPAN
  'JPN:kubo':               [82, 74, 76, 84, 30, 54],
  'JPN:mitoma':             [90, 72, 70, 86, 28, 56],
  'JPN:kamada':             [70, 72, 78, 80, 50, 62],
  'JPN:endo':               [58, 62, 78, 72, 80, 76],

  // MEXICO
  'MEX:lozano':             [90, 74, 66, 82, 30, 58],
  'MEX:gimenez':            [78, 82, 58, 74, 28, 76],

  // MOROCCO
  'MAR:hakimi':             [92, 62, 72, 80, 72, 72],
  'MAR:amrabat':            [68, 52, 70, 68, 80, 82],

  // SOUTH KOREA
  'KOR:son':                [88, 86, 78, 86, 38, 64],

  // URUGUAY
  'URU:valverde':           [86, 78, 74, 80, 72, 82],
  'URU:nunez':              [90, 82, 56, 76, 30, 78],

  // COLOMBIA
  'COL:luis-diaz':          [92, 78, 68, 86, 32, 62],
};
