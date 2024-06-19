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
  "legacy",
  "orion",
  "palette",
] as const;

export type Template = (typeof templatesList)[number];
