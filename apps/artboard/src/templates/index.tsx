import { Template } from "@reactive-resume/utils";

import { Azurill } from "./azurill";
import { Bronzor } from "./bronzor";
import { Chikorita } from "./chikorita";
import { Ditto } from "./ditto";
import { Gengar } from "./gengar";
import { Glalie } from "./glalie";
import { Horizon } from "./horizon";
import { Kakuna } from "./kakuna";
import { Leafish } from "./leafish";
import { Majestic } from "./majestic"
import { Nosepass } from "./nosepass";
import { Onyx } from "./onyx";
import { Pikachu } from "./pikachu";
import { Rhyhorn } from "./rhyhorn";
import { Genesis } from "./genesis";
import { Nexus } from "./nexus";

export const getTemplate = (template: Template) => {
  switch (template) {
    case "azurill":
      return Azurill;
    case "nexus":
      return Nexus;
    case "genesis":
      return Genesis;
    case "bronzor":
      return Bronzor;
    case "chikorita":
      return Chikorita;
    case "ditto":
      return Ditto;
    case "gengar":
      return Gengar;
    case "glalie":
      return Glalie;
    case "horizon":
      return Horizon;
    case "kakuna":
      return Kakuna;
    case "leafish":
      return Leafish;
    case "majestic":
      return Majestic;
    case "nosepass":
      return Nosepass;
    case "onyx":
      return Onyx;
    case "pikachu":
      return Pikachu;
    case "rhyhorn":
      return Rhyhorn;
    default:
      return Onyx;
  }
};
