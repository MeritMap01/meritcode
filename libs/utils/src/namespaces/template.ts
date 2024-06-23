export const templatesList = [
  "azurill",
  "bronzor",
  "chikorita",
  "ditto",
  "elevate",
  "gengar",
  "glalie",
  "horizon",
  "kakuna",
  "leafish",
  "majestic",
  "naruto",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
  "genesis",
  "nexus",
  "nurture",
  "zenith",
  "legacy",
  "orion",
  "palette",
  "ignite",
  "pinnacle"
] as const;

export type Template = (typeof templatesList)[number];
