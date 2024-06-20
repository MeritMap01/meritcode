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
  "naruto",
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
