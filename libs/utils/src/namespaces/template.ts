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
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
  "genesis",
  "nexus",
  "legacy",
  "orion",
  "palette",
] as const;

export type Template = (typeof templatesList)[number];
