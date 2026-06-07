import type { Team, TeamStats, Player, SquadList, Stadium, Group, Match, TimelineDay } from '@/types';

export const TEAMS: Team[] = [
  {
    id: 'BRA', name: 'Brazil', flag: '🇧🇷', rating: 92, rank: 1, group: 'E',
    coach: 'Dorival Jr', mascot: 'Canarinho', style: 'Joga Bonito — flair, pressing, quick transitions',
    founded: 1914, titles: 5, finals: 7, semifinals: 11, bestResult: 'Champions (1958,1962,1970,1994,2002)',
    facts: [
      'Only nation to play in every single World Cup (22 editions)',
      'Their 7-1 loss to Germany in 2014 on home soil is called "The Mineirazo"',
      'Pelé won the WC at just 17 years old in 1958',
      'Yellow kit was banned in domestic football after 1950 final loss to Uruguay',
      'Ronaldo (R9) scored 8 goals in 2002 WC to claim the Golden Boot',
    ],
    players: [],
  },
  {
    id: 'FRA', name: 'France', flag: '🇫🇷', rating: 90, rank: 2, group: 'D',
    coach: 'Didier Deschamps', mascot: 'Footix the rooster', style: 'Defensive solidity with lightning counter-attack',
    founded: 1904, titles: 2, finals: 3, semifinals: 6, bestResult: 'Champions (1998, 2018)',
    facts: [
      'Youngest WC winning squad ever in 2018 — average age 26.1',
      'Mbappé was only 19 in the 2018 final when he scored',
      'The 2022 final vs Argentina is the most-watched sporting event ever',
      'Only team to win WC after the host nation also won',
    ],
    players: [],
  },
  {
    id: 'ARG', name: 'Argentina', flag: '🇦🇷', rating: 89, rank: 3, group: 'C',
    coach: 'Lionel Scaloni', mascot: 'Pibe de Oro', style: 'Counter-press with Messi pulling strings from deep',
    founded: 1893, titles: 3, finals: 5, semifinals: 6, bestResult: 'Champions (1978, 1986, 2022)',
    facts: [
      'Messi finally won the WC in 2022 at age 35 — his fifth attempt',
      'The 1986 "Hand of God" goal by Maradona is the most controversial in WC history',
      'Lost 3 consecutive finals (1990, 2014, 2022) before winning the third',
      'Argentina fans travel in the largest numbers of any WC team',
    ],
    players: [],
  },
  {
    id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 84, rank: 5, group: 'D',
    coach: 'Gareth Southgate', mascot: 'Three Lions', style: 'Possession with explosive pace on the wings',
    founded: 1863, titles: 1, finals: 1, semifinals: 4, bestResult: 'Champions (1966, home soil)',
    facts: [
      '"It\'s coming home" became a global meme in 2018',
      'England invented football in 1863 — but have only won once',
      'Lost penalty shoot-outs in 1990, 1996, 1998, 2006, 2021',
      'Gareth Southgate himself missed the crucial penalty in Euro 1996',
    ],
    players: [],
  },
  {
    id: 'ESP', name: 'Spain', flag: '🇪🇸', rating: 85, rank: 6, group: 'E',
    coach: 'Luis de la Fuente', mascot: 'Naranjito the orange', style: 'Tiki-taka evolved — high tempo positional play',
    founded: 1909, titles: 1, finals: 1, semifinals: 5, bestResult: 'Champions (2010)',
    facts: [
      'Won Euro 2024 — first nation to win 4 European Championships',
      'Xavi and Iniesta never lost a single WC game while both were playing',
      'Yamal was born the day of the 2007 Champions League final',
      'Iniesta scored the winning goal in the 116th minute of the 2010 final',
    ],
    players: [],
  },
  {
    id: 'GER', name: 'Germany', flag: '🇩🇪', rating: 85, rank: 4, group: 'F',
    coach: 'Julian Nagelsmann', mascot: 'Paule the eagle', style: 'Gegenpressing with technical midfield control',
    founded: 1900, titles: 4, finals: 8, semifinals: 13, bestResult: 'Champions (1954,1974,1990,2014)',
    facts: [
      'Germany is the only nation to win the WC in 3 different decades',
      'The 7-1 vs Brazil in 2014 semi-final is the biggest upset in WC history',
      'Miroslav Klose holds the all-time WC goal record with 16 goals',
      'Lost to South Korea in 2018 group stage — most shocking WC exit ever',
    ],
    players: [],
  },
  {
    id: 'POR', name: 'Portugal', flag: '🇵🇹', rating: 86, rank: 7, group: 'F',
    coach: 'Roberto Martínez', mascot: 'Quinas eagle', style: 'Technical possession with explosive wide play',
    titles: 0, finals: 0, semifinals: 4, bestResult: 'Third place (1966)',
    facts: ['Cristiano Ronaldo holds the all-time international goals record', 'Euro 2016 champions — beat France in the final in Paris'],
    players: [],
  },
  {
    id: 'NED', name: 'Netherlands', flag: '🇳🇱', rating: 84, rank: 8, group: 'G',
    coach: 'Ronald Koeman', mascot: 'Leo the Lion', style: 'Total Football — fluid positioning and relentless pressing',
    titles: 0, finals: 3, semifinals: 5, bestResult: 'Runners-up (1974, 1978, 2010)',
    facts: ['Inventors of Total Football under Rinus Michels', 'Three-time finalists who have never won the World Cup'],
    players: [],
  },
  {
    id: 'BEL', name: 'Belgium', flag: '🇧🇪', rating: 81, rank: 9, group: 'H',
    coach: 'Domenico Tedesco', mascot: 'Red Devil', style: 'Counter-attacking with elite individual talent',
    titles: 0, finals: 0, semifinals: 2, bestResult: 'Third place (2018)',
    facts: ['Golden generation peaked at #1 FIFA ranking for 4 years', 'Only country where French and Dutch football culture collide'],
    players: [],
  },
  {
    id: 'CRO', name: 'Croatia', flag: '🇭🇷', rating: 83, rank: 10, group: 'H',
    coach: 'Zlatko Dalić', mascot: 'Vatreni', style: 'Midfield-dominant possession with tireless running',
    titles: 0, finals: 1, semifinals: 3, bestResult: 'Runners-up (2018)',
    facts: ['Population of just 4 million — smallest nation to reach a WC final', 'Luka Modrić won the Golden Ball in 2018'],
    players: [],
  },
  {
    id: 'URU', name: 'Uruguay', flag: '🇺🇾', rating: 80, rank: 11, group: 'H',
    coach: 'Marcelo Bielsa', mascot: 'Charrúa', style: 'Garra Charrúa — fighting spirit with tactical discipline',
    titles: 2, finals: 2, semifinals: 5, bestResult: 'Champions (1930, 1950)',
    facts: ['Hosted and won the very first World Cup in 1930', 'The 1950 Maracanazo against Brazil is football\'s greatest upset'],
    players: [],
  },
  {
    id: 'COL', name: 'Colombia', flag: '🇨🇴', rating: 79, rank: 12, group: 'F',
    coach: 'Néstor Lorenzo', mascot: 'El Cóndor', style: 'Creative flair with explosive attacking transitions',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Quarterfinals (2014)',
    facts: ['James Rodríguez won the 2014 Golden Boot with 6 goals', 'Copa América 2024 finalists — rising force in South America'],
    players: [],
  },
  {
    id: 'USA', name: 'United States', flag: '🇺🇸', rating: 76, rank: 13, group: 'A',
    coach: 'Gregg Berhalter', mascot: 'Sam the Eagle', style: 'High-energy pressing with young, fearless talent',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Third place (1930)',
    facts: ['Co-hosting the 2026 World Cup — biggest sporting event in US history', 'Beat England 1-0 in the 1950 WC — one of football\'s great shocks'],
    players: [],
  },
  {
    id: 'MEX', name: 'Mexico', flag: '🇲🇽', rating: 74, rank: 14, group: 'B',
    coach: 'Jaime Lozano', mascot: 'Kin the axolotl', style: 'Technical short-passing game with passionate support',
    titles: 0, finals: 0, semifinals: 2, bestResult: 'Quarterfinals (1970, 1986)',
    facts: ['Have been eliminated in the Round of 16 in seven consecutive World Cups', 'Azteca is the only stadium to host two WC finals'],
    players: [],
  },
  {
    id: 'JPN', name: 'Japan', flag: '🇯🇵', rating: 77, rank: 15, group: 'E',
    coach: 'Hajime Moriyasu', mascot: 'Captain Tsubasa', style: 'Disciplined pressing with rapid combination play',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2022)',
    facts: ['Beat both Germany and Spain in the 2022 group stage', 'Fans clean the stadium after every match — a beloved tradition'],
    players: [],
  },
  {
    id: 'SEN', name: 'Senegal', flag: '🇸🇳', rating: 76, rank: 16, group: 'G',
    coach: 'Aliou Cissé', mascot: 'Teranga Lion', style: 'Physical, fast, and direct with explosive pace up front',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2002)',
    facts: ['Beat France 1-0 in the 2002 WC opener — the biggest upset of the tournament', 'AFCON 2021 champions — first-ever continental title'],
    players: [],
  },
  {
    id: 'SUI', name: 'Switzerland', flag: '🇨🇭', rating: 78, rank: 17, group: 'J',
    coach: 'Murat Yakın', mascot: 'Alpenball', style: 'Organized defensive block with sharp counter-attacks',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Quarterfinals (1934, 1938, 1954, 2024)',
    facts: ['UEFA HQ is in Switzerland — football\'s bureaucratic heartland', 'Eliminated Italy from Euro 2024 with a dominant performance'],
    players: [],
  },
  {
    id: 'MAR', name: 'Morocco', flag: '🇲🇦', rating: 78, rank: 18, group: 'E',
    coach: 'Walid Regragui', mascot: 'Atlas Lion', style: 'Fearless defensive wall with lethal set-pieces',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Fourth place (2022)',
    facts: ['First African and Arab nation to reach a WC semifinal in 2022', 'Conceded just one goal (an own goal) in five knockout matches'],
    players: [],
  },
  {
    id: 'DEN', name: 'Denmark', flag: '🇩🇰', rating: 77, rank: 19, group: '',
    coach: 'Kasper Hjulmand', mascot: 'Viking Warrior', style: 'Compact defensive shape with intelligent pressing triggers',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (1998)',
    facts: ['Won Euro 1992 after being called up as last-minute replacements', 'Christian Eriksen collapsed on pitch at Euro 2020 — returned to play'],
    players: [],
  },
  {
    id: 'AUS', name: 'Australia', flag: '🇦🇺', rating: 71, rank: 20, group: 'K',
    coach: 'Graham Arnold', mascot: 'Socceroo Skippy', style: 'Hard-working defensive structure with aerial threat',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (2022)',
    facts: ['Beat Denmark to reach the 2022 WC knockout rounds for the second time', 'Changed confederation from OFC to AFC in 2006'],
    players: [],
  },
  {
    id: 'KOR', name: 'South Korea', flag: '🇰🇷', rating: 74, rank: 21, group: 'D',
    coach: 'Hong Myung-bo', mascot: 'Red Devil Tiger', style: 'Relentless pressing with explosive pace on the break',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Fourth place (2002)',
    facts: ['Reached the 2002 WC semifinals as co-hosts — beat Spain and Italy', 'Son Heung-min is Asia\'s greatest-ever footballer'],
    players: [],
  },
  {
    id: 'CAN', name: 'Canada', flag: '🇨🇦', rating: 72, rank: 22, group: 'I',
    coach: 'Jesse Marsch', mascot: 'Maple Voyageur', style: 'High-energy pressing with emerging young talent',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1986, 2022)',
    facts: ['Only played in two World Cups before 2026', 'Co-hosting 2026 — first WC matches on Canadian soil since 1986'],
    players: [],
  },
  {
    id: 'NGA', name: 'Nigeria', flag: '🇳🇬', rating: 73, rank: 23, group: 'J',
    coach: 'Finidi George', mascot: 'Super Eagle', style: 'Pace and power with flair in the final third',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (1994, 1998, 2014)',
    facts: ['Won the 1996 Olympic gold medal in football — beat Argentina in the final', 'The Super Eagles have the most iconic kits in WC history'],
    players: [],
  },
  {
    id: 'ECU', name: 'Ecuador', flag: '🇪🇨', rating: 73, rank: 24, group: 'B',
    coach: 'Félix Sánchez', mascot: 'El Cóndor Andino', style: 'Altitude-hardened fitness with direct attacking play',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (2006)',
    facts: ['Home matches in Quito at 2,850m altitude give a massive advantage', 'Énner Valencia scored in every WC match he played'],
    players: [],
  },
  {
    id: 'POL', name: 'Poland', flag: '🇵🇱', rating: 74, rank: 25, group: 'L',
    coach: 'Michał Probierz', mascot: 'White Eagle', style: 'Defensive solidity with Lewandowski as the focal point',
    titles: 0, finals: 0, semifinals: 2, bestResult: 'Third place (1974, 1982)',
    facts: ['Robert Lewandowski is the greatest Polish footballer of all time', 'Finished third in two World Cups but haven\'t won a knockout game since 1982'],
    players: [],
  },
  {
    id: 'SRB', name: 'Serbia', flag: '🇷🇸', rating: 73, rank: 26, group: 'D',
    coach: 'Dragan Stojković', mascot: 'White Eagle', style: 'Technical midfield play with strong physical presence',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Fourth place (1930, 1962 as Yugoslavia)',
    facts: ['Produced some of Europe\'s finest midfielders across generations', 'First WC as independent Serbia was in 2010'],
    players: [],
  },
  {
    id: 'IRN', name: 'Iran', flag: '🇮🇷', rating: 68, rank: 27, group: 'K',
    coach: 'Amir Ghalenoei', mascot: 'Persian Cheetah', style: 'Organized low block with dangerous set-piece routines',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1978, 1998, 2006, 2014, 2018, 2022)',
    facts: ['Asia\'s most successful WC qualifying nation', 'Beat the USA 2-1 in the 1998 World Cup'],
    players: [],
  },
  {
    id: 'GHA', name: 'Ghana', flag: '🇬🇭', rating: 67, rank: 28, group: 'K',
    coach: 'Otto Addo', mascot: 'Black Star', style: 'Energetic pressing with raw pace and physicality',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2010)',
    facts: ['Suárez\'s handball on the line in the 2010 QF is WC\'s most controversial moment', 'Asamoah Gyan missed the resulting penalty — heartbreak for Africa'],
    players: [],
  },
  {
    id: 'CMR', name: 'Cameroon', flag: '🇨🇲', rating: 68, rank: 29, group: 'A',
    coach: 'Rigobert Song', mascot: 'Indomitable Lion', style: 'Athletic and aggressive with never-say-die mentality',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (1990)',
    facts: ['Roger Milla became the oldest WC scorer at 42 years old in 1994', 'Beat Argentina in the 1990 opener — the original giant-killing'],
    players: [],
  },
  {
    id: 'TUN', name: 'Tunisia', flag: '🇹🇳', rating: 66, rank: 30, group: '',
    coach: 'Jalel Kadri', mascot: 'Carthage Eagle', style: 'Compact defensive structure with tactical discipline',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1978, 1998, 2002, 2006, 2018, 2022)',
    facts: ['Beat France in the 2022 WC group stage — first African win over Les Bleus', 'Six WC appearances but never reached the knockout rounds'],
    players: [],
  },
  {
    id: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', rating: 64, rank: 31, group: 'I',
    coach: 'Roberto Mancini', mascot: 'Green Falcon', style: 'Disciplined defensive block with rapid transitions',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (1994)',
    facts: ['Beat Argentina 2-1 in the 2022 WC opener — biggest upset in decades', 'The Saudi league became the world\'s most talked-about in 2023'],
    players: [],
  },
  {
    id: 'CRC', name: 'Costa Rica', flag: '🇨🇷', rating: 63, rank: 32, group: 'G',
    coach: 'Claudio Vivas', mascot: 'Tico Toucan', style: 'Deep defensive block with resilient counter-attacking',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2014)',
    facts: ['Beat Uruguay, Italy and England\'s group in 2014 — the ultimate Cinderella', 'Keylor Navas became a Real Madrid legend after that World Cup run'],
    players: [],
  },
  // ─── Group I–L teams (WC 2026 expansion to 48) ────────────
  {
    id: 'PAR', name: 'Paraguay', flag: '🇵🇾', rating: 70, rank: 33, group: 'H',
    coach: 'Alfaro', mascot: 'Guaraní Warrior', style: 'Physical defensive football with quick counter-attacks',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2010)',
    facts: ['Reached the QF in 2010 — their best ever WC run', 'Famous for producing tough, no-nonsense defenders'],
    players: [],
  },
  {
    id: 'PER', name: 'Peru', flag: '🇵🇪', rating: 69, rank: 34, group: 'C',
    coach: 'Jorge Fossati', mascot: 'Inca Condor', style: 'Energetic pressing with creative midfield play',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (1970, 1978)',
    facts: ['Made a heroic return to the WC in 2018 after 36 years away', 'Their fans are considered among the most passionate in South America'],
    players: [],
  },
  {
    id: 'CHL', name: 'Chile', flag: '🇨🇱', rating: 72, rank: 35, group: 'C',
    coach: 'Ricardo Gareca', mascot: 'El Cóndor', style: 'High-intensity pressing with technical attacking flair',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Third place (1962)',
    facts: ['Won back-to-back Copa Américas in 2015 and 2016', 'Alexis Sánchez is their all-time top scorer'],
    players: [],
  },
  {
    id: 'ALG', name: 'Algeria', flag: '🇩🇿', rating: 68, rank: 36, group: 'A',
    coach: 'Vladimir Petković', mascot: 'Desert Fox', style: 'Physical and direct with pace on the wings',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16 (2014)',
    facts: ['AFCON 2019 champions under Djamel Belmadi', 'Riyad Mahrez led them to their second continental title'],
    players: [],
  },
  {
    id: 'WAL', name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', rating: 66, rank: 37, group: '',
    coach: 'Craig Bellamy', mascot: 'Welsh Dragon', style: 'Compact defensive shape with direct attacking play',
    titles: 0, finals: 0, semifinals: 1, bestResult: 'Quarterfinals (1958)',
    facts: ['Gareth Bale dragged them to the Euro 2016 semi-finals', 'Returned to the WC in 2022 after 64 years away'],
    players: [],
  },
  {
    id: 'JAM', name: 'Jamaica', flag: '🇯🇲', rating: 62, rank: 38, group: '',
    coach: 'Heimir Hallgrímsson', mascot: 'Reggae Boy', style: 'Athletic and direct with raw Caribbean flair',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1998)',
    facts: ['Their 1998 WC squad featured several English-born players', 'The Reggae Boyz are the Caribbean\'s most successful football nation'],
    players: [],
  },
  {
    id: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rating: 67, rank: 39, group: '',
    coach: 'Steve Clarke', mascot: 'Unicorn', style: 'Organized and combative with set-piece threat',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1954, 1958, 1974, 1978, 1982, 1986, 1990, 1998)',
    facts: ['Have never advanced past the WC group stage in 8 appearances', 'One of football\'s oldest national teams, founded in 1872'],
    players: [],
  },
  {
    id: 'UKR', name: 'Ukraine', flag: '🇺🇦', rating: 71, rank: 40, group: 'B',
    coach: 'Serhiy Rebrov', mascot: 'Cossack Eagle', style: 'Disciplined defensive structure with quick transitions',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Quarterfinals (2006)',
    facts: ['Reached the QF in their first-ever WC in 2006', 'Shevchenko is their greatest-ever player — Ballon d\'Or winner'],
    players: [],
  },
  {
    id: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', rating: 63, rank: 41, group: 'L',
    coach: 'Srecko Katanec', mascot: 'Snow Leopard', style: 'Physical and organized with set-piece expertise',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: ['Making their WC debut in 2026 — a historic moment for Central Asian football', 'Server Djeparov was named Asian Player of the Year twice'],
    players: [],
  },
  {
    id: 'EGY', name: 'Egypt', flag: '🇪🇬', rating: 67, rank: 42, group: 'G',
    coach: 'Hossam Hassan', mascot: 'Pharaoh Hawk', style: 'Defensive resilience built around Mohamed Salah',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1934, 1990, 2018)',
    facts: ['Record 7 AFCON titles — the most successful African nation in continental history', 'Mohamed Salah is the most famous African footballer in the world'],
    players: [],
  },
  {
    id: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', rating: 69, rank: 43, group: '',
    coach: 'Emerse Faé', mascot: 'Elephant', style: 'Powerful and athletic with explosive attacking talent',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (2006, 2010, 2014)',
    facts: ['AFCON 2023 champions on home soil — fairy-tale run after nearly being eliminated', 'Drogba\'s generation put Ivorian football on the world map'],
    players: [],
  },
  {
    id: 'IDN', name: 'Indonesia', flag: '🇮🇩', rating: 60, rank: 44, group: 'B',
    coach: 'Shin Tae-yong', mascot: 'Garuda', style: 'Fearless underdog energy with passionate home crowd support',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: ['Making their modern WC debut — first time since competing as Dutch East Indies in 1938', 'A nation of 270 million people finally on football\'s biggest stage'],
    players: [],
  },
  {
    id: 'BOL', name: 'Bolivia', flag: '🇧🇴', rating: 61, rank: 45, group: '',
    coach: 'Óscar Villegas', mascot: 'Andean Condor', style: 'Altitude warriors — physical and relentless at home',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1930, 1950, 1994)',
    facts: ['Play home matches at 3,640m in La Paz — the highest professional stadium in the world', 'Their 1994 WC qualification shocked the continent'],
    players: [],
  },
  {
    id: 'VEN', name: 'Venezuela', flag: '🇻🇪', rating: 65, rank: 46, group: 'I',
    coach: 'Fernando Batista', mascot: 'Vinotinto Eagle', style: 'Technical midfield play with growing tactical maturity',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: ['The last CONMEBOL nation to qualify for a World Cup', 'Known as La Vinotinto — named after their burgundy kits'],
    players: [],
  },
  {
    id: 'NZL', name: 'New Zealand', flag: '🇳🇿', rating: 62, rank: 47, group: 'F',
    coach: 'Darren Bazeley', mascot: 'All White Kiwi', style: 'Resilient defensive structure with set-piece danger',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1982, 2010)',
    facts: ['The only unbeaten team at the 2010 WC — drew all three group matches', 'Chris Wood is their all-time leading scorer'],
    players: [],
  },
  {
    id: 'THA', name: 'Thailand', flag: '🇹🇭', rating: 60, rank: 48, group: '',
    coach: 'Masatada Ishii', mascot: 'War Elephant', style: 'Quick, technical football with Southeast Asian flair',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: ['First-ever World Cup qualification — the biggest achievement in Thai football history', 'Football is by far the most popular sport in the country'],
    players: [],
  },
  {
    id: 'ITA', name: 'Italy', flag: '🇮🇹', rating: 82, rank: 9, group: 'I',
    coach: 'Luciano Spalletti', mascot: 'Azzurri', style: 'Catenaccio evolved — tactical mastery with creative flair',
    titles: 4, finals: 6, semifinals: 8, bestResult: 'Champions (1934,1938,1982,2006)',
    facts: ['Four-time world champions with the most tactical depth in football history', 'Won Euro 2020 under Roberto Mancini with spectacular attacking play'],
    players: [],
  },
  {
    id: 'PAN', name: 'Panama', flag: '🇵🇦', rating: 62, rank: 44, group: 'A',
    coach: 'Thomas Christiansen', mascot: 'Canal Eagle', style: 'Physical and direct with passionate support',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (2018)',
    facts: ['Qualification for 2018 WC was declared a national holiday', 'Román Torres scored the goal that sent them to their first World Cup'],
    players: [],
  },
  {
    id: 'ALB', name: 'Albania', flag: '🇦🇱', rating: 66, rank: 46, group: 'C',
    coach: 'Sylvinho', mascot: 'Eagle', style: 'Compact defensive block with determined counter-attacks',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: ['Making their World Cup debut — historic achievement for Albanian football', 'Euro 2024 participants with a growing football identity'],
    players: [],
  },
  {
    id: 'RSA', name: 'South Africa', flag: '🇿🇦', rating: 63, rank: 50, group: 'J',
    coach: 'Hugo Broos', mascot: 'Bafana Bafana', style: 'Athletic and direct with pace on the wings',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1998, 2002, 2010)',
    facts: ['Hosted the 2010 World Cup — first on African soil', 'AFCON 2024 brought renewed hope to the Rainbow Nation'],
    players: [],
  },
  {
    id: 'GUA', name: 'Guatemala', flag: '🇬🇹', rating: 58, rank: 55, group: 'J',
    coach: 'Luis Fernando Tena', mascot: 'Quetzal', style: 'Compact and resilient with passionate support',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'First appearance',
    facts: ['Making their World Cup debut — a dream realised for Central American football', 'Football is the undisputed national sport'],
    players: [],
  },
  {
    id: 'HON', name: 'Honduras', flag: '🇭🇳', rating: 60, rank: 52, group: 'L',
    coach: 'Reinaldo Rueda', mascot: 'Catrachos', style: 'Physical and direct with set-piece threat',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (2010, 2014)',
    facts: ['Qualified for back-to-back World Cups in 2010 and 2014', 'Central American rivals with fierce passion for football'],
    players: [],
  },
  {
    id: 'CZE', name: 'Czech Republic', flag: '🇨🇿', rating: 68, rank: 40, group: 'K',
    coach: 'Ivan Hašek', mascot: 'Czech Lion', style: 'Tactical discipline with technical midfield play',
    titles: 0, finals: 1, semifinals: 1, bestResult: 'Runners-up (1962 as Czechoslovakia)',
    facts: ['Euro 1996 runners-up with a golden generation', 'Produced legends like Nedvěd, Čech, and Rosický'],
    players: [],
  },
  {
    id: 'COD', name: 'DR Congo', flag: '🇨🇩', rating: 62, rank: 48, group: 'L',
    coach: 'Sébastien Desabre', mascot: 'Leopard', style: 'Athletic and powerful with raw pace',
    titles: 0, finals: 0, semifinals: 0, bestResult: 'Group stage (1974 as Zaire)',
    facts: ['Competed as Zaire in the 1974 World Cup', 'One of Africa\'s most talented football nations by raw ability'],
    players: [],
  },
];

