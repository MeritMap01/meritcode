import { Template } from "@reactive-resume/utils";

import { Azurill } from "./azurill";
import { Bronzor } from "./bronzor";
import { Chikorita } from "./chikorita";
import { Ditto } from "./ditto";
import { Gengar } from "./gengar";
import { Glalie } from "./glalie";
import { Kakuna } from "./kakuna";
import { Leafish } from "./leafish";
import { Legacy } from "./legacy";
import { Nosepass } from "./nosepass";
import { Onyx } from "./onyx";
import { Palette } from "./palette";
import { Pikachu } from "./pikachu";
import { Rhyhorn } from "./rhyhorn";
import {Orion} from "./orion";
import { Ignite } from "./ignite";

export const getTemplate = (template: Template) => {
  switch (template) {
    
    case "azurill":
      return Azurill;
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
    case "kakuna":
      return Kakuna;
    case "leafish":
      return Leafish;
    case "legacy":
      return Legacy;
    case "nosepass":
      return Nosepass;
    case "onyx":
      return Onyx;
    case "orion":
      return Orion;
    case "palette":
      return Palette;
    case "pikachu":
      return Pikachu;
    case "rhyhorn":
      return Rhyhorn;
    case "ignite":
      return Ignite;
    default:
      return Onyx;
  }
};
