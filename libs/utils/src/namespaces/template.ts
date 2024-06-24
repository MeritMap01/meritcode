export const templatesList = [
  // Jai
  "orion",
  "legacy",
  "palette",
  "ignite",
  "joyful",
  // Vivek
  "majestic",
  "horizon",
  "elevate",
  "naruto",
  "nurture",
  // Vamsi
  "genesis",
  "nexus",
  "zenith",
  "pinnacle",
  "aurora",
  "maven",
  // Old
  "azurill",
  "bronzor",
  "chikorita",
  "developerx",
  "ditto",
  "gengar",
  "glalie",
  "kakuna",
  "leafish",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
] as const;

export type Template = (typeof templatesList)[number];
