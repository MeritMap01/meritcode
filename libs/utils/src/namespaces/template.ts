export const templatesList = [
  "azurill",
  "bronzor",
  "chikorita",
  "ditto",
  "elevate",
  "gengar",
  "glalie",
  "kakuna",
  "leafish",
  "majestic",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
] as const;

export type Template = (typeof templatesList)[number];
