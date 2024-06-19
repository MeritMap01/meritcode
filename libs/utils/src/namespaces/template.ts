export const templatesList = [
  "azurill",
  "bronzor",
  "chikorita",
  "ditto",
  "gengar",
  "glalie",
  "kakuna",
  "leafish",
  "legacy",
  "nosepass",
  "onyx",
  "orion",
  "palette",
  "pikachu",
  "rhyhorn",
] as const;

export type Template = (typeof templatesList)[number];
