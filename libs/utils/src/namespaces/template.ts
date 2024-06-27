export const templatesList = [
  // Jai
  "orion",
  "legacy",
  "palette",
  "ignite",
  "joyful",
  "professional",
  "classic",
  // Vivek
  "majestic",
  "horizon",
  "elevate",
  "naruto",
  "nurture",
  "eternal",
  // Vamsi
  "genesis",
  "nexus",
  "zenith",
  "pinnacle",
  "aurora",
  "maven",
  "vintage",
  "sleek",
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
