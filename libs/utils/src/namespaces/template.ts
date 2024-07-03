export const templatesList = [
  // Jai
  "orion",
  "legacy",
  "palette",
  "ignite",
  "joyful",
  "professional",
  "classic",
  "simple",
  "designer",
  // Vivek
  "majestic",
  "horizon",
  "elevate",
  "naruto",
  "nurture",
  "eternal",
  "innovate",
  // Vamsi
  "genesis",
  "nexus",
  "zenith",
  "pinnacle",
  "aurora",
  "maven",
  "vintage",
  "sleek",
  "equinox",
  // Old
  "azurill",
  "bronzor",
  "chikorita",
  "developerx",
  "ditto",
  "gengar",
  "glalie",
  "horizon",
  "kakuna",
  "leafish",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",

] as const;

export type Template = (typeof templatesList)[number];