const _TEAM_STATS: Record<string, TeamStats> = {
  BRA: { goalsFor: 8, goalsAgainst: 3, cleanSheets: 2, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 5, setPiece: 1, freeKick: 1, penalty: 1, ownGoal: 0 } },
  FRA: { goalsFor: 7, goalsAgainst: 4, cleanSheets: 1, yellowCards: 7, redCards: 1, goalsByType: { openPlay: 4, setPiece: 1, freeKick: 0, penalty: 2, ownGoal: 0 } },
  ARG: { goalsFor: 9, goalsAgainst: 2, cleanSheets: 3, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 6, setPiece: 2, freeKick: 0, penalty: 1, ownGoal: 0 } },
  ENG: { goalsFor: 6, goalsAgainst: 3, cleanSheets: 2, yellowCards: 3, redCards: 0, goalsByType: { openPlay: 3, setPiece: 2, freeKick: 0, penalty: 1, ownGoal: 0 } },
  ESP: { goalsFor: 10, goalsAgainst: 2, cleanSheets: 3, yellowCards: 2, redCards: 0, goalsByType: { openPlay: 7, setPiece: 2, freeKick: 1, penalty: 0, ownGoal: 0 } },
  GER: { goalsFor: 7, goalsAgainst: 5, cleanSheets: 1, yellowCards: 6, redCards: 0, goalsByType: { openPlay: 4, setPiece: 1, freeKick: 1, penalty: 0, ownGoal: 1 } },
  POR: { goalsFor: 6, goalsAgainst: 3, cleanSheets: 2, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 3, setPiece: 1, freeKick: 1, penalty: 1, ownGoal: 0 } },
  NED: { goalsFor: 5, goalsAgainst: 2, cleanSheets: 2, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 3, setPiece: 1, freeKick: 0, penalty: 1, ownGoal: 0 } },
  BEL: { goalsFor: 4, goalsAgainst: 4, cleanSheets: 1, yellowCards: 6, redCards: 1, goalsByType: { openPlay: 2, setPiece: 1, freeKick: 0, penalty: 1, ownGoal: 0 } },
  CRO: { goalsFor: 5, goalsAgainst: 3, cleanSheets: 1, yellowCards: 7, redCards: 0, goalsByType: { openPlay: 3, setPiece: 1, freeKick: 1, penalty: 0, ownGoal: 0 } },
  URU: { goalsFor: 6, goalsAgainst: 3, cleanSheets: 1, yellowCards: 8, redCards: 1, goalsByType: { openPlay: 4, setPiece: 1, freeKick: 0, penalty: 1, ownGoal: 0 } },
  COL: { goalsFor: 5, goalsAgainst: 2, cleanSheets: 2, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 3, setPiece: 1, freeKick: 1, penalty: 0, ownGoal: 0 } },
  USA: { goalsFor: 4, goalsAgainst: 3, cleanSheets: 1, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 2, setPiece: 1, freeKick: 0, penalty: 1, ownGoal: 0 } },
  MEX: { goalsFor: 5, goalsAgainst: 4, cleanSheets: 1, yellowCards: 6, redCards: 0, goalsByType: { openPlay: 3, setPiece: 1, freeKick: 1, penalty: 0, ownGoal: 0 } },
  JPN: { goalsFor: 6, goalsAgainst: 3, cleanSheets: 1, yellowCards: 3, redCards: 0, goalsByType: { openPlay: 4, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 1 } },
  SEN: { goalsFor: 4, goalsAgainst: 3, cleanSheets: 1, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 3, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  SUI: { goalsFor: 3, goalsAgainst: 2, cleanSheets: 1, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 2, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  MAR: { goalsFor: 5, goalsAgainst: 1, cleanSheets: 3, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 3, setPiece: 2, freeKick: 0, penalty: 0, ownGoal: 0 } },
  DEN: { goalsFor: 3, goalsAgainst: 2, cleanSheets: 1, yellowCards: 3, redCards: 0, goalsByType: { openPlay: 2, setPiece: 0, freeKick: 1, penalty: 0, ownGoal: 0 } },
  AUS: { goalsFor: 2, goalsAgainst: 4, cleanSheets: 0, yellowCards: 6, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  KOR: { goalsFor: 4, goalsAgainst: 3, cleanSheets: 1, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 3, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  CAN: { goalsFor: 2, goalsAgainst: 5, cleanSheets: 0, yellowCards: 7, redCards: 0, goalsByType: { openPlay: 1, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  NGA: { goalsFor: 4, goalsAgainst: 3, cleanSheets: 1, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 3, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  ECU: { goalsFor: 3, goalsAgainst: 3, cleanSheets: 0, yellowCards: 6, redCards: 0, goalsByType: { openPlay: 2, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  POL: { goalsFor: 3, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 2, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  SRB: { goalsFor: 3, goalsAgainst: 4, cleanSheets: 0, yellowCards: 7, redCards: 1, goalsByType: { openPlay: 2, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  IRN: { goalsFor: 2, goalsAgainst: 5, cleanSheets: 0, yellowCards: 6, redCards: 0, goalsByType: { openPlay: 1, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  GHA: { goalsFor: 3, goalsAgainst: 5, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 2, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  CMR: { goalsFor: 4, goalsAgainst: 5, cleanSheets: 0, yellowCards: 5, redCards: 1, goalsByType: { openPlay: 3, setPiece: 0, freeKick: 1, penalty: 0, ownGoal: 0 } },
  TUN: { goalsFor: 2, goalsAgainst: 3, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 1, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  KSA: { goalsFor: 3, goalsAgainst: 5, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 2, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  CRC: { goalsFor: 1, goalsAgainst: 5, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  PAR: { goalsFor: 2, goalsAgainst: 3, cleanSheets: 0, yellowCards: 6, redCards: 0, goalsByType: { openPlay: 1, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  PER: { goalsFor: 2, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  CHL: { goalsFor: 3, goalsAgainst: 3, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 2, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  ALG: { goalsFor: 2, goalsAgainst: 4, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 1, penalty: 0, ownGoal: 0 } },
  WAL: { goalsFor: 1, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  JAM: { goalsFor: 1, goalsAgainst: 6, cleanSheets: 0, yellowCards: 3, redCards: 0, goalsByType: { openPlay: 0, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  SCO: { goalsFor: 2, goalsAgainst: 4, cleanSheets: 0, yellowCards: 6, redCards: 0, goalsByType: { openPlay: 1, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  UKR: { goalsFor: 3, goalsAgainst: 3, cleanSheets: 1, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 2, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  UZB: { goalsFor: 1, goalsAgainst: 5, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  EGY: { goalsFor: 2, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  CIV: { goalsFor: 3, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 1, goalsByType: { openPlay: 2, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  IDN: { goalsFor: 1, goalsAgainst: 7, cleanSheets: 0, yellowCards: 3, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  BOL: { goalsFor: 1, goalsAgainst: 5, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 0, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  VEN: { goalsFor: 2, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 1, penalty: 0, ownGoal: 0 } },
  NZL: { goalsFor: 1, goalsAgainst: 4, cleanSheets: 0, yellowCards: 3, redCards: 0, goalsByType: { openPlay: 0, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  THA: { goalsFor: 1, goalsAgainst: 6, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  ITA: { goalsFor: 5, goalsAgainst: 3, cleanSheets: 2, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 3, setPiece: 1, freeKick: 0, penalty: 1, ownGoal: 0 } },
  PAN: { goalsFor: 1, goalsAgainst: 5, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  ALB: { goalsFor: 1, goalsAgainst: 4, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  RSA: { goalsFor: 2, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  GUA: { goalsFor: 0, goalsAgainst: 6, cleanSheets: 0, yellowCards: 3, redCards: 0, goalsByType: { openPlay: 0, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
  HON: { goalsFor: 1, goalsAgainst: 5, cleanSheets: 0, yellowCards: 4, redCards: 0, goalsByType: { openPlay: 0, setPiece: 1, freeKick: 0, penalty: 0, ownGoal: 0 } },
  CZE: { goalsFor: 3, goalsAgainst: 4, cleanSheets: 0, yellowCards: 5, redCards: 0, goalsByType: { openPlay: 2, setPiece: 0, freeKick: 0, penalty: 1, ownGoal: 0 } },
  COD: { goalsFor: 1, goalsAgainst: 5, cleanSheets: 0, yellowCards: 4, redCards: 1, goalsByType: { openPlay: 1, setPiece: 0, freeKick: 0, penalty: 0, ownGoal: 0 } },
};
TEAMS.forEach(t => { if (_TEAM_STATS[t.id]) t.teamStats = _TEAM_STATS[t.id]; });

const _RANKING_HISTORY: Record<string, { year: number; rank: number }[]> = {
  BRA: [{year:2010,rank:1},{year:2012,rank:5},{year:2014,rank:3},{year:2016,rank:7},{year:2018,rank:2},{year:2020,rank:3},{year:2022,rank:1},{year:2024,rank:4},{year:2026,rank:1}],
  FRA: [{year:2010,rank:9},{year:2012,rank:14},{year:2014,rank:7},{year:2016,rank:6},{year:2018,rank:1},{year:2020,rank:2},{year:2022,rank:2},{year:2024,rank:3},{year:2026,rank:2}],
  ARG: [{year:2010,rank:7},{year:2012,rank:3},{year:2014,rank:1},{year:2016,rank:2},{year:2018,rank:5},{year:2020,rank:8},{year:2022,rank:1},{year:2024,rank:1},{year:2026,rank:3}],
  ENG: [{year:2010,rank:8},{year:2012,rank:6},{year:2014,rank:10},{year:2016,rank:11},{year:2018,rank:4},{year:2020,rank:4},{year:2022,rank:5},{year:2024,rank:5},{year:2026,rank:4}],
  ESP: [{year:2010,rank:1},{year:2012,rank:1},{year:2014,rank:8},{year:2016,rank:6},{year:2018,rank:10},{year:2020,rank:7},{year:2022,rank:6},{year:2024,rank:8},{year:2026,rank:5}],
  GER: [{year:2010,rank:6},{year:2012,rank:2},{year:2014,rank:1},{year:2016,rank:4},{year:2018,rank:15},{year:2020,rank:12},{year:2022,rank:11},{year:2024,rank:16},{year:2026,rank:6}],
  POR: [{year:2010,rank:3},{year:2012,rank:5},{year:2014,rank:4},{year:2016,rank:8},{year:2018,rank:4},{year:2020,rank:5},{year:2022,rank:9},{year:2024,rank:6},{year:2026,rank:7}],
  NED: [{year:2010,rank:3},{year:2012,rank:8},{year:2014,rank:3},{year:2016,rank:16},{year:2018,rank:17},{year:2020,rank:14},{year:2022,rank:8},{year:2024,rank:7},{year:2026,rank:8}],
  BEL: [{year:2010,rank:32},{year:2012,rank:17},{year:2014,rank:5},{year:2016,rank:2},{year:2018,rank:3},{year:2020,rank:1},{year:2022,rank:4},{year:2024,rank:6},{year:2026,rank:9}],
  CRO: [{year:2010,rank:10},{year:2012,rank:9},{year:2014,rank:18},{year:2016,rank:15},{year:2018,rank:4},{year:2020,rank:7},{year:2022,rank:7},{year:2024,rank:10},{year:2026,rank:10}],
  URU: [{year:2010,rank:16},{year:2012,rank:4},{year:2014,rank:6},{year:2016,rank:8},{year:2018,rank:5},{year:2020,rank:6},{year:2022,rank:14},{year:2024,rank:15},{year:2026,rank:11}],
  USA: [{year:2010,rank:14},{year:2012,rank:28},{year:2014,rank:13},{year:2016,rank:24},{year:2018,rank:25},{year:2020,rank:22},{year:2022,rank:16},{year:2024,rank:11},{year:2026,rank:12}],
  MEX: [{year:2010,rank:17},{year:2012,rank:15},{year:2014,rank:19},{year:2016,rank:16},{year:2018,rank:15},{year:2020,rank:11},{year:2022,rank:13},{year:2024,rank:14},{year:2026,rank:13}],
  SEN: [{year:2010,rank:36},{year:2012,rank:34},{year:2014,rank:23},{year:2016,rank:32},{year:2018,rank:27},{year:2020,rank:20},{year:2022,rank:18},{year:2024,rank:17},{year:2026,rank:14}],
  JPN: [{year:2010,rank:45},{year:2012,rank:30},{year:2014,rank:44},{year:2016,rank:53},{year:2018,rank:61},{year:2020,rank:28},{year:2022,rank:20},{year:2024,rank:18},{year:2026,rank:15}],
  KOR: [{year:2010,rank:47},{year:2012,rank:32},{year:2014,rank:56},{year:2016,rank:38},{year:2018,rank:57},{year:2020,rank:40},{year:2022,rank:28},{year:2024,rank:23},{year:2026,rank:16}],
  AUS: [{year:2010,rank:20},{year:2012,rank:62},{year:2014,rank:59},{year:2016,rank:50},{year:2018,rank:40},{year:2020,rank:42},{year:2022,rank:38},{year:2024,rank:24},{year:2026,rank:17}],
  SUI: [{year:2010,rank:18},{year:2012,rank:12},{year:2014,rank:6},{year:2016,rank:15},{year:2018,rank:6},{year:2020,rank:13},{year:2022,rank:15},{year:2024,rank:19},{year:2026,rank:18}],
  COL: [{year:2010,rank:9},{year:2012,rank:4},{year:2014,rank:3},{year:2016,rank:7},{year:2018,rank:16},{year:2020,rank:15},{year:2022,rank:17},{year:2024,rank:12},{year:2026,rank:19}],
  DEN: [{year:2010,rank:26},{year:2012,rank:10},{year:2014,rank:22},{year:2016,rank:37},{year:2018,rank:12},{year:2020,rank:10},{year:2022,rank:10},{year:2024,rank:21},{year:2026,rank:20}],
  MAR: [{year:2010,rank:76},{year:2012,rank:53},{year:2014,rank:66},{year:2016,rank:48},{year:2018,rank:42},{year:2020,rank:35},{year:2022,rank:11},{year:2024,rank:13},{year:2026,rank:21}],
  NGA: [{year:2010,rank:21},{year:2012,rank:33},{year:2014,rank:44},{year:2016,rank:50},{year:2018,rank:47},{year:2020,rank:36},{year:2022,rank:32},{year:2024,rank:28},{year:2026,rank:22}],
  CMR: [{year:2010,rank:11},{year:2012,rank:43},{year:2014,rank:56},{year:2016,rank:33},{year:2018,rank:53},{year:2020,rank:50},{year:2022,rank:38},{year:2024,rank:33},{year:2026,rank:23}],
  GHA: [{year:2010,rank:32},{year:2012,rank:23},{year:2014,rank:37},{year:2016,rank:30},{year:2018,rank:52},{year:2020,rank:46},{year:2022,rank:61},{year:2024,rank:44},{year:2026,rank:24}],
  ECU: [{year:2010,rank:39},{year:2012,rank:25},{year:2014,rank:10},{year:2016,rank:22},{year:2018,rank:62},{year:2020,rank:46},{year:2022,rank:44},{year:2024,rank:31},{year:2026,rank:25}],
  SRB: [{year:2010,rank:15},{year:2012,rank:30},{year:2014,rank:33},{year:2016,rank:49},{year:2018,rank:34},{year:2020,rank:25},{year:2022,rank:21},{year:2024,rank:33},{year:2026,rank:26}],
  POL: [{year:2010,rank:56},{year:2012,rank:46},{year:2014,rank:40},{year:2016,rank:27},{year:2018,rank:10},{year:2020,rank:21},{year:2022,rank:26},{year:2024,rank:28},{year:2026,rank:27}],
  TUN: [{year:2010,rank:29},{year:2012,rank:28},{year:2014,rank:34},{year:2016,rank:19},{year:2018,rank:21},{year:2020,rank:27},{year:2022,rank:30},{year:2024,rank:40},{year:2026,rank:28}],
  CAN: [{year:2010,rank:78},{year:2012,rank:73},{year:2014,rank:110},{year:2016,rank:95},{year:2018,rank:79},{year:2020,rank:73},{year:2022,rank:41},{year:2024,rank:40},{year:2026,rank:29}],
  KSA: [{year:2010,rank:61},{year:2012,rank:108},{year:2014,rank:101},{year:2016,rank:56},{year:2018,rank:67},{year:2020,rank:69},{year:2022,rank:51},{year:2024,rank:56},{year:2026,rank:30}],
  QAT: [{year:2010,rank:113},{year:2012,rank:95},{year:2014,rank:87},{year:2016,rank:81},{year:2018,rank:93},{year:2020,rank:55},{year:2022,rank:50},{year:2024,rank:37},{year:2026,rank:31}],
  CRC: [{year:2010,rank:43},{year:2012,rank:30},{year:2014,rank:13},{year:2016,rank:15},{year:2018,rank:23},{year:2020,rank:44},{year:2022,rank:31},{year:2024,rank:43},{year:2026,rank:32}],
  PAR: [{year:2010,rank:31},{year:2012,rank:14},{year:2014,rank:23},{year:2016,rank:29},{year:2018,rank:32},{year:2020,rank:38},{year:2022,rank:45},{year:2024,rank:50},{year:2026,rank:33}],
  PER: [{year:2010,rank:46},{year:2012,rank:24},{year:2014,rank:30},{year:2016,rank:18},{year:2018,rank:11},{year:2020,rank:21},{year:2022,rank:22},{year:2024,rank:32},{year:2026,rank:34}],
  CHL: [{year:2010,rank:18},{year:2012,rank:9},{year:2014,rank:12},{year:2016,rank:5},{year:2018,rank:9},{year:2020,rank:17},{year:2022,rank:29},{year:2024,rank:39},{year:2026,rank:35}],
  ALG: [{year:2010,rank:30},{year:2012,rank:32},{year:2014,rank:22},{year:2016,rank:33},{year:2018,rank:66},{year:2020,rank:35},{year:2022,rank:35},{year:2024,rank:41},{year:2026,rank:36}],
  WAL: [{year:2010,rank:68},{year:2012,rank:45},{year:2014,rank:22},{year:2016,rank:11},{year:2018,rank:19},{year:2020,rank:17},{year:2022,rank:19},{year:2024,rank:31},{year:2026,rank:37}],
  JAM: [{year:2010,rank:55},{year:2012,rank:60},{year:2014,rank:69},{year:2016,rank:51},{year:2018,rank:59},{year:2020,rank:45},{year:2022,rank:60},{year:2024,rank:52},{year:2026,rank:38}],
  SCO: [{year:2010,rank:26},{year:2012,rank:50},{year:2014,rank:29},{year:2016,rank:40},{year:2018,rank:33},{year:2020,rank:44},{year:2022,rank:39},{year:2024,rank:38},{year:2026,rank:39}],
  UKR: [{year:2010,rank:19},{year:2012,rank:27},{year:2014,rank:18},{year:2016,rank:19},{year:2018,rank:35},{year:2020,rank:24},{year:2022,rank:27},{year:2024,rank:22},{year:2026,rank:40}],
  UZB: [{year:2010,rank:66},{year:2012,rank:62},{year:2014,rank:70},{year:2016,rank:62},{year:2018,rank:67},{year:2020,rank:82},{year:2022,rank:77},{year:2024,rank:61},{year:2026,rank:41}],
  EGY: [{year:2010,rank:10},{year:2012,rank:31},{year:2014,rank:37},{year:2016,rank:51},{year:2018,rank:46},{year:2020,rank:49},{year:2022,rank:33},{year:2024,rank:36},{year:2026,rank:42}],
  CIV: [{year:2010,rank:27},{year:2012,rank:17},{year:2014,rank:21},{year:2016,rank:40},{year:2018,rank:68},{year:2020,rank:51},{year:2022,rank:56},{year:2024,rank:39},{year:2026,rank:43}],
  IDN: [{year:2010,rank:140},{year:2012,rank:155},{year:2014,rank:159},{year:2016,rank:174},{year:2018,rank:164},{year:2020,rank:173},{year:2022,rank:155},{year:2024,rank:134},{year:2026,rank:44}],
  BOL: [{year:2010,rank:75},{year:2012,rank:55},{year:2014,rank:47},{year:2016,rank:62},{year:2018,rank:72},{year:2020,rank:77},{year:2022,rank:76},{year:2024,rank:85},{year:2026,rank:45}],
  VEN: [{year:2010,rank:69},{year:2012,rank:58},{year:2014,rank:42},{year:2016,rank:63},{year:2018,rank:33},{year:2020,rank:30},{year:2022,rank:55},{year:2024,rank:53},{year:2026,rank:46}],
  NZL: [{year:2010,rank:78},{year:2012,rank:79},{year:2014,rank:88},{year:2016,rank:122},{year:2018,rank:122},{year:2020,rank:109},{year:2022,rank:101},{year:2024,rank:94},{year:2026,rank:47}],
  THA: [{year:2010,rank:119},{year:2012,rank:132},{year:2014,rank:126},{year:2016,rank:121},{year:2018,rank:122},{year:2020,rank:106},{year:2022,rank:111},{year:2024,rank:101},{year:2026,rank:48}],
  ITA: [{year:2010,rank:5},{year:2012,rank:8},{year:2014,rank:9},{year:2016,rank:12},{year:2018,rank:14},{year:2020,rank:7},{year:2022,rank:6},{year:2024,rank:9},{year:2026,rank:9}],
  PAN: [{year:2010,rank:85},{year:2012,rank:65},{year:2014,rank:58},{year:2016,rank:52},{year:2018,rank:55},{year:2020,rank:72},{year:2022,rank:68},{year:2024,rank:60},{year:2026,rank:44}],
  ALB: [{year:2010,rank:71},{year:2012,rank:60},{year:2014,rank:55},{year:2016,rank:42},{year:2018,rank:52},{year:2020,rank:66},{year:2022,rank:62},{year:2024,rank:50},{year:2026,rank:46}],
  RSA: [{year:2010,rank:83},{year:2012,rank:74},{year:2014,rank:56},{year:2016,rank:48},{year:2018,rank:72},{year:2020,rank:71},{year:2022,rank:68},{year:2024,rank:55},{year:2026,rank:50}],
  GUA: [{year:2010,rank:100},{year:2012,rank:88},{year:2014,rank:95},{year:2016,rank:85},{year:2018,rank:90},{year:2020,rank:82},{year:2022,rank:80},{year:2024,rank:72},{year:2026,rank:55}],
  HON: [{year:2010,rank:38},{year:2012,rank:40},{year:2014,rank:33},{year:2016,rank:45},{year:2018,rank:59},{year:2020,rank:67},{year:2022,rank:73},{year:2024,rank:62},{year:2026,rank:52}],
  CZE: [{year:2010,rank:15},{year:2012,rank:12},{year:2014,rank:18},{year:2016,rank:22},{year:2018,rank:38},{year:2020,rank:42},{year:2022,rank:32},{year:2024,rank:36},{year:2026,rank:40}],
  COD: [{year:2010,rank:52},{year:2012,rank:54},{year:2014,rank:50},{year:2016,rank:44},{year:2018,rank:48},{year:2020,rank:55},{year:2022,rank:58},{year:2024,rank:52},{year:2026,rank:48}],
};
TEAMS.forEach(t => { if (_RANKING_HISTORY[t.id]) t.rankingHistory = _RANKING_HISTORY[t.id]; });

const _SQUADS: Record<string, SquadList> = {
  BRA: {
    gk: [
      { id: 'bra-gk-1', name: 'Alisson Becker', number: 1, club: 'Liverpool', age: 33, apiId: 280 },
      { id: 'bra-gk-2', name: 'Ederson', number: 23, club: 'Manchester City', age: 32, apiId: 2613 },
      { id: 'bra-gk-3', name: 'Bento', number: 12, club: 'Al-Nassr', age: 25, apiId: 196986 },
    ],
    def: [
      { id: 'bra-def-1', name: 'Danilo', number: 2, club: 'Juventus', age: 34, apiId: 2614 },
      { id: 'bra-def-2', name: 'Éder Militão', number: 3, club: 'Real Madrid', age: 28, apiId: 6747 },
      { id: 'bra-def-3', name: 'Marquinhos', number: 4, club: 'PSG', age: 32, apiId: 201 },
      { id: 'bra-def-4', name: 'Gabriel Magalhães', number: 6, club: 'Arsenal', age: 28, apiId: 10012 },
      { id: 'bra-def-5', name: 'Wendell', number: 13, club: 'Porto', age: 33, apiId: 6751 },
      { id: 'bra-def-6', name: 'Abner Vinícius', number: 16, club: 'Marseille', age: 26, apiId: 9700 },
      { id: 'bra-def-7', name: 'Yan Couto', number: 14, club: 'Borussia Dortmund', age: 24, apiId: 196985 },
    ],
    mid: [
      { id: 'bra-mid-1', name: 'Lucas Paquetá', number: 8, club: 'West Ham', age: 28, apiId: 10003 },
      { id: 'bra-mid-2', name: 'Gerson', number: 5, club: 'Flamengo', age: 29, apiId: 10090 },
      { id: 'bra-mid-3', name: 'Bruno Guimarães', number: 17, club: 'Newcastle', age: 28, apiId: 10010 },
      { id: 'bra-mid-4', name: 'André', number: 18, club: 'Wolverhampton', age: 23, apiId: 283142 },
      { id: 'bra-mid-5', name: 'Casemiro', number: 15, club: 'Manchester United', age: 34, apiId: 2611 },
    ],
    fwd: [
      { id: 'bra-fwd-1', name: 'Vinícius Jr', number: 7, club: 'Real Madrid', age: 25, apiId: 762 },
      { id: 'bra-fwd-2', name: 'Rodrygo', number: 11, club: 'Real Madrid', age: 25, apiId: 10009 },
      { id: 'bra-fwd-3', name: 'Raphinha', number: 19, club: 'Barcelona', age: 29, apiId: 16370 },
      { id: 'bra-fwd-4', name: 'Savinho', number: 20, club: 'Manchester City', age: 22, apiId: 407100 },
      { id: 'bra-fwd-5', name: 'Endrick', number: 9, club: 'Real Madrid', age: 19, apiId: 401695 },
      { id: 'bra-fwd-6', name: 'Pedro', number: 21, club: 'Flamengo', age: 28, apiId: 10024 },
      { id: 'bra-fwd-7', name: 'Igor Jesus', number: 22, club: 'Botafogo', age: 25, apiId: 365990 },
      { id: 'bra-fwd-8', name: 'Gabriel Martinelli', number: 10, club: 'Arsenal', age: 25, apiId: 162064 },
      { id: 'bra-fwd-9', name: 'Matheus Cunha', number: 24, club: 'Wolverhampton', age: 27, apiId: 47375 },
    ],
  },
  FRA: {
    gk: [
      { id: 'fra-gk-1', name: 'Mike Maignan', number: 16, club: 'AC Milan', age: 31, apiId: 47324 },
      { id: 'fra-gk-2', name: 'Brice Samba', number: 23, club: 'Lens', age: 30 },
      { id: 'fra-gk-3', name: 'Lucas Chevalier', number: 1, club: 'Lille', age: 22 },
    ],
    def: [
      { id: 'fra-def-1', name: 'Theo Hernández', number: 22, club: 'AC Milan', age: 28, apiId: 2938 },
      { id: 'fra-def-2', name: 'Dayot Upamecano', number: 4, club: 'Bayern Munich', age: 27, apiId: 20502 },
      { id: 'fra-def-3', name: 'William Saliba', number: 2, club: 'Arsenal', age: 25, apiId: 152998 },
      { id: 'fra-def-4', name: 'Jules Koundé', number: 5, club: 'Barcelona', age: 27, apiId: 22243 },
      { id: 'fra-def-5', name: 'Ibrahima Konaté', number: 13, club: 'Liverpool', age: 27, apiId: 131 },
      { id: 'fra-def-6', name: 'Jonathan Clauss', number: 25, club: 'Nice', age: 31 },
      { id: 'fra-def-7', name: 'Wesley Fofana', number: 3, club: 'Chelsea', age: 25 },
    ],
    mid: [
      { id: 'fra-mid-1', name: 'Aurélien Tchouaméni', number: 8, club: 'Real Madrid', age: 26, apiId: 95270 },
      { id: 'fra-mid-2', name: 'Eduardo Camavinga', number: 6, club: 'Real Madrid', age: 23, apiId: 162064 },
      { id: 'fra-mid-3', name: 'N\'Golo Kanté', number: 14, club: 'Al-Ittihad', age: 35 },
      { id: 'fra-mid-4', name: 'Youssouf Fofana', number: 19, club: 'AC Milan', age: 25 },
      { id: 'fra-mid-5', name: 'Warren Zaïre-Emery', number: 18, club: 'PSG', age: 20 },
    ],
    fwd: [
      { id: 'fra-fwd-1', name: 'Kylian Mbappé', number: 10, club: 'Real Madrid', age: 27, apiId: 278 },
      { id: 'fra-fwd-2', name: 'Antoine Griezmann', number: 7, club: 'Atlético Madrid', age: 35, apiId: 1465 },
      { id: 'fra-fwd-3', name: 'Ousmane Dembélé', number: 11, club: 'PSG', age: 29, apiId: 636 },
      { id: 'fra-fwd-4', name: 'Randal Kolo Muani', number: 9, club: 'PSG', age: 27 },
      { id: 'fra-fwd-5', name: 'Bradley Barcola', number: 20, club: 'PSG', age: 22 },
      { id: 'fra-fwd-6', name: 'Marcus Thuram', number: 15, club: 'Inter Milan', age: 28 },
    ],
  },
  ARG: {
    gk: [
      { id: 'arg-gk-1', name: 'Emiliano Martínez', number: 23, club: 'Aston Villa', age: 33, apiId: 19599 },
      { id: 'arg-gk-2', name: 'Franco Armani', number: 1, club: 'River Plate', age: 39 },
      { id: 'arg-gk-3', name: 'Gerónimo Rulli', number: 12, club: 'Atlético Madrid', age: 34 },
    ],
    def: [
      { id: 'arg-def-1', name: 'Cristian Romero', number: 13, club: 'Tottenham', age: 28 },
      { id: 'arg-def-2', name: 'Nicolás Otamendi', number: 19, club: 'Benfica', age: 38 },
      { id: 'arg-def-3', name: 'Lisandro Martínez', number: 6, club: 'Manchester United', age: 28 },
      { id: 'arg-def-4', name: 'Nahuel Molina', number: 2, club: 'Atlético Madrid', age: 28 },
      { id: 'arg-def-5', name: 'Nicolás Tagliafico', number: 3, club: 'Lyon', age: 33 },
      { id: 'arg-def-6', name: 'Gonzalo Montiel', number: 4, club: 'Sevilla', age: 29 },
    ],
    mid: [
      { id: 'arg-mid-1', name: 'Alexis Mac Allister', number: 20, club: 'Liverpool', age: 27, apiId: 6716 },
      { id: 'arg-mid-2', name: 'Enzo Fernández', number: 24, club: 'Chelsea', age: 25 },
      { id: 'arg-mid-3', name: 'Rodrigo De Paul', number: 7, club: 'Atlético Madrid', age: 32 },
      { id: 'arg-mid-4', name: 'Leandro Paredes', number: 5, club: 'Roma', age: 32 },
      { id: 'arg-mid-5', name: 'Giovani Lo Celso', number: 18, club: 'Betis', age: 30 },
      { id: 'arg-mid-6', name: 'Exequiel Palacios', number: 14, club: 'Bayer Leverkusen', age: 26 },
    ],
    fwd: [
      { id: 'arg-fwd-1', name: 'Lionel Messi', number: 10, club: 'Inter Miami', age: 38, apiId: 154 },
      { id: 'arg-fwd-2', name: 'Julián Álvarez', number: 9, club: 'Atlético Madrid', age: 26, apiId: 6009 },
      { id: 'arg-fwd-3', name: 'Lautaro Martínez', number: 22, club: 'Inter Milan', age: 28 },
      { id: 'arg-fwd-4', name: 'Ángel Di María', number: 11, club: 'Benfica', age: 38 },
      { id: 'arg-fwd-5', name: 'Paulo Dybala', number: 21, club: 'Roma', age: 32 },
    ],
  },
  ENG: {
    gk: [
      { id: 'eng-gk-1', name: 'Jordan Pickford', number: 1, club: 'Everton', age: 32, apiId: 2932 },
      { id: 'eng-gk-2', name: 'Aaron Ramsdale', number: 23, club: 'Southampton', age: 28 },
      { id: 'eng-gk-3', name: 'Dean Henderson', number: 13, club: 'Crystal Palace', age: 29 },
    ],
    def: [
      { id: 'eng-def-1', name: 'John Stones', number: 5, club: 'Manchester City', age: 32 },
      { id: 'eng-def-2', name: 'Kyle Walker', number: 2, club: 'Manchester City', age: 36 },
      { id: 'eng-def-3', name: 'Marc Guéhi', number: 6, club: 'Crystal Palace', age: 26 },
      { id: 'eng-def-4', name: 'Trent Alexander-Arnold', number: 18, club: 'Real Madrid', age: 27, apiId: 1463 },
      { id: 'eng-def-5', name: 'Luke Shaw', number: 3, club: 'Manchester United', age: 30 },
      { id: 'eng-def-6', name: 'Levi Colwill', number: 15, club: 'Chelsea', age: 23 },
    ],
    mid: [
      { id: 'eng-mid-1', name: 'Jude Bellingham', number: 10, club: 'Real Madrid', age: 22, apiId: 129718 },
      { id: 'eng-mid-2', name: 'Declan Rice', number: 4, club: 'Arsenal', age: 27, apiId: 2937 },
      { id: 'eng-mid-3', name: 'Phil Foden', number: 20, club: 'Manchester City', age: 26, apiId: 129718 },
      { id: 'eng-mid-4', name: 'Kobbie Mainoo', number: 8, club: 'Manchester United', age: 21 },
      { id: 'eng-mid-5', name: 'Conor Gallagher', number: 14, club: 'Atlético Madrid', age: 26 },
    ],
    fwd: [
      { id: 'eng-fwd-1', name: 'Harry Kane', number: 9, club: 'Bayern Munich', age: 32, apiId: 2938 },
      { id: 'eng-fwd-2', name: 'Bukayo Saka', number: 7, club: 'Arsenal', age: 24, apiId: 1460 },
      { id: 'eng-fwd-3', name: 'Cole Palmer', number: 11, club: 'Chelsea', age: 24 },
      { id: 'eng-fwd-4', name: 'Anthony Gordon', number: 17, club: 'Newcastle', age: 25 },
      { id: 'eng-fwd-5', name: 'Ollie Watkins', number: 19, club: 'Aston Villa', age: 30 },
      { id: 'eng-fwd-6', name: 'Eberechi Eze', number: 21, club: 'Crystal Palace', age: 28 },
    ],
  },
  ESP: {
    gk: [
      { id: 'esp-gk-1', name: 'Unai Simón', number: 23, club: 'Athletic Bilbao', age: 29 },
      { id: 'esp-gk-2', name: 'David Raya', number: 13, club: 'Arsenal', age: 30 },
      { id: 'esp-gk-3', name: 'Robert Sánchez', number: 1, club: 'Chelsea', age: 28 },
    ],
    def: [
      { id: 'esp-def-1', name: 'Dani Carvajal', number: 2, club: 'Real Madrid', age: 34 },
      { id: 'esp-def-2', name: 'Aymeric Laporte', number: 4, club: 'Al-Nassr', age: 32 },
      { id: 'esp-def-3', name: 'Robin Le Normand', number: 24, club: 'Atlético Madrid', age: 29 },
      { id: 'esp-def-4', name: 'Marc Cucurella', number: 3, club: 'Chelsea', age: 28 },
      { id: 'esp-def-5', name: 'Pau Cubarsí', number: 5, club: 'Barcelona', age: 19 },
      { id: 'esp-def-6', name: 'Alejandro Grimaldo', number: 14, club: 'Bayer Leverkusen', age: 30 },
    ],
    mid: [
      { id: 'esp-mid-1', name: 'Rodri', number: 16, club: 'Manchester City', age: 30, apiId: 44 },
      { id: 'esp-mid-2', name: 'Pedri', number: 8, club: 'Barcelona', age: 23, apiId: 133609 },
      { id: 'esp-mid-3', name: 'Gavi', number: 6, club: 'Barcelona', age: 21 },
      { id: 'esp-mid-4', name: 'Fabián Ruiz', number: 19, club: 'PSG', age: 30 },
      { id: 'esp-mid-5', name: 'Dani Olmo', number: 10, club: 'Barcelona', age: 28 },
    ],
    fwd: [
      { id: 'esp-fwd-1', name: 'Lamine Yamal', number: 11, club: 'Barcelona', age: 18, apiId: 386828 },
      { id: 'esp-fwd-2', name: 'Nico Williams', number: 7, club: 'Athletic Bilbao', age: 24 },
      { id: 'esp-fwd-3', name: 'Álvaro Morata', number: 9, club: 'AC Milan', age: 33 },
      { id: 'esp-fwd-4', name: 'Mikel Oyarzabal', number: 21, club: 'Real Sociedad', age: 29 },
      { id: 'esp-fwd-5', name: 'Ferran Torres', number: 17, club: 'Barcelona', age: 26 },
      { id: 'esp-fwd-6', name: 'Ayoze Pérez', number: 18, club: 'Villarreal', age: 33 },
    ],
  },
  GER: {
    gk: [
      { id: 'ger-gk-1', name: 'Manuel Neuer', number: 1, club: 'Bayern Munich', age: 40 },
      { id: 'ger-gk-2', name: 'Marc-André ter Stegen', number: 22, club: 'Barcelona', age: 34 },
      { id: 'ger-gk-3', name: 'Oliver Baumann', number: 12, club: 'Hoffenheim', age: 34 },
    ],
    def: [
      { id: 'ger-def-1', name: 'Antonio Rüdiger', number: 2, club: 'Real Madrid', age: 33, apiId: 2285 },
      { id: 'ger-def-2', name: 'Jonathan Tah', number: 4, club: 'Bayer Leverkusen', age: 30 },
      { id: 'ger-def-3', name: 'Nico Schlotterbeck', number: 5, club: 'Borussia Dortmund', age: 26 },
      { id: 'ger-def-4', name: 'Joshua Kimmich', number: 6, club: 'Bayern Munich', age: 31 },
      { id: 'ger-def-5', name: 'David Raum', number: 3, club: 'RB Leipzig', age: 28 },
      { id: 'ger-def-6', name: 'Benjamin Henrichs', number: 13, club: 'RB Leipzig', age: 29 },
    ],
    mid: [
      { id: 'ger-mid-1', name: 'Jamal Musiala', number: 10, club: 'Bayern Munich', age: 23, apiId: 181812 },
      { id: 'ger-mid-2', name: 'Florian Wirtz', number: 17, club: 'Bayer Leverkusen', age: 23 },
      { id: 'ger-mid-3', name: 'İlkay Gündoğan', number: 8, club: 'Barcelona', age: 35 },
      { id: 'ger-mid-4', name: 'Robert Andrich', number: 14, club: 'Bayer Leverkusen', age: 30 },
      { id: 'ger-mid-5', name: 'Chris Führich', number: 18, club: 'Stuttgart', age: 28 },
    ],
    fwd: [
      { id: 'ger-fwd-1', name: 'Leroy Sané', number: 19, club: 'Bayern Munich', age: 30, apiId: 644 },
      { id: 'ger-fwd-2', name: 'Kai Havertz', number: 7, club: 'Arsenal', age: 27 },
      { id: 'ger-fwd-3', name: 'Serge Gnabry', number: 9, club: 'Bayern Munich', age: 30 },
      { id: 'ger-fwd-4', name: 'Niclas Füllkrug', number: 11, club: 'West Ham', age: 33 },
      { id: 'ger-fwd-5', name: 'Deniz Undav', number: 15, club: 'Stuttgart', age: 30 },
      { id: 'ger-fwd-6', name: 'Maximilian Beier', number: 20, club: 'Borussia Dortmund', age: 23 },
    ],
  },
  POR: {
    gk: [
      { id: 'por-gk-1', name: 'Diogo Costa', number: 1, club: 'Porto', age: 26 },
      { id: 'por-gk-2', name: 'Rui Patrício', number: 12, club: 'Roma', age: 38 },
      { id: 'por-gk-3', name: 'José Sá', number: 22, club: 'Wolverhampton', age: 33 },
    ],
    def: [
      { id: 'por-def-1', name: 'Rúben Dias', number: 4, club: 'Manchester City', age: 29, apiId: 567 },
      { id: 'por-def-2', name: 'Pepe', number: 3, club: 'Retired legend', age: 43 },
      { id: 'por-def-3', name: 'Nuno Mendes', number: 19, club: 'PSG', age: 24 },
      { id: 'por-def-4', name: 'João Cancelo', number: 20, club: 'Al-Hilal', age: 32 },
      { id: 'por-def-5', name: 'António Silva', number: 24, club: 'Benfica', age: 22 },
      { id: 'por-def-6', name: 'Diogo Dalot', number: 2, club: 'Manchester United', age: 27 },
    ],
    mid: [
      { id: 'por-mid-1', name: 'Bernardo Silva', number: 10, club: 'Manchester City', age: 31, apiId: 636 },
      { id: 'por-mid-2', name: 'Bruno Fernandes', number: 8, club: 'Manchester United', age: 31 },
      { id: 'por-mid-3', name: 'Vitinha', number: 16, club: 'PSG', age: 26 },
      { id: 'por-mid-4', name: 'João Palhinha', number: 6, club: 'Bayern Munich', age: 31 },
      { id: 'por-mid-5', name: 'Otávio', number: 14, club: 'Al-Nassr', age: 31 },
    ],
    fwd: [
      { id: 'por-fwd-1', name: 'Cristiano Ronaldo', number: 7, club: 'Al-Nassr', age: 41, apiId: 874 },
      { id: 'por-fwd-2', name: 'Rafael Leão', number: 17, club: 'AC Milan', age: 27 },
      { id: 'por-fwd-3', name: 'Gonçalo Ramos', number: 9, club: 'PSG', age: 25 },
      { id: 'por-fwd-4', name: 'Pedro Neto', number: 11, club: 'Chelsea', age: 26 },
      { id: 'por-fwd-5', name: 'Francisco Conceição', number: 21, club: 'Juventus', age: 23 },
      { id: 'por-fwd-6', name: 'Diogo Jota', number: 18, club: 'Liverpool', age: 29 },
    ],
  },
  NED: {
    gk: [
      { id: 'ned-gk-1', name: 'Bart Verbruggen', number: 13, club: 'Brighton', age: 24 },
      { id: 'ned-gk-2', name: 'Mark Flekken', number: 23, club: 'Brentford', age: 32 },
      { id: 'ned-gk-3', name: 'Justin Bijlow', number: 1, club: 'Feyenoord', age: 28 },
    ],
    def: [
      { id: 'ned-def-1', name: 'Virgil van Dijk', number: 4, club: 'Liverpool', age: 34, apiId: 290 },
      { id: 'ned-def-2', name: 'Nathan Aké', number: 5, club: 'Manchester City', age: 31 },
      { id: 'ned-def-3', name: 'Denzel Dumfries', number: 2, club: 'Inter Milan', age: 30 },
      { id: 'ned-def-4', name: 'Matthijs de Ligt', number: 3, club: 'Manchester United', age: 26 },
      { id: 'ned-def-5', name: 'Jurriën Timber', number: 6, club: 'Arsenal', age: 25 },
      { id: 'ned-def-6', name: 'Ian Maatsen', number: 14, club: 'Aston Villa', age: 24 },
    ],
    mid: [
      { id: 'ned-mid-1', name: 'Frenkie de Jong', number: 21, club: 'Barcelona', age: 29, apiId: 538 },
      { id: 'ned-mid-2', name: 'Teun Koopmeiners', number: 8, club: 'Juventus', age: 28 },
      { id: 'ned-mid-3', name: 'Ryan Gravenberch', number: 16, club: 'Liverpool', age: 24 },
      { id: 'ned-mid-4', name: 'Jerdy Schouten', number: 18, club: 'PSV', age: 29 },
      { id: 'ned-mid-5', name: 'Xavi Simons', number: 10, club: 'RB Leipzig', age: 23 },
    ],
    fwd: [
      { id: 'ned-fwd-1', name: 'Cody Gakpo', number: 11, club: 'Liverpool', age: 27, apiId: 247 },
      { id: 'ned-fwd-2', name: 'Memphis Depay', number: 9, club: 'Corinthians', age: 32 },
      { id: 'ned-fwd-3', name: 'Donyell Malen', number: 17, club: 'Aston Villa', age: 27 },
      { id: 'ned-fwd-4', name: 'Steven Bergwijn', number: 7, club: 'Ajax', age: 28 },
      { id: 'ned-fwd-5', name: 'Wout Weghorst', number: 19, club: 'Ajax', age: 33 },
      { id: 'ned-fwd-6', name: 'Brian Brobbey', number: 15, club: 'Ajax', age: 24 },
    ],
  },
  BEL: {
    gk: [
      { id: 'bel-gk-1', name: 'Thibaut Courtois', number: 1, club: 'Real Madrid', age: 34 },
      { id: 'bel-gk-2', name: 'Koen Casteels', number: 13, club: 'Al-Qadsiah', age: 34 },
      { id: 'bel-gk-3', name: 'Matz Sels', number: 12, club: 'Nottingham Forest', age: 32 },
    ],
    def: [
      { id: 'bel-def-1', name: 'Jan Vertonghen', number: 5, club: 'Anderlecht', age: 39 },
      { id: 'bel-def-2', name: 'Timothy Castagne', number: 21, club: 'Fulham', age: 30 },
      { id: 'bel-def-3', name: 'Arthur Theate', number: 3, club: 'Rennes', age: 26 },
      { id: 'bel-def-4', name: 'Wout Faes', number: 4, club: 'Leicester', age: 26 },
      { id: 'bel-def-5', name: 'Thomas Meunier', number: 15, club: 'Trabzonspor', age: 34 },
      { id: 'bel-def-6', name: 'Zeno Debast', number: 2, club: 'Sporting', age: 22 },
    ],
    mid: [
      { id: 'bel-mid-1', name: 'Kevin De Bruyne', number: 7, club: 'Manchester City', age: 34, apiId: 629 },
      { id: 'bel-mid-2', name: 'Amadou Onana', number: 8, club: 'Aston Villa', age: 24 },
      { id: 'bel-mid-3', name: 'Youri Tielemans', number: 6, club: 'Aston Villa', age: 29 },
      { id: 'bel-mid-4', name: 'Aster Vranckx', number: 14, club: 'Wolfsburg', age: 23 },
      { id: 'bel-mid-5', name: 'Orel Mangala', number: 18, club: 'Everton', age: 26 },
    ],
    fwd: [
      { id: 'bel-fwd-1', name: 'Romelu Lukaku', number: 9, club: 'Napoli', age: 33, apiId: 907 },
      { id: 'bel-fwd-2', name: 'Jérémy Doku', number: 11, club: 'Manchester City', age: 24 },
      { id: 'bel-fwd-3', name: 'Leandro Trossard', number: 10, club: 'Arsenal', age: 31 },
      { id: 'bel-fwd-4', name: 'Loïs Openda', number: 17, club: 'RB Leipzig', age: 26 },
      { id: 'bel-fwd-5', name: 'Johan Bakayoko', number: 20, club: 'PSV', age: 23 },
      { id: 'bel-fwd-6', name: 'Charles De Ketelaere', number: 22, club: 'Atalanta', age: 25 },
    ],
  },
};
TEAMS.forEach(t => { if (_SQUADS[t.id]) t.squads = _SQUADS[t.id]; });

const P = (id: string, apiId: number, name: string, flag: string, team: string, teamId: string, pos: string, ovr: number,
  pac: number, sho: number, pas: number, dri: number, def: number, phy: number,
  form: ('W'|'D'|'L')[], goals: number, assists: number, rating: number, matches: number,
  atk: number, mid: number, hDef: number, wid: number, bio: string,
  xG?: number, passAcc?: number): Player => ({
  id, apiId, name, flag, team, teamId, pos, ovr,
  photoUrl: `https://media.api-sports.io/football/players/${apiId}.png`,
  attrs: { PAC: pac, SHO: sho, PAS: pas, DRI: dri, DEF: def, PHY: phy },
  form, wcStats: { goals, assists, rating, matches, xG, passAccuracy: passAcc },
  heatmap: { ATK: atk, MID: mid, DEF: hDef, WID: wid }, bio,
});

export const PLAYERS: Player[] = [
  // ─── Brazil ────────────────────────────────────────────
  P('vinicius', 762, 'Vinicius Jr', '🇧🇷', 'Brazil', 'BRA', 'LW', 92, 97, 87, 82, 95, 28, 74, ['W','W','W','D','W'], 4, 3, 9.1, 5, 92, 45, 12, 88, 'Real Madrid superstar. The tournament\'s most electric presence. Unstoppable on the left wing.', 3.8, 86),
  P('alisson', 280, 'Alisson Becker', '🇧🇷', 'Brazil', 'BRA', 'GK', 89, 50, 12, 55, 18, 90, 82, ['W','W','D','W','W'], 0, 0, 7.8, 5, 2, 5, 95, 5, 'The Wall of Anfield. Distribution as good as his shot-stopping. Brazil\'s last line and first playmaker.', undefined, 88),
  P('marquinhos', 201, 'Marquinhos', '🇧🇷', 'Brazil', 'BRA', 'CB', 87, 68, 42, 72, 65, 88, 82, ['W','W','W','W','D'], 0, 0, 7.5, 5, 8, 30, 92, 20, 'PSG captain who reads the game three passes ahead. Brazil\'s defensive heartbeat.', undefined, 84),
  P('rodrygo', 10009, 'Rodrygo', '🇧🇷', 'Brazil', 'BRA', 'RW', 86, 90, 81, 80, 87, 30, 72, ['W','D','W','W','W'], 2, 2, 8.2, 5, 85, 50, 10, 90, 'Big-game DNA. Scored two goals in 90 seconds to send Real Madrid to the 2022 CL final.', 1.9, 85),

  // ─── France ────────────────────────────────────────────
  P('mbappe', 278, 'Kylian Mbappé', '🇫🇷', 'France', 'FRA', 'ST', 91, 98, 90, 80, 93, 36, 78, ['W','D','W','W','W'], 5, 2, 8.9, 5, 95, 55, 8, 72, 'Already the WC\'s top scorer at 26. Leads France with cold efficiency.', 4.2, 82),
  P('tchouameni', 95270, 'Aurélien Tchouaméni', '🇫🇷', 'France', 'FRA', 'CDM', 85, 74, 70, 82, 77, 86, 84, ['W','W','W','D','W'], 0, 1, 7.6, 5, 20, 82, 75, 35, 'The midfield destroyer. Long-range passing and tireless pressing make him France\'s engine room.', undefined, 90),
  P('maignan', 47324, 'Mike Maignan', '🇫🇷', 'France', 'FRA', 'GK', 88, 55, 14, 50, 15, 88, 85, ['W','W','W','W','D'], 0, 0, 7.7, 5, 2, 4, 94, 4, 'AC Milan\'s shot-stopper. Commands his area with authority. Distribution is elite.', undefined, 85),

  // ─── Argentina ─────────────────────────────────────────
  P('messi', 154, 'Lionel Messi', '🇦🇷', 'Argentina', 'ARG', 'CF', 90, 72, 91, 94, 96, 32, 60, ['W','W','W','D','W'], 4, 6, 9.3, 5, 88, 70, 15, 55, 'Last dance. Fifth World Cup. At 38, his football brain is at its absolute peak.', 3.5, 93),
  P('alvarez', 6009, 'Julián Álvarez', '🇦🇷', 'Argentina', 'ARG', 'ST', 86, 85, 84, 78, 86, 42, 80, ['W','W','D','W','W'], 3, 1, 8.0, 5, 90, 60, 15, 45, 'The Spider. Works channels no one else sees. Scored in the 2022 semifinal. Tireless.', 2.6, 80),
  P('emi-martinez', 19599, 'Emiliano Martínez', '🇦🇷', 'Argentina', 'ARG', 'GK', 88, 48, 10, 52, 14, 87, 86, ['W','W','W','D','W'], 0, 0, 7.9, 5, 2, 5, 95, 5, 'Dibu. Master of the penalty shootout. Won the 2022 Golden Glove. Gets in your head.', undefined, 82),
  P('mac-allister', 6716, 'Alexis Mac Allister', '🇦🇷', 'Argentina', 'ARG', 'CM', 84, 78, 74, 84, 82, 76, 78, ['D','W','W','W','W'], 1, 2, 7.8, 5, 40, 85, 55, 35, 'Liverpool\'s midfield metronome. Quietly controls tempo like few others can.', undefined, 91),

  // ─── Germany ───────────────────────────────────────────
  P('musiala', 181812, 'Jamal Musiala', '🇩🇪', 'Germany', 'GER', 'CAM', 88, 82, 80, 86, 92, 38, 66, ['W','W','D','W','W'], 3, 3, 8.6, 5, 78, 85, 18, 50, 'Germany\'s golden boy. Dribbles through traffic like it\'s choreographed. Born to play World Cups.', 2.5, 88),
  P('sane', 644, 'Leroy Sané', '🇩🇪', 'Germany', 'GER', 'LW', 85, 92, 82, 78, 90, 28, 70, ['W','D','W','W','D'], 2, 2, 7.9, 5, 82, 50, 10, 85, 'Blistering pace and a left foot that bends physics. Germany\'s X-factor on the flank.', 1.8, 82),
  P('rudiger', 2285, 'Antonio Rüdiger', '🇩🇪', 'Germany', 'GER', 'CB', 85, 82, 48, 62, 58, 88, 90, ['W','W','W','D','W'], 0, 0, 7.4, 5, 5, 25, 94, 15, 'Aggressive, vocal, and physically dominant. Leads from the back with chaos energy.', undefined, 78),

  // ─── England ───────────────────────────────────────────
  P('bellingham', 129718, 'Jude Bellingham', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England', 'ENG', 'CAM', 89, 82, 85, 87, 88, 70, 84, ['W','W','D','W','W'], 3, 3, 8.7, 5, 75, 92, 48, 40, 'The complete modern midfielder. Scores in big moments. Carries England without complaint.', 2.4, 91),
  P('saka', 1460, 'Bukayo Saka', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England', 'ENG', 'RW', 87, 88, 82, 80, 90, 52, 70, ['W','W','W','D','W'], 2, 3, 8.3, 5, 80, 55, 18, 92, 'Arsenal\'s starboy. Redeemed his Euro 2021 penalty miss with a masterclass at the 2022 WC.', 1.8, 85),
  P('rice', 2937, 'Declan Rice', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England', 'ENG', 'CDM', 86, 70, 68, 80, 78, 88, 86, ['W','D','W','W','W'], 0, 1, 7.5, 5, 15, 78, 82, 28, 'Arsenal\'s midfield anchor. Reads danger before it arrives. England\'s shield.', undefined, 89),
  P('pickford', 2932, 'Jordan Pickford', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England', 'ENG', 'GK', 84, 52, 10, 48, 12, 84, 80, ['W','W','D','W','W'], 0, 0, 7.2, 5, 2, 4, 92, 4, 'England\'s tournament goalkeeper. Saved penalties in 2018 and 2024. Rises to every occasion.', undefined, 78),

  // ─── Spain ─────────────────────────────────────────────
  P('yamal', 386828, 'Lamine Yamal', '🇪🇸', 'Spain', 'ESP', 'RW', 88, 90, 82, 86, 94, 30, 62, ['W','W','W','W','D'], 3, 4, 8.8, 5, 85, 50, 10, 95, 'At 18, the youngest star in WC history. His combination play with Pedri is generational.', 2.9, 89),
  P('pedri', 133609, 'Pedri', '🇪🇸', 'Spain', 'ESP', 'CM', 87, 68, 72, 90, 88, 62, 68, ['W','W','D','W','W'], 1, 4, 8.5, 5, 35, 90, 40, 30, 'Barcelona\'s midfield maestro. Makes the difficult look routine. Spain\'s conductor.', undefined, 93),
  P('rodri', 44, 'Rodri', '🇪🇸', 'Spain', 'ESP', 'CDM', 89, 60, 72, 86, 82, 90, 86, ['W','W','W','D','W'], 0, 2, 8.0, 5, 12, 88, 80, 25, 'Ballon d\'Or winner. The metronome. Controls the tempo of every match he plays.', undefined, 94),

  // ─── Portugal ──────────────────────────────────────────
  P('ronaldo', 874, 'Cristiano Ronaldo', '🇵🇹', 'Portugal', 'POR', 'ST', 84, 70, 88, 78, 82, 40, 78, ['W','D','W','D','W'], 2, 1, 7.4, 5, 92, 40, 8, 40, 'The record-breaker. 41 years old and still scoring. Football\'s most relentless competitor.', 1.5, 78),
  P('bernardo-silva', 636, 'Bernardo Silva', '🇵🇹', 'Portugal', 'POR', 'RW', 87, 78, 80, 88, 92, 52, 64, ['W','W','W','D','W'], 1, 3, 8.2, 5, 70, 75, 20, 85, 'Man City\'s pocket magician. Works harder than anyone. Portugal\'s creative heartbeat.', 0.9, 91),
  P('dias', 567, 'Rúben Dias', '🇵🇹', 'Portugal', 'POR', 'CB', 86, 72, 40, 68, 60, 90, 86, ['W','W','W','W','D'], 0, 0, 7.6, 5, 5, 20, 95, 12, 'Man City\'s rock. Vocal, composed, dominant in the air. Portugal\'s defensive leader.', undefined, 82),

  // ─── Netherlands ───────────────────────────────────────
  P('gakpo', 247, 'Cody Gakpo', '🇳🇱', 'Netherlands', 'NED', 'LW', 85, 88, 82, 78, 86, 30, 78, ['W','W','D','W','W'], 3, 1, 8.1, 5, 82, 50, 10, 82, 'Liverpool\'s versatile forward. Scored in every group game at the 2022 WC. Big-tournament player.', 2.5, 80),
  P('de-jong', 538, 'Frenkie de Jong', '🇳🇱', 'Netherlands', 'NED', 'CM', 85, 60, 62, 88, 90, 72, 68, ['D','W','W','W','D'], 0, 2, 7.8, 5, 30, 88, 55, 30, 'Barcelona\'s carrying midfielder. Glides past pressure. The modern Dutch total footballer.', undefined, 92),
  P('van-dijk', 290, 'Virgil van Dijk', '🇳🇱', 'Netherlands', 'NED', 'CB', 88, 72, 52, 64, 58, 92, 88, ['W','W','W','D','W'], 0, 0, 7.7, 5, 5, 22, 96, 12, 'Captain. Colossus. Hasn\'t been dribbled past in 18 months. Commands everything around him.', undefined, 80),

  // ─── Belgium ───────────────────────────────────────────
  P('de-bruyne', 629, 'Kevin De Bruyne', '🇧🇪', 'Belgium', 'BEL', 'CAM', 88, 72, 86, 94, 88, 58, 74, ['D','W','W','D','W'], 1, 4, 8.4, 5, 65, 90, 30, 50, 'The greatest passer of his generation. Last tournament with Belgium. Wants to go out with a statement.', 0.8, 94),
  P('lukaku', 907, 'Romelu Lukaku', '🇧🇪', 'Belgium', 'BEL', 'ST', 84, 82, 86, 68, 80, 32, 90, ['W','D','W','W','L'], 2, 0, 7.2, 5, 92, 35, 5, 30, 'Belgium\'s all-time top scorer. Brutal in the box. Turns controversy into goals.', 2.2, 74),

  // ─── Croatia ───────────────────────────────────────────
  P('modric', 754, 'Luka Modrić', '🇭🇷', 'Croatia', 'CRO', 'CM', 86, 60, 72, 90, 90, 66, 62, ['W','W','D','W','W'], 1, 3, 8.3, 5, 40, 92, 45, 35, 'Still magical at 40. The Golden Ball winner in 2018. Croatia\'s eternal heartbeat.', undefined, 93),
  P('gvardiol', 129033, 'Joško Gvardiol', '🇭🇷', 'Croatia', 'CRO', 'LB', 84, 78, 50, 72, 70, 86, 84, ['W','W','W','D','W'], 0, 1, 7.5, 5, 15, 40, 85, 60, 'Man City\'s marauding left-back. Scored in the 2022 WC. Only 24 but already a veteran of two World Cups.', undefined, 80),

  // ─── Uruguay ───────────────────────────────────────────
  P('valverde', 756, 'Federico Valverde', '🇺🇾', 'Uruguay', 'URU', 'CM', 87, 82, 80, 82, 86, 78, 84, ['W','W','W','D','W'], 2, 2, 8.1, 5, 55, 85, 60, 50, 'Real Madrid\'s box-to-box warrior. Covers more ground than any midfielder in the tournament.', 1.4, 87),
  P('nunez', 51617, 'Darwin Núñez', '🇺🇾', 'Uruguay', 'URU', 'ST', 84, 94, 84, 72, 82, 28, 82, ['W','D','W','L','W'], 3, 0, 7.6, 5, 90, 40, 5, 40, 'Chaos incarnate. Unpredictable, relentless, and capable of moments that defy logic.', 2.8, 72),

  // ─── Colombia ──────────────────────────────────────────
  P('luis-diaz', 2489, 'Luis Díaz', '🇨🇴', 'Colombia', 'COL', 'LW', 85, 90, 80, 78, 88, 28, 72, ['W','W','D','W','W'], 2, 2, 8.0, 5, 85, 48, 8, 88, 'Liverpool\'s flying winger. Pace, skill, and heart. Colombia\'s most dangerous weapon.', 1.6, 82),
  P('james', 517, 'James Rodríguez', '🇨🇴', 'Colombia', 'COL', 'CAM', 82, 58, 82, 88, 88, 42, 52, ['D','W','W','D','W'], 1, 3, 7.9, 5, 60, 82, 20, 50, 'The 2014 Golden Boot winner. Still pulling strings at 34. Colombia\'s conductor.', undefined, 90),

  // ─── United States ─────────────────────────────────────
  P('pulisic', 17, 'Christian Pulisic', '🇺🇸', 'United States', 'USA', 'RW', 84, 84, 80, 82, 88, 38, 68, ['W','D','W','W','W'], 2, 2, 8.0, 5, 78, 55, 15, 85, 'Captain America. Scored the goal that sent the USMNT to the 2022 knockout rounds. Carries a nation.', 1.5, 84),
  P('mckennie', 415, 'Weston McKennie', '🇺🇸', 'United States', 'USA', 'CM', 80, 74, 72, 76, 78, 76, 82, ['W','W','D','W','D'], 1, 1, 7.2, 5, 40, 78, 60, 35, 'Juventus\'s engine. A warrior in midfield. Everything America wants to be — relentless.', undefined, 82),
  P('turner', 50999, 'Matt Turner', '🇺🇸', 'United States', 'USA', 'GK', 78, 45, 8, 42, 10, 78, 80, ['W','D','W','W','D'], 0, 0, 7.0, 5, 2, 4, 88, 4, 'The American wall. Rose from the lower divisions. Proof that belief can take you anywhere.', undefined, 76),

  // ─── Mexico ────────────────────────────────────────────
  P('lozano', 248, 'Hirving Lozano', '🇲🇽', 'Mexico', 'MEX', 'RW', 82, 86, 78, 72, 84, 30, 72, ['W','D','W','D','W'], 1, 1, 7.4, 5, 80, 45, 10, 88, 'Chucky. Scored against Germany in the 2018 opener. Mexico\'s most dangerous attacker.', 0.9, 78),
  P('edson-alvarez', 2869, 'Edson Álvarez', '🇲🇽', 'Mexico', 'MEX', 'CDM', 82, 62, 65, 78, 74, 86, 84, ['W','W','D','W','W'], 0, 1, 7.3, 5, 12, 80, 78, 25, 'West Ham\'s anchor. Physical, composed, and tactically sharp. Mexico\'s midfield wall.', undefined, 84),

  // ─── Japan ─────────────────────────────────────────────
  P('kubo', 32862, 'Takefusa Kubo', '🇯🇵', 'Japan', 'JPN', 'RW', 82, 82, 76, 78, 86, 30, 62, ['W','W','D','W','W'], 2, 2, 7.8, 5, 78, 55, 10, 90, 'Real Sociedad\'s Japanese gem. The player Barcelona let slip away. Quick feet, quicker brain.', 1.6, 84),
  P('tomiyasu', 99432, 'Takehiro Tomiyasu', '🇯🇵', 'Japan', 'JPN', 'RB', 80, 72, 32, 65, 58, 84, 82, ['W','W','W','D','W'], 0, 1, 7.2, 5, 12, 35, 85, 55, 'Arsenal\'s versatile defender. Can play anywhere across the backline. Japan\'s quiet leader.', undefined, 82),
  P('mitoma', 106835, 'Kaoru Mitoma', '🇯🇵', 'Japan', 'JPN', 'LW', 82, 84, 74, 76, 88, 28, 66, ['W','D','W','W','W'], 1, 2, 7.6, 5, 80, 48, 8, 85, 'Brighton\'s dribbling wizard. Proved with his PhD thesis that dribbling can be coached.', 0.8, 80),

  // ─── Senegal ───────────────────────────────────────────
  P('mendy-edouard', 2986, 'Édouard Mendy', '🇸🇳', 'Senegal', 'SEN', 'GK', 82, 48, 8, 48, 12, 82, 80, ['W','D','W','W','D'], 0, 0, 7.1, 5, 2, 4, 90, 4, 'CL winner with Chelsea. Calm under pressure. Senegal\'s safest pair of hands.', undefined, 80),
  P('koulibaly', 318, 'Kalidou Koulibaly', '🇸🇳', 'Senegal', 'SEN', 'CB', 83, 68, 38, 62, 52, 88, 88, ['W','W','D','W','W'], 0, 0, 7.3, 5, 5, 18, 94, 12, 'The Beast. Physical dominance meets technical composure. Senegal\'s defensive commander.', undefined, 76),

  // ─── Switzerland ───────────────────────────────────────
  P('xhaka', 1464, 'Granit Xhaka', '🇨🇭', 'Switzerland', 'SUI', 'CM', 83, 68, 74, 80, 78, 80, 82, ['W','W','D','W','W'], 0, 2, 7.4, 5, 25, 82, 65, 30, 'Leverkusen\'s unbeaten-season captain. Switzerland\'s most experienced voice. Leads by example.', undefined, 87),
  P('akanji', 5, 'Manuel Akanji', '🇨🇭', 'Switzerland', 'SUI', 'CB', 84, 70, 40, 70, 62, 86, 84, ['W','W','W','D','W'], 0, 0, 7.3, 5, 4, 20, 92, 12, 'Man City\'s Swiss rock. Won everything at club level. Calm under siege.', undefined, 82),

  // ─── Morocco ───────────────────────────────────────────
  P('hakimi', 9, 'Achraf Hakimi', '🇲🇦', 'Morocco', 'MAR', 'RB', 86, 92, 68, 78, 82, 78, 76, ['W','W','W','D','W'], 0, 2, 7.9, 5, 35, 55, 72, 90, 'PSG\'s flying fullback. Made the whole world take notice in 2022. Morocco\'s engine on the right.', undefined, 82),
  P('amrabat', 74, 'Sofyan Amrabat', '🇲🇦', 'Morocco', 'MAR', 'CDM', 81, 72, 58, 74, 70, 84, 86, ['W','D','W','W','W'], 0, 0, 7.2, 5, 10, 78, 80, 25, 'The warrior of 2022. Covered every blade of Qatari grass. Morocco\'s midfield enforcer.', undefined, 84),

  // ─── Denmark ───────────────────────────────────────────
  P('eriksen', 174, 'Christian Eriksen', '🇩🇰', 'Denmark', 'DEN', 'CAM', 82, 62, 82, 88, 84, 48, 58, ['D','W','W','W','D'], 1, 2, 7.6, 5, 55, 85, 25, 40, 'The miracle man. Collapsed at Euro 2020. Came back. Scored on his return. Football\'s greatest comeback.', undefined, 90),
  P('hojlund', 288006, 'Rasmus Højlund', '🇩🇰', 'Denmark', 'DEN', 'ST', 81, 88, 80, 68, 78, 30, 80, ['W','W','D','L','W'], 2, 0, 7.3, 5, 88, 35, 5, 30, 'Man United\'s young striker. Rapid, powerful, and hungry. Denmark\'s future.', 1.8, 72),

  // ─── Australia ─────────────────────────────────────────
  P('mooy', 21027, 'Aaron Mooy', '🇦🇺', 'Australia', 'AUS', 'CM', 74, 58, 62, 74, 72, 70, 72, ['D','W','D','W','W'], 0, 1, 6.8, 5, 28, 75, 55, 30, 'The brain of the Socceroos. Quietly controls midfield. Australia\'s most intelligent player.', undefined, 82),
  P('duke', 6993, 'Mitchell Duke', '🇦🇺', 'Australia', 'AUS', 'ST', 72, 70, 70, 55, 64, 28, 78, ['W','D','L','W','W'], 1, 0, 6.5, 4, 85, 30, 5, 35, 'Headed Australia into the knockout rounds in 2022. Heart and desire personified.', 0.8, 68),

  // ─── South Korea ───────────────────────────────────────
  P('son', 186, 'Son Heung-min', '🇰🇷', 'South Korea', 'KOR', 'LW', 87, 90, 88, 82, 90, 30, 72, ['W','W','D','W','W'], 3, 2, 8.4, 5, 85, 55, 10, 82, 'Asia\'s greatest. Tottenham\'s talisman. Plays through pain and never stops smiling.', 2.8, 84),
  P('kim-min-jae', 2897, 'Kim Min-jae', '🇰🇷', 'South Korea', 'KOR', 'CB', 84, 78, 42, 68, 58, 88, 86, ['W','W','W','D','W'], 0, 0, 7.5, 5, 5, 22, 94, 10, 'The Monster. Bayern Munich defender. Korea\'s best CB in a generation.', undefined, 80),

  // ─── Canada ────────────────────────────────────────────
  P('david', 8489, 'Jonathan David', '🇨🇦', 'Canada', 'CAN', 'ST', 82, 86, 82, 72, 80, 30, 74, ['W','D','W','W','D'], 2, 0, 7.4, 5, 88, 38, 8, 32, 'Lille\'s goal machine. Canada\'s all-time top scorer. Cool, clinical, and consistent.', 1.8, 78),
  P('davies', 509, 'Alphonso Davies', '🇨🇦', 'Canada', 'CAN', 'LB', 84, 96, 52, 68, 78, 80, 76, ['W','W','D','W','W'], 0, 2, 7.6, 5, 25, 45, 75, 88, 'Bayern Munich\'s road runner. The fastest player at the tournament. Canada\'s heartbeat.', undefined, 78),

  // ─── Nigeria ───────────────────────────────────────────
  P('osimhen', 2780, 'Victor Osimhen', '🇳🇬', 'Nigeria', 'NGA', 'ST', 86, 88, 86, 72, 82, 28, 84, ['W','D','W','W','W'], 3, 0, 8.0, 5, 92, 35, 5, 30, 'Napoli\'s goal machine. Led them to the Serie A title. Nigeria\'s most feared striker in decades.', 2.6, 74),
  P('ndidi', 18786, 'Wilfred Ndidi', '🇳🇬', 'Nigeria', 'NGA', 'CDM', 80, 68, 55, 72, 64, 86, 86, ['W','W','D','W','D'], 0, 0, 7.0, 5, 10, 75, 82, 22, 'Leicester\'s midfield destroyer. Covers more ground per 90 than almost anyone. Nigeria\'s engine.', undefined, 80),

  // ─── Ecuador ───────────────────────────────────────────
  P('caicedo', 116117, 'Moisés Caicedo', '🇪🇨', 'Ecuador', 'ECU', 'CDM', 82, 72, 68, 78, 74, 84, 84, ['W','W','D','W','W'], 0, 1, 7.4, 5, 15, 80, 78, 28, 'Chelsea\'s £115m midfielder. Ecuador\'s most valuable export. Runs games from deep.', undefined, 86),
  P('valencia-enner', 35533, 'Énner Valencia', '🇪🇨', 'Ecuador', 'ECU', 'ST', 78, 80, 78, 65, 72, 28, 78, ['D','W','W','D','W'], 2, 0, 7.0, 4, 88, 30, 5, 30, 'Ecuador\'s captain and all-time WC scorer. Scored in every WC match he\'s played.', 1.4, 70),

  // ─── Poland ────────────────────────────────────────────
  P('lewandowski', 521, 'Robert Lewandowski', '🇵🇱', 'Poland', 'POL', 'ST', 86, 58, 92, 80, 84, 32, 78, ['W','W','D','W','D'], 2, 1, 7.8, 5, 92, 40, 5, 30, 'Barcelona\'s striker. Poland\'s all-time top scorer. Finally scored his first WC goal in 2022. Tears.', 1.8, 82),
  P('szczesny', 851, 'Wojciech Szczęsny', '🇵🇱', 'Poland', 'POL', 'GK', 84, 50, 10, 48, 14, 84, 82, ['W','D','W','W','W'], 0, 0, 7.4, 5, 2, 5, 92, 4, 'Saved a Messi penalty at the 2022 WC. Came out of retirement for one last ride.', undefined, 80),

  // ─── Serbia ────────────────────────────────────────────
  P('vlahovic', 30415, 'Dušan Vlahović', '🇷🇸', 'Serbia', 'SRB', 'ST', 83, 82, 84, 68, 78, 28, 84, ['W','D','W','W','D'], 2, 0, 7.3, 5, 90, 35, 5, 28, 'Juventus\'s spearhead. Lethal left foot. Serbia\'s best striker since Viduka.', 1.8, 72),
  P('milinkovic-savic', 1856, 'Sergej Milinković-Savić', '🇷🇸', 'Serbia', 'SRB', 'CM', 82, 72, 76, 80, 82, 70, 84, ['D','W','W','W','D'], 1, 1, 7.2, 5, 40, 80, 50, 35, 'Al Hilal\'s colossus. A header machine. Serbia\'s most physically imposing midfielder.', undefined, 84),

  // ─── Iran ──────────────────────────────────────────────
  P('taremi', 42315, 'Mehdi Taremi', '🇮🇷', 'Iran', 'IRN', 'ST', 80, 72, 82, 68, 78, 30, 80, ['W','D','W','D','W'], 2, 1, 7.2, 5, 88, 40, 8, 30, 'Inter Milan striker. Iran\'s most technically gifted forward. Scores goals others can\'t imagine.', 1.6, 76),
  P('jahanbakhsh', 2700, 'Alireza Jahanbakhsh', '🇮🇷', 'Iran', 'IRN', 'RW', 76, 78, 72, 68, 76, 30, 68, ['W','D','D','W','W'], 1, 1, 6.8, 5, 72, 50, 12, 82, 'Feyenoord\'s veteran winger. The 2017-18 Eredivisie top scorer. Iran\'s experience.', undefined, 78),

  // ─── Ghana ─────────────────────────────────────────────
  P('kudus', 15911, 'Mohammed Kudus', '🇬🇭', 'Ghana', 'GHA', 'CAM', 82, 82, 78, 76, 86, 40, 78, ['W','W','D','W','W'], 2, 1, 7.6, 5, 70, 75, 22, 50, 'West Ham\'s magician. Scored twice against South Korea in 2022. Ghana\'s X-factor.', 1.4, 80),
  P('partey', 49, 'Thomas Partey', '🇬🇭', 'Ghana', 'GHA', 'CDM', 82, 72, 65, 76, 72, 84, 84, ['W','D','W','W','D'], 0, 1, 7.2, 5, 12, 78, 80, 25, 'Arsenal\'s midfield general. Strong, composed, and impossible to bypass when fit.', undefined, 84),

  // ─── Cameroon ──────────────────────────────────────────
  P('onana', 526, 'André Onana', '🇨🇲', 'Cameroon', 'CMR', 'GK', 82, 52, 10, 55, 14, 82, 78, ['W','D','W','D','W'], 0, 0, 7.0, 5, 2, 5, 90, 5, 'Man United\'s keeper. Exceptional distribution. Cameroon\'s most talented ever between the posts.', undefined, 84),
  P('choupo-moting', 275, 'Eric Maxim Choupo-Moting', '🇨🇲', 'Cameroon', 'CMR', 'CF', 76, 62, 72, 64, 74, 28, 80, ['D','W','D','W','W'], 1, 0, 6.6, 4, 82, 45, 8, 30, 'The cult hero. Scored the goal that eliminated Brazil in 2022. Cameroon\'s improbable legend.', 0.6, 72),

  // ─── Tunisia ───────────────────────────────────────────
  P('khazri', 22102, 'Wahbi Khazri', '🇹🇳', 'Tunisia', 'TUN', 'CAM', 74, 62, 72, 76, 76, 38, 64, ['D','W','D','W','D'], 1, 1, 6.8, 5, 55, 72, 20, 40, 'Tunisia\'s all-time top scorer. The captain who led them to beat France in 2022.', undefined, 80),
  P('bronn', 2945, 'Dylan Bronn', '🇹🇳', 'Tunisia', 'TUN', 'CB', 74, 64, 38, 58, 50, 78, 78, ['W','D','W','D','W'], 0, 0, 6.6, 4, 5, 18, 88, 10, 'Tunisia\'s defensive rock. Consistent and brave. Set-piece threat from the back.', undefined, 74),

  // ─── Saudi Arabia ──────────────────────────────────────
  P('al-dawsari', 44340, 'Salem Al-Dawsari', '🇸🇦', 'Saudi Arabia', 'KSA', 'LW', 76, 80, 76, 68, 78, 28, 66, ['W','D','W','D','W'], 1, 1, 7.0, 5, 78, 45, 8, 82, 'The man who scored THAT goal against Argentina in 2022. Saudi Arabia\'s national hero.', 0.7, 76),
  P('al-owais', 44411, 'Mohammed Al-Owais', '🇸🇦', 'Saudi Arabia', 'KSA', 'GK', 74, 45, 8, 40, 10, 74, 76, ['W','D','W','D','W'], 0, 0, 6.8, 5, 2, 4, 86, 4, 'The hero of the Argentina match. Made save after save. Saudi Arabia\'s last line.', undefined, 72),

  // ─── Costa Rica ────────────────────────────────────────
  P('campbell', 2845, 'Joel Campbell', '🇨🇷', 'Costa Rica', 'CRC', 'RW', 74, 74, 72, 68, 74, 32, 68, ['D','W','D','D','W'], 0, 1, 6.5, 4, 70, 48, 12, 80, 'The 2014 WC hero. Tore apart Uruguay and Italy. Still Costa Rica\'s talisman.', undefined, 74),
  P('navas', 731, 'Keylor Navas', '🇨🇷', 'Costa Rica', 'CRC', 'GK', 80, 48, 8, 45, 12, 80, 78, ['W','D','W','D','W'], 0, 0, 7.0, 5, 2, 4, 90, 4, 'Real Madrid legend. Three Champions League titles. Costa Rica\'s greatest-ever player. One last ride.', undefined, 78),

  // ─── Qatar ───────────────────────────────────────────
  P('almoez-ali', 2543, 'Almoez Ali', '🇶🇦', 'Qatar', 'QAT', 'ST', 74, 82, 74, 62, 72, 26, 72, ['D','W','D','D','W'], 1, 0, 6.6, 4, 88, 32, 5, 28, 'Qatar\'s all-time top scorer. Asian Cup 2019 Golden Boot. Leads the line at home.', 0.6, 68),
  P('akram-afif', 2544, 'Akram Afif', '🇶🇦', 'Qatar', 'QAT', 'LW', 76, 82, 74, 70, 80, 28, 66, ['W','D','W','D','W'], 1, 2, 7.0, 5, 78, 50, 8, 85, 'Asian Player of the Year 2024. Tricky winger with an eye for goal. Qatar\'s talisman.', 0.8, 78),

  // ─── Paraguay ────────────────────────────────────────
  P('almiron', 2507, 'Miguel Almirón', '🇵🇾', 'Paraguay', 'PAR', 'CAM', 78, 82, 74, 72, 82, 32, 68, ['W','D','W','D','W'], 1, 1, 7.0, 5, 65, 72, 15, 50, 'Newcastle\'s speed demon. Paraguay\'s most dangerous creator.', 0.8, 78),
  P('gustavo-gomez', 9617, 'Gustavo Gómez', '🇵🇾', 'Paraguay', 'PAR', 'CB', 78, 68, 42, 60, 52, 84, 84, ['W','W','D','W','W'], 0, 0, 7.0, 5, 5, 20, 90, 12, 'Palmeiras captain. A rock at the back. Paraguay\'s defensive anchor.', undefined, 78),

  // ─── Peru ────────────────────────────────────────────
  P('guerrero', 10401, 'Paolo Guerrero', '🇵🇪', 'Peru', 'PER', 'ST', 72, 60, 76, 62, 68, 28, 78, ['D','W','D','W','D'], 1, 0, 6.4, 4, 88, 32, 5, 28, 'Peru\'s all-time top scorer. At 40, a living legend. One last ride on the world stage.', 0.5, 68),
  P('lapadula', 18984, 'Gianluca Lapadula', '🇵🇪', 'Peru', 'PER', 'CF', 76, 72, 76, 64, 72, 28, 78, ['W','D','W','D','W'], 1, 1, 6.8, 4, 82, 38, 8, 28, 'Italian-born forward who chose Peru. Tireless workrate and clinical finishing.', 0.7, 72),

  // ─── Chile ───────────────────────────────────────────
  P('sanchez', 910, 'Alexis Sánchez', '🇨🇱', 'Chile', 'CHL', 'CF', 78, 72, 78, 72, 82, 32, 72, ['W','D','W','D','W'], 1, 1, 7.0, 5, 80, 55, 10, 60, 'Two-time Copa América winner. Chile\'s greatest-ever player. Football intelligence at its finest.', 0.8, 80),
  P('vidal', 151, 'Arturo Vidal', '🇨🇱', 'Chile', 'CHL', 'CM', 76, 72, 72, 72, 74, 76, 84, ['W','D','W','W','D'], 0, 1, 6.8, 5, 35, 78, 55, 30, 'The King. Box-to-box warrior who has won everything. Chile\'s engine room general.', undefined, 82),

  // ─── Algeria ─────────────────────────────────────────
  P('mahrez', 635, 'Riyad Mahrez', '🇩🇿', 'Algeria', 'ALG', 'RW', 80, 76, 80, 72, 88, 28, 58, ['W','D','W','W','D'], 1, 2, 7.4, 5, 75, 55, 8, 90, 'Man City Premier League winner. Algeria\'s captain and creative fulcrum.', 0.9, 84),
  P('slimani', 1374, 'Islam Slimani', '🇩🇿', 'Algeria', 'ALG', 'ST', 74, 68, 76, 60, 64, 28, 82, ['D','W','D','W','D'], 1, 0, 6.6, 4, 88, 30, 5, 28, 'Algeria\'s all-time top scorer. Aerial threat. Brings experience to a young squad.', 0.6, 72),

  // ─── Wales ───────────────────────────────────────────
  P('bale', 758, 'Gareth Bale', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Wales', 'WAL', 'RW', 76, 78, 80, 72, 82, 28, 66, ['D','W','D','W','D'], 1, 0, 6.8, 5, 75, 48, 8, 82, 'Came out of retirement for Wales. Five Champions League titles. Pure magic on the wing.', 0.5, 72),
  P('ramsey', 1459, 'Aaron Ramsey', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Wales', 'WAL', 'CM', 74, 62, 68, 76, 74, 68, 70, ['W','D','D','W','D'], 0, 1, 6.6, 5, 40, 78, 40, 30, 'Arsenal and Juventus veteran. Wales\'s captain and heartbeat. Scores big goals.', undefined, 80),

  // ─── Jamaica ─────────────────────────────────────────
  P('antonio', 18819, 'Michail Antonio', '🇯🇲', 'Jamaica', 'JAM', 'ST', 76, 78, 76, 60, 72, 28, 86, ['W','D','W','D','W'], 1, 0, 6.8, 4, 88, 35, 5, 30, 'West Ham\'s powerful striker who switched to Jamaica. Physical dominance personified.', 0.7, 72),
  P('bailey', 983, 'Leon Bailey', '🇯🇲', 'Jamaica', 'JAM', 'LW', 78, 88, 76, 68, 84, 24, 64, ['W','W','D','W','D'], 2, 1, 7.2, 5, 80, 45, 8, 88, 'Aston Villa\'s pace merchant. Jamaica\'s most exciting talent. Explosive on the break.', 1.2, 78),

  // ─── Scotland ────────────────────────────────────────
  P('robertson', 289, 'Andrew Robertson', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Scotland', 'SCO', 'LB', 82, 82, 42, 78, 72, 80, 80, ['W','D','W','W','D'], 0, 2, 7.4, 5, 18, 42, 78, 85, 'Liverpool\'s marauding left-back. Scotland\'s captain. Best delivery in the tournament.', undefined, 82),
  P('mcginn', 19191, 'John McGinn', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Scotland', 'SCO', 'CM', 78, 72, 72, 72, 76, 72, 82, ['W','D','W','D','W'], 1, 1, 7.0, 5, 40, 78, 50, 35, 'Aston Villa captain. All action, all energy. Scotland\'s midfield dynamo.', 0.6, 80),

  // ─── Ukraine ─────────────────────────────────────────
  P('zinchenko', 641, 'Oleksandr Zinchenko', '🇺🇦', 'Ukraine', 'UKR', 'LB', 80, 72, 42, 82, 76, 76, 72, ['W','D','W','W','D'], 0, 1, 7.2, 5, 22, 55, 72, 80, 'Arsenal\'s inverted full-back. Ukraine\'s creative engine from the left side.', undefined, 84),
  P('mudryk', 162559, 'Mykhailo Mudryk', '🇺🇦', 'Ukraine', 'UKR', 'LW', 80, 90, 72, 68, 86, 24, 62, ['W','W','D','W','D'], 1, 1, 7.0, 5, 80, 45, 8, 88, 'Chelsea\'s Ukrainian winger. Raw pace and directness. Still searching for his best form.', 0.8, 74),

  // ─── Uzbekistan ──────────────────────────────────────
  P('shomurodov', 53535, 'Eldor Shomurodov', '🇺🇿', 'Uzbekistan', 'UZB', 'ST', 74, 78, 74, 60, 70, 26, 76, ['W','D','W','D','W'], 1, 0, 6.6, 4, 85, 35, 5, 30, 'Roma forward. Uzbekistan\'s leading striker. Central Asian football\'s biggest name.', 0.7, 70),
  P('jaloliddinov', 283009, 'Jaloliddin Masharipov', '🇺🇿', 'Uzbekistan', 'UZB', 'RW', 72, 76, 70, 64, 78, 26, 60, ['D','W','W','D','W'], 1, 1, 6.8, 5, 72, 50, 10, 82, 'Uzbekistan\'s most creative player. Dictates play from the right flank.', 0.5, 76),

  // ─── Egypt ───────────────────────────────────────────
  P('salah', 306, 'Mohamed Salah', '🇪🇬', 'Egypt', 'EGY', 'RW', 88, 88, 88, 80, 92, 30, 68, ['W','W','W','D','W'], 3, 2, 8.6, 5, 85, 55, 10, 90, 'Liverpool\'s Egyptian King. Premier League Golden Boot winner. Africa\'s greatest active player.', 2.8, 86),
  P('elneny', 640, 'Mohamed Elneny', '🇪🇬', 'Egypt', 'EGY', 'CDM', 76, 62, 55, 72, 68, 78, 78, ['W','D','W','D','W'], 0, 0, 6.8, 5, 12, 75, 72, 22, 'Arsenal veteran. Egypt\'s experienced midfielder. Reliable and composed under pressure.', undefined, 80),

  // ─── Ivory Coast ─────────────────────────────────────
  P('pepe', 3246, 'Nicolas Pépé', '🇨🇮', 'Ivory Coast', 'CIV', 'RW', 78, 82, 76, 68, 84, 28, 64, ['W','D','W','W','D'], 1, 1, 7.0, 5, 78, 48, 10, 88, 'Former Arsenal record signing. Ivory Coast\'s most dangerous wide player. Direct and decisive.', 0.8, 76),
  P('kessie', 1642, 'Franck Kessié', '🇨🇮', 'Ivory Coast', 'CIV', 'CM', 80, 72, 68, 74, 72, 82, 86, ['W','W','D','W','W'], 0, 1, 7.2, 5, 30, 80, 65, 30, 'Barcelona midfielder. AFCON champion. Ivory Coast\'s physical powerhouse in midfield.', undefined, 84),

  // ─── Indonesia ───────────────────────────────────────
  P('arhan', 206587, 'Pratama Arhan', '🇮🇩', 'Indonesia', 'IDN', 'LB', 68, 76, 40, 52, 56, 72, 74, ['D','W','D','D','W'], 0, 1, 6.2, 4, 15, 35, 72, 80, 'Indonesia\'s most-hyped young talent. Left-back with a rocket throw-in. A nation\'s hope.', undefined, 68),
  P('egy-maulana', 62741, 'Egy Maulana Vikri', '🇮🇩', 'Indonesia', 'IDN', 'CAM', 66, 68, 62, 58, 70, 28, 58, ['D','D','W','D','W'], 0, 1, 6.0, 4, 55, 60, 18, 40, 'Indonesia\'s creative jewel. Plays with flair and imagination. The Garuda\'s playmaker.', undefined, 70),

  // ─── Bolivia ─────────────────────────────────────────
  P('marcelo-martins', 5875, 'Marcelo Martins', '🇧🇴', 'Bolivia', 'BOL', 'ST', 70, 68, 72, 55, 62, 26, 78, ['D','W','D','D','W'], 1, 0, 6.2, 4, 85, 30, 5, 28, 'Bolivia\'s all-time top scorer. A veteran warrior leading the line one more time.', 0.4, 66),
  P('saavedra', 158102, 'Roberto Carlos Fernández', '🇧🇴', 'Bolivia', 'BOL', 'CM', 66, 60, 55, 62, 58, 68, 72, ['D','W','D','W','D'], 0, 0, 6.0, 4, 25, 68, 55, 25, 'Bolivia\'s midfield anchor. Brings composure and experience to a young squad.', undefined, 68),

  // ─── Venezuela ───────────────────────────────────────
  P('rondon', 2461, 'Salomón Rondón', '🇻🇪', 'Venezuela', 'VEN', 'ST', 74, 68, 78, 60, 68, 28, 84, ['W','D','W','D','W'], 1, 0, 6.6, 4, 88, 32, 5, 28, 'Venezuela\'s all-time top scorer. Physical target man. A leader on and off the pitch.', 0.6, 70),
  P('soteldo', 77100, 'Yeferson Soteldo', '🇻🇪', 'Venezuela', 'VEN', 'LW', 76, 80, 70, 68, 84, 20, 56, ['W','W','D','W','D'], 1, 2, 7.0, 5, 78, 48, 8, 85, 'Tiny but electric. Venezuela\'s pocket rocket. Creates chances from nothing.', 0.8, 78),

  // ─── New Zealand ─────────────────────────────────────
  P('wood', 18931, 'Chris Wood', '🇳🇿', 'New Zealand', 'NZL', 'ST', 76, 64, 80, 55, 68, 28, 84, ['W','D','W','W','D'], 2, 0, 7.0, 5, 88, 30, 5, 25, 'Nottingham Forest\'s goal machine. New Zealand\'s greatest-ever striker. Premier League proven.', 1.6, 74),
  P('cacace', 279629, 'Liberato Cacace', '🇳🇿', 'New Zealand', 'NZL', 'LB', 70, 74, 38, 58, 56, 72, 74, ['D','W','D','W','W'], 0, 1, 6.4, 4, 15, 38, 72, 80, 'Empoli\'s left-back. New Zealand\'s most exciting defensive talent. Serie A experience.', undefined, 70),

  // ─── Thailand ────────────────────────────────────────
  P('chanathip', 32993, 'Chanathip Songkrasin', '🇹🇭', 'Thailand', 'THA', 'CAM', 68, 70, 62, 62, 76, 22, 52, ['D','W','D','D','W'], 0, 1, 6.2, 4, 55, 65, 15, 40, 'The Messi of Thailand. Tiny playmaker with magical feet. ASEAN\'s most celebrated footballer.', undefined, 72),
  P('supachok', 196400, 'Supachok Sarachat', '🇹🇭', 'Thailand', 'THA', 'RW', 66, 72, 62, 56, 68, 24, 56, ['D','D','W','D','W'], 1, 0, 6.0, 4, 70, 45, 10, 80, 'Thailand\'s pacy winger. Quick and direct. The War Elephants\' main attacking outlet.', 0.3, 68),

  // ─── Iran (additional) ──────────────────────────────
  P('azmoun', 1221, 'Sardar Azmoun', '🇮🇷', 'Iran', 'IRN', 'ST', 80, 82, 82, 68, 80, 28, 74, ['W','W','D','W','W'], 2, 1, 7.4, 5, 88, 40, 8, 32, 'The Iranian Messi. Prolific goal-scorer with pace and intelligence. Iran\'s biggest star.', 1.4, 78),

  // ─── Qatar (additional) ─────────────────────────────
  P('al-haydos', 2542, 'Hassan Al-Haydos', '🇶🇦', 'Qatar', 'QAT', 'CAM', 72, 68, 68, 68, 74, 32, 60, ['D','W','D','W','D'], 0, 1, 6.4, 4, 52, 70, 18, 38, 'Qatar\'s captain and record appearance holder. Leads by example. The soul of the national team.', undefined, 74),
];

// Generate formDetailed for every player from their form array + group opponents
const _GROUP_OPPONENTS: Record<string, string[]> = {
  USA: ['PAN','CMR','ALG'], PAN: ['USA','CMR','ALG'], CMR: ['USA','PAN','ALG'], ALG: ['USA','PAN','CMR'],
  MEX: ['ECU','IDN','UKR'], ECU: ['MEX','IDN','UKR'], IDN: ['MEX','ECU','UKR'], UKR: ['MEX','ECU','IDN'],
  ARG: ['CHL','PER','ALB'], CHL: ['ARG','PER','ALB'], PER: ['ARG','CHL','ALB'], ALB: ['ARG','CHL','PER'],
  FRA: ['ENG','SRB','KOR'], ENG: ['FRA','SRB','KOR'], SRB: ['FRA','ENG','KOR'], KOR: ['FRA','ENG','SRB'],
  ESP: ['BRA','JPN','MAR'], BRA: ['ESP','JPN','MAR'], JPN: ['ESP','BRA','MAR'], MAR: ['ESP','BRA','JPN'],
  GER: ['POR','COL','NZL'], POR: ['GER','COL','NZL'], COL: ['GER','POR','NZL'], NZL: ['GER','POR','COL'],
  NED: ['SEN','EGY','CRC'], SEN: ['NED','EGY','CRC'], EGY: ['NED','SEN','CRC'], CRC: ['NED','SEN','EGY'],
  BEL: ['CRO','URU','PAR'], CRO: ['BEL','URU','PAR'], URU: ['BEL','CRO','PAR'], PAR: ['BEL','CRO','URU'],
  ITA: ['KSA','VEN','CAN'], KSA: ['ITA','VEN','CAN'], VEN: ['ITA','KSA','CAN'], CAN: ['ITA','KSA','VEN'],
  SUI: ['NGA','RSA','GUA'], NGA: ['SUI','RSA','GUA'], RSA: ['SUI','NGA','GUA'], GUA: ['SUI','NGA','RSA'],
  IRN: ['AUS','GHA','CZE'], AUS: ['IRN','GHA','CZE'], GHA: ['IRN','AUS','CZE'], CZE: ['IRN','AUS','GHA'],
  POL: ['HON','UZB','COD'], HON: ['POL','UZB','COD'], UZB: ['POL','HON','COD'], COD: ['POL','HON','UZB'],
};
const _TEAM_FLAG: Record<string, string> = {};
TEAMS.forEach(t => { _TEAM_FLAG[t.id] = t.flag; });
const _W_SCORES = ['2-0','3-1','1-0','2-1','3-0'];
const _D_SCORES = ['1-1','0-0','2-2'];
const _L_SCORES = ['0-1','1-2','0-2','1-3'];

PLAYERS.forEach(p => {
  const opps = _GROUP_OPPONENTS[p.teamId] || ['USA','MEX','CAN'];
  p.formDetailed = p.form.map((outcome, i) => {
    const oppId = opps[i % opps.length];
    const scores = outcome === 'W' ? _W_SCORES : outcome === 'D' ? _D_SCORES : _L_SCORES;
    return { score: scores[i % scores.length], opponentFlag: _TEAM_FLAG[oppId] || '🏳️', outcome };
  });
});

export const STADIUMS: Record<string, Stadium> = {
  'MetLife Stadium': {
    name: 'MetLife Stadium', city: 'East Rutherford', country: 'USA', capacity: 82500,
    surface: 'Natural grass', opened: 2010, cost: '$1.6 billion',
    host: 'Final + 8 other matches',
    facts: [
      'Largest stadium in the WC tournament — 82,500 seats',
      'Home of NY Giants and NY Jets',
      'Open air — weather can be extreme in July',
      'Built specifically to host major events',
    ],
    coordinates: { lat: 40.8135, lng: -74.0745 },
  },
  'AT&T Stadium': {
    name: 'AT&T Stadium', city: 'Arlington', country: 'USA', capacity: 80000,
    surface: 'Retractable artificial turf', opened: 2009, cost: '$1.3 billion',
    host: '8 matches including a semifinal',
    facts: [
      'Climate-controlled dome — no weather issues for players or fans',
      'The roof opens in just 18 minutes',
      'Has the world\'s largest HD video screen (160m wide)',
      'Known as "Jerry World" after owner Jerry Jones',
    ],
    coordinates: { lat: 32.7473, lng: -97.0945 },
  },
  'SoFi Stadium': {
    name: 'SoFi Stadium', city: 'Inglewood', country: 'USA', capacity: 70240,
    surface: 'Artificial turf', opened: 2020, cost: '$5.5 billion (most expensive ever)',
    host: '8 matches',
    facts: [
      'Most expensive stadium ever constructed',
      '70,000 sq ft HD screen wrapping the seating bowl',
      'Fully enclosed but not climate controlled',
      'Home of LA Rams and LA Chargers',
    ],
    coordinates: { lat: 33.9535, lng: -118.3392 },
  },
  'Estadio Azteca': {
    name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523,
    surface: 'Natural grass', opened: 1966, cost: 'Renovated for $100M in 2023',
    host: '3 group stage matches',
    facts: [
      'Highest altitude WC venue at 2,240m — affects stamina significantly',
      'Only stadium to host 2 WC finals (1970 and 1986)',
      'Maradona\'s "Hand of God" goal was scored here in 1986',
      'Original capacity was 105,000 — reduced after 1985 earthquake',
    ],
    coordinates: { lat: 19.3029, lng: -99.1505 },
  },
};

function findTeam(id: string) { return TEAMS.find(t => t.id === id)!; }

const GROUP_DEFS: { id: string; name: string; teamIds: string[] }[] = [
  { id: 'A', name: 'Group A', teamIds: ['USA', 'PAN', 'CMR', 'ALG'] },
  { id: 'B', name: 'Group B', teamIds: ['MEX', 'ECU', 'IDN', 'UKR'] },
  { id: 'C', name: 'Group C', teamIds: ['ARG', 'CHL', 'PER', 'ALB'] },
  { id: 'D', name: 'Group D', teamIds: ['FRA', 'ENG', 'SRB', 'KOR'] },
  { id: 'E', name: 'Group E', teamIds: ['ESP', 'BRA', 'JPN', 'MAR'] },
  { id: 'F', name: 'Group F', teamIds: ['GER', 'POR', 'COL', 'NZL'] },
  { id: 'G', name: 'Group G', teamIds: ['NED', 'SEN', 'EGY', 'CRC'] },
  { id: 'H', name: 'Group H', teamIds: ['BEL', 'CRO', 'URU', 'PAR'] },
  { id: 'I', name: 'Group I', teamIds: ['ITA', 'KSA', 'VEN', 'CAN'] },
  { id: 'J', name: 'Group J', teamIds: ['SUI', 'NGA', 'RSA', 'GUA'] },
  { id: 'K', name: 'Group K', teamIds: ['IRN', 'AUS', 'GHA', 'CZE'] },
  { id: 'L', name: 'Group L', teamIds: ['POL', 'HON', 'UZB', 'COD'] },
];

function buildGroupMatches(teamIds: string[], groupId: string): Match[] {
  const t = teamIds.map(findTeam);
  const pairs: [number, number][] = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
  return pairs.map(([a, b], i) => ({
    id: `g${groupId}-${i}`,
    homeTeam: t[a], awayTeam: t[b],
    homeScore: null, awayScore: null,
    status: 'NS' as const, stadium: STADIUM_NAMES[i % 4],
    city: STADIUM_CITIES[i % 4], date: `2026-06-${15 + i}`,
    time: MATCH_TIMES_G[i % 3], round: 'Group Stage',
    group: `Group ${groupId}`, events: [],
  }));
}

const STADIUM_NAMES = ['MetLife Stadium', 'AT&T Stadium', 'SoFi Stadium', 'Estadio Azteca'];
const STADIUM_CITIES = ['East Rutherford', 'Arlington', 'Inglewood', 'Mexico City'];
const MATCH_TIMES_G = ['14:00 ET', '17:00 ET', '20:00 ET'];

export const MOCK_GROUPS: Group[] = GROUP_DEFS.map(g => ({
  id: g.id,
  name: g.name,
  teams: g.teamIds.map(findTeam),
  standings: [],
  matches: buildGroupMatches(g.teamIds, g.id),
}));

export const TIMELINE_DAYS: TimelineDay[] = [
  {
    id: 1,
    label: 'Day 1',
    date: '2026-06-11',
    tag: 'Opening Day',
    upset: false,
    future: false,
    headline: 'The World Cup is alive. Mexico silence the doubters in a thundering Azteca opener.',
    narrative:
      'Estadio Azteca shook. 87,000 voices became one as Mexico dismantled Canada 3-1 in the tournament\'s opening match. Hirving Lozano rolled back the years with a brace, and Edson Álvarez controlled midfield like he owned it. In the late kickoff, the USA drew 1-1 with Switzerland — Christian Pulisic\'s free kick cancelled out by Granit Xhaka\'s volley. The tournament has begun. Nobody is safe.',
    matches: [
      { homeTeam: 'Mexico', homeFlag: '🇲🇽', awayTeam: 'Canada', awayFlag: '🇨🇦', homeScore: 3, awayScore: 1, note: 'Lozano brace lights up Azteca' },
      { homeTeam: 'USA', homeFlag: '🇺🇸', awayTeam: 'Switzerland', awayFlag: '🇨🇭', homeScore: 1, awayScore: 1, note: 'Pulisic free kick answered by Xhaka volley' },
    ],
    playerOfDay: { name: 'Hirving Lozano', flag: '🇲🇽', team: 'Mexico', stat: '2 goals, 1 assist, 9.2 rating' },
    stats: { goals: 5, upsets: 0, cards: 6, penalties: 0 },
    mood: [
      { team: 'Mexico', flag: '🇲🇽', positive: 94, negative: 6 },
      { team: 'Canada', flag: '🇨🇦', positive: 18, negative: 82 },
      { team: 'USA', flag: '🇺🇸', positive: 55, negative: 45 },
      { team: 'Switzerland', flag: '🇨🇭', positive: 62, negative: 38 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 4821 },
      { emoji: '😴', label: 'Dull', count: 312 },
      { emoji: '😱', label: 'Shocking', count: 1450 },
      { emoji: '🎉', label: 'Festival', count: 3200 },
    ],
  },
  {
    id: 2,
    label: 'Day 2',
    date: '2026-06-12',
    tag: 'Group Stage',
    upset: true,
    future: false,
    headline: 'Saudi Arabia do it again. Argentina stunned 2-1 in a carbon copy of Lusail 2022.',
    narrative:
      'History repeated itself in the most cruel way. Salem Al-Dawsari — who else — curled home the winner in the 87th minute as Saudi Arabia shocked Argentina for the second consecutive World Cup. Messi equalized from the spot, but it wasn\'t enough. Earlier, France coasted past Senegal 2-0 with Mbappé looking sharp. The group of death just got deadlier.',
    matches: [
      { homeTeam: 'Argentina', homeFlag: '🇦🇷', awayTeam: 'Saudi Arabia', awayFlag: '🇸🇦', homeScore: 1, awayScore: 2, note: 'Al-Dawsari 87\' — Lusail flashback' },
      { homeTeam: 'France', homeFlag: '🇫🇷', awayTeam: 'Senegal', awayFlag: '🇸🇳', homeScore: 2, awayScore: 0, note: 'Mbappé brace in comfortable win' },
    ],
    playerOfDay: { name: 'Salem Al-Dawsari', flag: '🇸🇦', team: 'Saudi Arabia', stat: '1 goal (87\'), 8.9 rating' },
    stats: { goals: 10, upsets: 1, cards: 11, penalties: 1 },
    mood: [
      { team: 'Saudi Arabia', flag: '🇸🇦', positive: 98, negative: 2 },
      { team: 'Argentina', flag: '🇦🇷', positive: 8, negative: 92 },
      { team: 'France', flag: '🇫🇷', positive: 82, negative: 18 },
      { team: 'Senegal', flag: '🇸🇳', positive: 22, negative: 78 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 6100 },
      { emoji: '😴', label: 'Dull', count: 89 },
      { emoji: '😱', label: 'Shocking', count: 8920 },
      { emoji: '🎉', label: 'Festival', count: 2100 },
    ],
  },
  {
    id: 3,
    label: 'Day 3',
    date: '2026-06-13',
    tag: 'Group Stage',
    upset: false,
    future: false,
    headline: 'Spain and England draw a classic. Yamal announces himself to the world.',
    narrative:
      'The Group C blockbuster delivered everything. Lamine Yamal, at just 18, skinned three England defenders and finished into the far corner — the goal of the tournament so far. Bellingham equalized with a trademark header. In the other match, Morocco ground out a 1-0 win over Costa Rica. Hakimi was everywhere. The Atlas Lions mean business again.',
    matches: [
      { homeTeam: 'Spain', homeFlag: '🇪🇸', awayTeam: 'England', awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', homeScore: 1, awayScore: 1, note: 'Yamal wondergoal, Bellingham header' },
      { homeTeam: 'Morocco', homeFlag: '🇲🇦', awayTeam: 'Costa Rica', awayFlag: '🇨🇷', homeScore: 1, awayScore: 0, note: 'Hakimi assist, defensive masterclass' },
    ],
    playerOfDay: { name: 'Lamine Yamal', flag: '🇪🇸', team: 'Spain', stat: '1 goal, 2 dribbles completed, 9.0 rating' },
    stats: { goals: 13, upsets: 1, cards: 15, penalties: 1 },
    mood: [
      { team: 'Spain', flag: '🇪🇸', positive: 78, negative: 22 },
      { team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', positive: 60, negative: 40 },
      { team: 'Morocco', flag: '🇲🇦', positive: 88, negative: 12 },
      { team: 'Costa Rica', flag: '🇨🇷', positive: 15, negative: 85 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 7300 },
      { emoji: '😴', label: 'Dull', count: 145 },
      { emoji: '😱', label: 'Shocking', count: 3100 },
      { emoji: '🎉', label: 'Festival', count: 5400 },
    ],
  },
  {
    id: 4,
    label: 'Day 4',
    date: '2026-06-14',
    tag: 'Group Stage',
    upset: true,
    future: false,
    headline: 'Japan stun Brazil. The group of death claims its first giant.',
    narrative:
      'Kubo, Mitoma, and relentless pressing. Japan did to Brazil what they did to Germany and Spain in 2022 — but this time it was even more emphatic. A 2-1 victory at MetLife Stadium that left the Seleção staring at early elimination. Germany beat Cameroon 3-0 in the late game, Musiala pulling the strings with a goal and two assists. Group A is chaos.',
    matches: [
      { homeTeam: 'Brazil', homeFlag: '🇧🇷', awayTeam: 'Japan', awayFlag: '🇯🇵', homeScore: 1, awayScore: 2, note: 'Kubo and Mitoma destroy Brazil\'s defense' },
      { homeTeam: 'Germany', homeFlag: '🇩🇪', awayTeam: 'Cameroon', awayFlag: '🇨🇲', homeScore: 3, awayScore: 0, note: 'Musiala 1G 2A, Germany cruise' },
    ],
    playerOfDay: { name: 'Takefusa Kubo', flag: '🇯🇵', team: 'Japan', stat: '1 goal, 1 assist, 9.1 rating' },
    stats: { goals: 19, upsets: 2, cards: 19, penalties: 1 },
    mood: [
      { team: 'Japan', flag: '🇯🇵', positive: 96, negative: 4 },
      { team: 'Brazil', flag: '🇧🇷', positive: 10, negative: 90 },
      { team: 'Germany', flag: '🇩🇪', positive: 85, negative: 15 },
      { team: 'Cameroon', flag: '🇨🇲', positive: 12, negative: 88 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 9200 },
      { emoji: '😴', label: 'Dull', count: 67 },
      { emoji: '😱', label: 'Shocking', count: 11400 },
      { emoji: '🎉', label: 'Festival', count: 4100 },
    ],
  },
  {
    id: 5,
    label: 'Day 5',
    date: '2026-06-15',
    tag: 'Group Stage',
    upset: false,
    future: true,
    headline: 'Day 5 awaits. Who writes the next chapter?',
    narrative:
      'Portugal face Netherlands in the Group D headliner — Ronaldo vs Van Dijk, experience vs dominance. Belgium meet Uruguay in what could be De Bruyne\'s last great tournament match. Every game is an elimination fight now. Every goal matters. The World Cup doesn\'t wait.',
    matches: [
      { homeTeam: 'Portugal', homeFlag: '🇵🇹', awayTeam: 'Netherlands', awayFlag: '🇳🇱', homeScore: 0, awayScore: 0, note: 'Ronaldo vs Van Dijk — 20:00 ET' },
      { homeTeam: 'Belgium', homeFlag: '🇧🇪', awayTeam: 'Uruguay', awayFlag: '🇺🇾', homeScore: 0, awayScore: 0, note: 'De Bruyne\'s last dance — 17:00 ET' },
    ],
    playerOfDay: undefined,
    stats: { goals: 19, upsets: 2, cards: 19, penalties: 1 },
    mood: [
      { team: 'Portugal', flag: '🇵🇹', positive: 65, negative: 35 },
      { team: 'Netherlands', flag: '🇳🇱', positive: 60, negative: 40 },
      { team: 'Belgium', flag: '🇧🇪', positive: 50, negative: 50 },
      { team: 'Uruguay', flag: '🇺🇾', positive: 55, negative: 45 },
    ],
    voteOptions: [
      { emoji: '🔥', label: 'Electric', count: 0 },
      { emoji: '😴', label: 'Dull', count: 0 },
      { emoji: '😱', label: 'Shocking', count: 0 },
      { emoji: '🎉', label: 'Festival', count: 0 },
    ],
  },
];

export interface TournamentHistoryPlayer {
  name: string;
  flag: string;
  team: string;
  photoUrl?: string;
  goals: number;
  assists: number;
  rating: number;
}

export interface TournamentHistoryTeam {
  id: string;
  name: string;
  flag: string;
  avgRating: number;
  goalsScored: number;
  goalsConceded: number;
  bigChances: number;
}

export interface TournamentHistoryEntry {
  year: number;
  host: string;
  hostFlag: string;
  winner: { name: string; flag: string; id: string };
  runnerUp: { name: string; flag: string; id: string };
  finalScore: string;
  topPlayers: TournamentHistoryPlayer[];
  topTeams: TournamentHistoryTeam[];
}

export const TOURNAMENT_HISTORY: TournamentHistoryEntry[] = [
  {
    year: 2022, host: 'Qatar', hostFlag: '🇶🇦',
    winner: { name: 'Argentina', flag: '🇦🇷', id: 'ARG' },
    runnerUp: { name: 'France', flag: '🇫🇷', id: 'FRA' },
    finalScore: '3-3 (4-2 pens)',
    topPlayers: [
      { name: 'Kylian Mbappé', flag: '🇫🇷', team: 'France', goals: 8, assists: 2, rating: 8.7 },
      { name: 'Lionel Messi', flag: '🇦🇷', team: 'Argentina', goals: 7, assists: 3, rating: 9.1 },
      { name: 'Olivier Giroud', flag: '🇫🇷', team: 'France', goals: 4, assists: 0, rating: 7.4 },
      { name: 'Julián Álvarez', flag: '🇦🇷', team: 'Argentina', goals: 4, assists: 1, rating: 7.9 },
      { name: 'Gonçalo Ramos', flag: '🇵🇹', team: 'Portugal', goals: 3, assists: 1, rating: 7.6 },
    ],
    topTeams: [
      { id: 'ARG', name: 'Argentina', flag: '🇦🇷', avgRating: 88, goalsScored: 15, goalsConceded: 8, bigChances: 22 },
      { id: 'FRA', name: 'France', flag: '🇫🇷', avgRating: 86, goalsScored: 16, goalsConceded: 8, bigChances: 20 },
      { id: 'CRO', name: 'Croatia', flag: '🇭🇷', avgRating: 84, goalsScored: 8, goalsConceded: 7, bigChances: 12 },
      { id: 'MAR', name: 'Morocco', flag: '🇲🇦', avgRating: 82, goalsScored: 6, goalsConceded: 2, bigChances: 10 },
      { id: 'BRA', name: 'Brazil', flag: '🇧🇷', avgRating: 86, goalsScored: 8, goalsConceded: 3, bigChances: 18 },
      { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', avgRating: 83, goalsScored: 13, goalsConceded: 4, bigChances: 16 },
      { id: 'NED', name: 'Netherlands', flag: '🇳🇱', avgRating: 82, goalsScored: 10, goalsConceded: 5, bigChances: 14 },
      { id: 'POR', name: 'Portugal', flag: '🇵🇹', avgRating: 83, goalsScored: 12, goalsConceded: 6, bigChances: 15 },
    ],
  },
  {
    year: 2018, host: 'Russia', hostFlag: '🇷🇺',
    winner: { name: 'France', flag: '🇫🇷', id: 'FRA' },
    runnerUp: { name: 'Croatia', flag: '🇭🇷', id: 'CRO' },
    finalScore: '4-2',
    topPlayers: [
      { name: 'Harry Kane', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team: 'England', goals: 6, assists: 0, rating: 7.8 },
      { name: 'Kylian Mbappé', flag: '🇫🇷', team: 'France', goals: 4, assists: 1, rating: 8.4 },
      { name: 'Antoine Griezmann', flag: '🇫🇷', team: 'France', goals: 4, assists: 2, rating: 8.2 },
      { name: 'Romelu Lukaku', flag: '🇧🇪', team: 'Belgium', goals: 4, assists: 1, rating: 7.5 },
      { name: 'Denis Cheryshev', flag: '🇷🇺', team: 'Russia', goals: 4, assists: 0, rating: 7.3 },
    ],
    topTeams: [
      { id: 'FRA', name: 'France', flag: '🇫🇷', avgRating: 87, goalsScored: 14, goalsConceded: 6, bigChances: 19 },
      { id: 'CRO', name: 'Croatia', flag: '🇭🇷', avgRating: 83, goalsScored: 14, goalsConceded: 9, bigChances: 15 },
      { id: 'BEL', name: 'Belgium', flag: '🇧🇪', avgRating: 86, goalsScored: 16, goalsConceded: 6, bigChances: 21 },
      { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', avgRating: 82, goalsScored: 12, goalsConceded: 8, bigChances: 14 },
      { id: 'BRA', name: 'Brazil', flag: '🇧🇷', avgRating: 85, goalsScored: 8, goalsConceded: 3, bigChances: 16 },
      { id: 'URU', name: 'Uruguay', flag: '🇺🇾', avgRating: 80, goalsScored: 7, goalsConceded: 3, bigChances: 10 },
    ],
  },
  {
    year: 2014, host: 'Brazil', hostFlag: '🇧🇷',
    winner: { name: 'Germany', flag: '🇩🇪', id: 'GER' },
    runnerUp: { name: 'Argentina', flag: '🇦🇷', id: 'ARG' },
    finalScore: '1-0 (AET)',
    topPlayers: [
      { name: 'James Rodríguez', flag: '🇨🇴', team: 'Colombia', goals: 6, assists: 2, rating: 8.6 },
      { name: 'Thomas Müller', flag: '🇩🇪', team: 'Germany', goals: 5, assists: 3, rating: 8.1 },
      { name: 'Neymar', flag: '🇧🇷', team: 'Brazil', goals: 4, assists: 1, rating: 8.0 },
      { name: 'Lionel Messi', flag: '🇦🇷', team: 'Argentina', goals: 4, assists: 1, rating: 8.5 },
      { name: 'Robin van Persie', flag: '🇳🇱', team: 'Netherlands', goals: 3, assists: 1, rating: 7.7 },
    ],
    topTeams: [
      { id: 'GER', name: 'Germany', flag: '🇩🇪', avgRating: 88, goalsScored: 18, goalsConceded: 4, bigChances: 24 },
      { id: 'ARG', name: 'Argentina', flag: '🇦🇷', avgRating: 85, goalsScored: 8, goalsConceded: 4, bigChances: 12 },
      { id: 'NED', name: 'Netherlands', flag: '🇳🇱', avgRating: 84, goalsScored: 15, goalsConceded: 4, bigChances: 18 },
      { id: 'BRA', name: 'Brazil', flag: '🇧🇷', avgRating: 83, goalsScored: 11, goalsConceded: 14, bigChances: 16 },
      { id: 'COL', name: 'Colombia', flag: '🇨🇴', avgRating: 82, goalsScored: 12, goalsConceded: 4, bigChances: 14 },
      { id: 'FRA', name: 'France', flag: '🇫🇷', avgRating: 81, goalsScored: 10, goalsConceded: 3, bigChances: 13 },
    ],
  },
  {
    year: 2010, host: 'South Africa', hostFlag: '🇿🇦',
    winner: { name: 'Spain', flag: '🇪🇸', id: 'ESP' },
    runnerUp: { name: 'Netherlands', flag: '🇳🇱', id: 'NED' },
    finalScore: '1-0 (AET)',
    topPlayers: [
      { name: 'Thomas Müller', flag: '🇩🇪', team: 'Germany', goals: 5, assists: 3, rating: 8.0 },
      { name: 'David Villa', flag: '🇪🇸', team: 'Spain', goals: 5, assists: 1, rating: 8.2 },
      { name: 'Wesley Sneijder', flag: '🇳🇱', team: 'Netherlands', goals: 5, assists: 1, rating: 8.4 },
      { name: 'Diego Forlán', flag: '🇺🇾', team: 'Uruguay', goals: 5, assists: 0, rating: 8.6 },
      { name: 'Asamoah Gyan', flag: '🇬🇭', team: 'Ghana', goals: 3, assists: 1, rating: 7.5 },
    ],
    topTeams: [
      { id: 'ESP', name: 'Spain', flag: '🇪🇸', avgRating: 89, goalsScored: 8, goalsConceded: 2, bigChances: 15 },
      { id: 'NED', name: 'Netherlands', flag: '🇳🇱', avgRating: 85, goalsScored: 12, goalsConceded: 6, bigChances: 16 },
      { id: 'GER', name: 'Germany', flag: '🇩🇪', avgRating: 86, goalsScored: 16, goalsConceded: 5, bigChances: 22 },
      { id: 'URU', name: 'Uruguay', flag: '🇺🇾', avgRating: 82, goalsScored: 11, goalsConceded: 5, bigChances: 13 },
      { id: 'BRA', name: 'Brazil', flag: '🇧🇷', avgRating: 84, goalsScored: 9, goalsConceded: 4, bigChances: 14 },
      { id: 'ARG', name: 'Argentina', flag: '🇦🇷', avgRating: 83, goalsScored: 10, goalsConceded: 6, bigChances: 12 },
    ],
  },
  {
    year: 2006, host: 'Germany', hostFlag: '🇩🇪',
    winner: { name: 'Italy', flag: '🇮🇹', id: 'ITA' },
    runnerUp: { name: 'France', flag: '🇫🇷', id: 'FRA' },
    finalScore: '1-1 (5-3 pens)',
    topPlayers: [
      { name: 'Miroslav Klose', flag: '🇩🇪', team: 'Germany', goals: 5, assists: 0, rating: 7.9 },
      { name: 'Hernán Crespo', flag: '🇦🇷', team: 'Argentina', goals: 3, assists: 1, rating: 7.5 },
      { name: 'Zinedine Zidane', flag: '🇫🇷', team: 'France', goals: 3, assists: 2, rating: 8.8 },
      { name: 'Thierry Henry', flag: '🇫🇷', team: 'France', goals: 3, assists: 1, rating: 7.8 },
      { name: 'Maxi Rodríguez', flag: '🇦🇷', team: 'Argentina', goals: 2, assists: 2, rating: 7.6 },
    ],
    topTeams: [
      { id: 'ITA', name: 'Italy', flag: '🇮🇹', avgRating: 86, goalsScored: 12, goalsConceded: 2, bigChances: 14 },
      { id: 'FRA', name: 'France', flag: '🇫🇷', avgRating: 85, goalsScored: 9, goalsConceded: 3, bigChances: 13 },
      { id: 'GER', name: 'Germany', flag: '🇩🇪', avgRating: 84, goalsScored: 14, goalsConceded: 6, bigChances: 18 },
      { id: 'ARG', name: 'Argentina', flag: '🇦🇷', avgRating: 84, goalsScored: 11, goalsConceded: 3, bigChances: 15 },
      { id: 'BRA', name: 'Brazil', flag: '🇧🇷', avgRating: 85, goalsScored: 10, goalsConceded: 3, bigChances: 16 },
      { id: 'POR', name: 'Portugal', flag: '🇵🇹', avgRating: 82, goalsScored: 7, goalsConceded: 5, bigChances: 10 },
    ],
  },
  {
    year: 2002, host: 'South Korea / Japan', hostFlag: '🇰🇷🇯🇵',
    winner: { name: 'Brazil', flag: '🇧🇷', id: 'BRA' },
    runnerUp: { name: 'Germany', flag: '🇩🇪', id: 'GER' },
    finalScore: '2-0',
    topPlayers: [
      { name: 'Ronaldo', flag: '🇧🇷', team: 'Brazil', goals: 8, assists: 0, rating: 8.9 },
      { name: 'Miroslav Klose', flag: '🇩🇪', team: 'Germany', goals: 5, assists: 1, rating: 7.8 },
      { name: 'Rivaldo', flag: '🇧🇷', team: 'Brazil', goals: 5, assists: 2, rating: 8.4 },
      { name: 'Jon Dahl Tomasson', flag: '🇩🇰', team: 'Denmark', goals: 4, assists: 0, rating: 7.4 },
      { name: 'Robbie Keane', flag: '🇮🇪', team: 'Ireland', goals: 3, assists: 1, rating: 7.3 },
    ],
    topTeams: [
      { id: 'BRA', name: 'Brazil', flag: '🇧🇷', avgRating: 90, goalsScored: 18, goalsConceded: 4, bigChances: 25 },
      { id: 'GER', name: 'Germany', flag: '🇩🇪', avgRating: 83, goalsScored: 14, goalsConceded: 3, bigChances: 16 },
      { id: 'KOR', name: 'South Korea', flag: '🇰🇷', avgRating: 76, goalsScored: 8, goalsConceded: 6, bigChances: 10 },
      { id: 'ESP', name: 'Spain', flag: '🇪🇸', avgRating: 82, goalsScored: 10, goalsConceded: 5, bigChances: 13 },
      { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', avgRating: 81, goalsScored: 6, goalsConceded: 3, bigChances: 11 },
      { id: 'SEN', name: 'Senegal', flag: '🇸🇳', avgRating: 75, goalsScored: 7, goalsConceded: 4, bigChances: 9 },
    ],
  },
];

export const FAN_IQ_LEVELS = [
  { level: 'Casual Fan', min: 0, max: 20 },
  { level: 'Football Nerd', min: 21, max: 40 },
  { level: 'Tactical Analyst', min: 41, max: 60 },
  { level: 'Scout', min: 61, max: 80 },
  { level: 'World Cup Oracle', min: 81, max: 100 },
];
