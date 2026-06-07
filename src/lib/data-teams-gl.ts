import type { Team } from '@/types';

export const TEAMS_GL: Omit<Team, 'players'>[] = [
  // ─── Group G ──────────────────────────────────────────────
  {
    id: 'BEL', name: 'Belgium', flag: '🇧🇪', rating: 88, rank: 9, group: 'G',
    coach: 'Domenico Tedesco', mascot: 'Red Devils', style: 'Golden Generation flair — technical midfield with rapid transitions',
    founded: 1895, titles: 0, finals: 0, semifinals: 2, bestResult: 'Third place (2018)',
    facts: [
      'Golden Generation peaked at FIFA #1 for a record 48 months (2015–2018)',
      'Finished third at Russia 2018 — their best ever World Cup result',
      'Only nation where French and Dutch football cultures collide on one pitch',
      'Reached the semifinals in 1986 and 2018 but never a final',
    ],
  },
  {
    id: 'IRN', name: 'Iran', flag: '🇮🇷', rating: 79, rank: 21, group: 'G',
    coach: 'Amir Ghalenoei', mascot: 'Team Melli', style: 'Organized low block with dangerous set-piece routines',
    founded: 1920, titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1978, 1998, 2006, 2014, 2018, 2022)',
    facts: [
      'Asia\'s most successful World Cup qualifying nation — six consecutive appearances through 2022',
      'Beat the USA 2-1 at France 1998 in a politically charged group-stage clash',
      'Have never advanced past the group stage in six World Cup appearances',
      'Amir Ghalenoei returned as head coach in 2023 after a successful club career in Iran',
    ],
  },
  {
    id: 'EGY', name: 'Egypt', flag: '🇪🇬', rating: 72, rank: 29, group: 'G',
    coach: 'Hossam Hassan', mascot: 'Pharaohs', style: 'Defensive resilience built around Mohamed Salah\'s counter-attacking threat',
    founded: 1921, titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1934, 1990, 2018)',
    facts: [
      'Record seven AFCON titles — the most successful nation in African continental history',
      'First African and Arab nation to qualify for a World Cup, in 1934',
      'Mohamed Salah\'s 2018 appearance ended a 28-year wait since 1990',
      'Hossam Hassan is Egypt\'s all-time leading goalscorer with 70 international goals',
    ],
  },
  {
    id: 'NZL', name: 'New Zealand', flag: '🇳🇿', rating: 58, rank: 95, group: 'G',
    coach: 'Darren Bazeley', mascot: 'All Whites', style: 'Resilient defensive structure with set-piece danger',
    founded: 1891, titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1982, 2010)',
    facts: [
      'The only unbeaten team at the 2010 World Cup — drew all three group matches',
      'Nickname "All Whites" comes from their all-white kit, mirroring the All Blacks rugby team',
      'Chris Wood is their all-time leading international goalscorer',
      'Previously qualified in 1982 and 2010 before their 2026 return',
    ],
  },

  // ─── Group H ──────────────────────────────────────────────
  {
    id: 'ESP', name: 'Spain', flag: '🇪🇸', rating: 93, rank: 2, group: 'H',
    coach: 'Luis de la Fuente', mascot: 'La Roja', style: 'Tiki-taka evolved — high-tempo positional play with technical mastery',
    founded: 1909, titles: 1, finals: 1, semifinals: 5, bestResult: 'Champions (2010)',
    facts: [
      'Won Euro 2024 — first nation to win four European Championships',
      'Iniesta\'s 116th-minute winner against the Netherlands sealed the 2010 World Cup',
      'Won three straight major tournaments: Euro 2008, World Cup 2010, Euro 2012',
      'Lamine Yamal became the youngest ever Euro goalscorer at age 16 in 2024',
    ],
  },
  {
    id: 'URU', name: 'Uruguay', flag: '🇺🇾', rating: 82, rank: 17, group: 'H',
    coach: 'Marcelo Bielsa', mascot: 'La Celeste', style: 'Garra Charrúa — fighting spirit with tactical discipline and compact defending',
    founded: 1900, titles: 2, finals: 2, semifinals: 5, bestResult: 'Champions (1930, 1950)',
    facts: [
      'Hosted and won the inaugural World Cup in 1930',
      'The 1950 Maracanazo — beat Brazil 2-1 in Rio to claim their second title',
      'Smallest nation by population ever to win the World Cup',
      'Marcelo Bielsa appointed manager in 2024, bringing his trademark high-intensity pressing',
    ],
  },
  {
    id: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', rating: 58, rank: 57, group: 'H',
    coach: 'Roberto Mancini', mascot: 'Green Falcons', style: 'Disciplined defensive block with rapid transitions on the counter',
    founded: 1956, titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (1994)',
    facts: [
      'Beat Argentina 2-1 in the 2022 World Cup opener — one of the biggest upsets in decades',
      'Reached the Round of 16 in 1994 — their best ever World Cup finish',
      'Three-time AFC Asian Cup champions (1984, 1988, 1996)',
      'Roberto Mancini appointed head coach in 2024 after winning Euro 2020 with Italy',
    ],
  },
  {
    id: 'CPV', name: 'Cape Verde', flag: '🇨🇻', rating: 58, rank: 70, group: 'H',
    coach: 'Pedro Brito', mascot: 'Blue Sharks', style: 'Organized defensive shape with pace and technical quality from a diaspora-heavy squad',
    founded: 1982, titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: [
      'Making their first World Cup appearance in 2026 — a historic moment for the island nation',
      'Population under 600,000 — one of the smallest nations ever to qualify for a World Cup',
      'Reached the AFCON quarterfinals on their tournament debut in 2013',
      'Many squad players are born or raised in the European diaspora, blending styles across leagues',
    ],
  },

  // ─── Group I ──────────────────────────────────────────────
  {
    id: 'FRA', name: 'France', flag: '🇫🇷', rating: 95, rank: 1, group: 'I',
    coach: 'Didier Deschamps', mascot: 'Les Bleus', style: 'Defensive solidity with lightning counter-attacks and individual brilliance',
    founded: 1904, titles: 2, finals: 3, semifinals: 6, bestResult: 'Champions (1998, 2018)',
    facts: [
      'Two-time world champions — won on home soil in 1998 and in Russia in 2018',
      'Mbappé scored a hat-trick in the 2022 final — only the second ever in a World Cup final',
      'Deschamps is one of only three people to win the World Cup as both player and manager',
      'Youngest World Cup-winning squad in 2018 — average age 26.1 years',
    ],
  },
  {
    id: 'SEN', name: 'Senegal', flag: '🇸🇳', rating: 84, rank: 14, group: 'I',
    coach: 'Aliou Cissé', mascot: 'Lions of Teranga', style: 'Physical, fast, and direct with explosive pace and set-piece threat',
    founded: 1960, titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2002)',
    facts: [
      'First African nation to win a World Cup opening match — beat holders France 1-0 in 2002',
      'Reached the quarterfinals in 2002 — matched Cameroon 1990 as Africa\'s best at the time',
      'AFCON 2021 champions under Aliou Cissé, their first continental title',
      'Sadio Mané is the nation\'s greatest modern player and all-time leading scorer',
    ],
  },
  {
    id: 'NOR', name: 'Norway', flag: '🇳🇴', rating: 60, rank: 44, group: 'I',
    coach: 'Ståle Solbakken', mascot: 'Drillos', style: 'Direct, physical Scandinavian football with organized defending and aerial power',
    founded: 1902, titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (1998)',
    facts: [
      'Best World Cup finish was the Round of 16 in 1998, losing 1-0 to Italy',
      'Failed to qualify for every World Cup between 1998 and 2026 despite golden generations',
      'Erling Haaland and Martin Ødegaard headline a squad finally back on football\'s biggest stage',
      'Ståle Solbakken leads Norway into their first World Cup in 28 years',
    ],
  },
  {
    id: 'IRQ', name: 'Iraq', flag: '🇮🇶', rating: 58, rank: 61, group: 'I',
    coach: 'Jesús Casas', mascot: 'Lions of Mesopotamia', style: 'Compact defensive block with passionate, physical midfield battles',
    founded: 1948, titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1986)',
    facts: [
      'Won the 2007 AFC Asian Cup — the greatest achievement in Iraqi football history',
      'Only World Cup appearance was in 1986 in Mexico, exiting at the group stage',
      'Nickname "Lions of Mesopotamia" reflects the nation\'s ancient Mesopotamian heritage',
      'The national team remained a unifying symbol through decades of conflict at home',
    ],
  },

  // ─── Group J ──────────────────────────────────────────────
  {
    id: 'ARG', name: 'Argentina', flag: '🇦🇷', rating: 92, rank: 3, group: 'J',
    coach: 'Lionel Scaloni', mascot: 'Albiceleste', style: 'Counter-press with creative midfield and Messi-era attacking fluidity',
    founded: 1893, titles: 3, finals: 5, semifinals: 6, bestResult: 'Champions (1978, 1986, 2022)',
    facts: [
      'Messi finally won the World Cup in 2022 at age 35 on his fifth attempt',
      'Three-time world champions — 1978, 1986, and 2022',
      'Maradona\'s "Hand of God" goal in 1986 is the most debated goal in World Cup history',
      'Argentina fans travel in the largest numbers of any nation at every World Cup',
    ],
  },
  {
    id: 'AUT', name: 'Austria', flag: '🇦🇹', rating: 77, rank: 23, group: 'J',
    coach: 'Ralf Rangnick', mascot: 'Das Team', style: 'High-pressing vertical play with gegenpressing triggers and quick transitions',
    founded: 1904, titles: 0, finals: 0, semifinals: 1, bestResult: 'Third place (1954)',
    facts: [
      'Finished third at the 1954 World Cup — their best ever tournament result',
      'The Wunderteam of the 1930s is considered one of football\'s greatest sides never to win a trophy',
      'Ralf Rangnick brought his trademark gegenpressing philosophy to the national team in 2024',
      'Reached the Euro 2024 Round of 16, signaling a resurgence on the international stage',
    ],
  },
  {
    id: 'ALG', name: 'Algeria', flag: '🇩🇿', rating: 67, rank: 36, group: 'J',
    coach: 'Vladimir Petković', mascot: 'Desert Foxes', style: 'Physical and direct with pace on the wings and organized defensive structure',
    founded: 1962, titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (2014)',
    facts: [
      'Beat West Germany 2-1 at the 1982 World Cup — one of the greatest shocks in tournament history',
      'Reached the Round of 16 in 2014 — their best ever World Cup finish',
      'AFCON 2019 champions under Djamel Belmadi, their second continental title',
      'Riyad Mahrez led the Desert Foxes to glory and is their most celebrated modern player',
    ],
  },
  {
    id: 'JOR', name: 'Jordan', flag: '🇯🇴', rating: 58, rank: 68, group: 'J',
    coach: 'Hossein Abdi', mascot: 'Al-Nashama', style: 'Disciplined defensive organization with quick transitions and set-piece threat',
    founded: 1949, titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: [
      'Qualified for their first World Cup in 2026 — a landmark moment for Jordanian football',
      'Reached the 2024 AFC Asian Cup final, losing to hosts Qatar',
      'Nickname "Al-Nashama" means "The Chivalrous" in Arabic',
      'Hossein Abdi guided the side through Asian qualifying as head coach',
    ],
  },

  // ─── Group K ──────────────────────────────────────────────
  {
    id: 'POR', name: 'Portugal', flag: '🇵🇹', rating: 90, rank: 5, group: 'K',
    coach: 'Roberto Martínez', mascot: 'Seleção das Quinas', style: 'Technical possession with explosive wide play and individual match-winners',
    founded: 1921, titles: 0, finals: 0, semifinals: 2, bestResult: 'Third place (1966)',
    facts: [
      'Cristiano Ronaldo is the all-time leading international goalscorer in men\'s football',
      'Euro 2016 champions — beat France 1-0 in the final in Paris',
      'Best World Cup finish was third place at England 1966',
      'Roberto Martínez has brought dynamic, attack-minded football since taking charge in 2023',
    ],
  },
  {
    id: 'COL', name: 'Colombia', flag: '🇨🇴', rating: 85, rank: 13, group: 'K',
    coach: 'Néstor Lorenzo', mascot: 'Los Cafeteros', style: 'Creative flair with explosive attacking transitions and technical midfield play',
    founded: 1924, titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2014)',
    facts: [
      'James Rodríguez won the 2014 Golden Boot with six goals — a tournament record',
      'Reached the quarterfinals in 2014 — their best ever World Cup performance',
      'Carlos Valderrama\'s blonde afro became an icon of 1990s world football',
      'Néstor Lorenzo guided Colombia to the Copa América 2024 final',
    ],
  },
  {
    id: 'COD', name: 'DR Congo', flag: '🇨🇩', rating: 58, rank: 51, group: 'K',
    coach: 'Sébastien Desabre', mascot: 'Leopards', style: 'Athletic and powerful with raw pace and direct attacking play',
    founded: 1919, titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1974 as Zaire)',
    facts: [
      'Competed as Zaire in the 1974 World Cup — their only previous appearance',
      'Suffered a 9-0 defeat to Yugoslavia in 1974 — one of the heaviest losses in World Cup history',
      'Won the AFCON twice as Zaire (1968) and DR Congo (1974)',
      'Considered one of Africa\'s most talent-rich nations by raw footballing ability',
    ],
  },
  {
    id: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', rating: 58, rank: 62, group: 'K',
    coach: 'Srecko Katanec', mascot: 'White Wolves', style: 'Physical and organized with set-piece expertise and disciplined defending',
    founded: 1946, titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: [
      'Making their World Cup debut in 2026 — a historic moment for Central Asian football',
      'The most successful football nation in Central Asia by continental results',
      'Server Djeparov was named AFC Player of the Year in 2008 and 2011',
      'Srecko Katanec has coached national teams across Europe, Africa, and Asia',
    ],
  },

  // ─── Group L ──────────────────────────────────────────────
  {
    id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 91, rank: 4, group: 'L',
    coach: 'Thomas Tuchel', mascot: 'Three Lions', style: 'Possession-based attacking football with pace on the wings and set-piece dominance',
    founded: 1863, titles: 1, finals: 1, semifinals: 3, bestResult: 'Champions (1966)',
    facts: [
      '1966 World Cup champions — their only major trophy in men\'s senior football',
      'Reached the semifinals in 1990 and 2018, falling short of a second final',
      'Thomas Tuchel appointed as head coach in 2025 — England\'s first German manager',
      'Invented the modern game in 1863 but have waited 60 years for a second World Cup title',
    ],
  },
  {
    id: 'CRO', name: 'Croatia', flag: '🇭🇷', rating: 87, rank: 11, group: 'L',
    coach: 'Zlatko Dalić', mascot: 'Vatreni', style: 'Midfield-dominant possession with tireless running and technical brilliance',
    founded: 1912, titles: 0, finals: 1, semifinals: 3, bestResult: 'Runners-up (2018)',
    facts: [
      'Reached the 2018 final with a population of just 4 million — smallest nation to reach a final since Uruguay',
      'Luka Modrić won the Golden Ball as the tournament\'s best player in 2018',
      'Finished third in 1998 and 2022 — perennial overachievers on the world stage',
      'Zlatko Dalić has managed the national team since 2017, guiding every major tournament run',
    ],
  },
  {
    id: 'PAN', name: 'Panama', flag: '🇵🇦', rating: 58, rank: 53, group: 'L',
    coach: 'Thomas Christiansen', mascot: 'Los Canaleros', style: 'Physical and direct with passionate support and compact defensive shape',
    founded: 1937, titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (2018)',
    facts: [
      'First World Cup appearance was in 2018 in Russia — qualification sparked a national holiday',
      'Román Torres scored the goal that sent Panama to their first ever World Cup',
      'Scored a famous consolation goal in a 6-1 defeat to England at Russia 2018',
      'Thomas Christiansen has coached across Central America, Qatar, and the national team',
    ],
  },
  {
    id: 'GHA', name: 'Ghana', flag: '🇬🇭', rating: 58, rank: 65, group: 'L',
    coach: 'Otto Addo', mascot: 'Black Stars', style: 'Energetic pressing with raw pace, physicality, and flair in the final third',
    founded: 1957, titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2010)',
    facts: [
      'Suárez\'s deliberate handball on the line in the 2010 quarterfinal denied Ghana a semifinal place',
      'Asamoah Gyan missed the resulting penalty in extra time — one of Africa\'s greatest heartbreaks',
      'Reached the quarterfinals in 2010 — their best ever World Cup result',
      'Four-time AFCON champions (1963, 1965, 1978, 1982)',
    ],
  },
];
