export const templatesList = [
  "azurill",
  "bronzor",
  "chikorita",
  "ditto",
  "gengar",
  "glalie",
  "horizon",
  "kakuna",
  "leafish",
  "majestic",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
  "genesis",
  "nexus",
  "zenith",
  "legacy",
  "orion",
  "palette",
  "pinnacle"
] as const;

export type Template = (typeof templatesList)[number];
