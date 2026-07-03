export const HONORIFICS = [
  "Mr", "Mr.", "Mrs", "Mrs.", "Ms", "Ms.", "Dr", "Dr.", "Prof", "Prof.", "Professor",
  "President", "Vice President", "Prime Minister", "PM", "Chief Minister", "CM",
  "Minister", "Senator", "Governor", "Mayor", "Justice", "Chief Justice",
  "Captain", "Coach", "Head Coach", "Skipper", "Chairman", "Chairwoman", "CEO",
  "Director", "Secretary", "General Secretary", "Spokesperson", "Ambassador",
  "General", "Colonel", "Sir", "Madam", "Speaker", "Officer", "Detective",
  "Analyst", "Researcher",
];

export const HONORIFIC_PATTERN = new RegExp(
  `\\b(${HONORIFICS.map((word) => word.replace(/\./g, "\\.")).join("|")})\\s+([A-Z][a-zA-Z'-]*(?:\\s+[A-Z][a-zA-Z'-]*){0,2})`,
  "g",
);

export const ORG_SUFFIXES = [
  "Board", "Council", "Ministry", "Party", "Commission", "Committee", "Bureau",
  "Authority", "Federation", "Association", "League", "Union", "Bank", "Corp",
  "Corporation", "Inc", "Ltd", "Limited", "Company", "Agency", "Department",
  "Institute", "University", "Court", "Cabinet", "Assembly", "Force", "Team",
  "Club", "Alliance", "Coalition", "Group",
];

export const KNOWN_ORG_ACRONYMS = new Set([
  "BCCI", "ICC", "UN", "WHO", "NASA", "ISRO", "FBI", "CIA", "NATO", "UEFA",
  "FIFA", "IPL", "NBA", "NFL", "IOC", "SEBI", "RBI", "IMF", "WTO", "EU",
  "NDA", "UPA", "BJP", "AAP", "PTI", "ECB", "PCB", "CSA", "NCA",
]);

export const VENUE_SUFFIXES = [
  "Stadium", "Arena", "Ground", "Oval", "Court", "Park", "Complex", "Palace",
  "Fort", "Temple", "Airport", "Auditorium", "Colosseum", "Coliseum",
  "Pavilion", "Field", "Centre", "Center",
];

export const VENUE_PATTERN = new RegExp(
  `\\b([A-Z][a-zA-Z'-]*(?:\\s+[A-Z][a-zA-Z'-]*){0,2}\\s+(?:${VENUE_SUFFIXES.join("|")}))\\b`,
  "g",
);
