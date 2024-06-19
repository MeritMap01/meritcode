import { Template } from "@reactive-resume/utils";

import { Azurill } from "./azurill";
import { Bronzor } from "./bronzor";
import { Chikorita } from "./chikorita";
import { Ditto } from "./ditto";
import { Elevate } from "./elevate";
import { Eternal } from "./eternal";
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
import { Naruto } from "./naruto";
import { Nexus } from "./nexus";
import { Nurture } from "./nurture";
import { Legacy } from "./legacy";
import { Orion } from "./orion";
import { Palette } from "./palette";
import { Ignite } from "./ignite";
import { Innovate } from "./innovate";
import { Joyful } from "./joyful";
import { Zenith } from "./zenith";
import { Pinnacle } from "./pinnacle";
import { Aurora } from "./aurora"
import { Maven } from "./maven";
import { Professional } from "./professional";
import { Classic } from "./classic";
import { Vintage } from "./vintage";
import { Sleek } from "./sleek";
import { Simple } from "./simple";
import { Designer } from "./designer";




export const getTemplate = (template: Template) => {
  switch (template) {
    case "azurill":
      return Azurill;
    case "nexus":
      return Nexus;
    case "genesis":
      return Genesis;
    case "zenith":
      return Zenith;
    case "bronzor":
      return Bronzor;
    case "chikorita":
      return Chikorita;
    case "ditto":
      return Ditto;
    case "elevate":
      return Elevate;
    case "eternal":
      return Eternal;
    case "gengar":
      return Gengar;
    case "glalie":
      return Glalie;
    case "horizon":
      return Horizon;
    case "innovate":
      return Innovate;
    case "kakuna":
      return Kakuna;
    case "leafish":
      return Leafish;
    case "majestic":
      return Majestic;
    case "naruto":
      return Naruto;
    case "nosepass":
      return Nosepass;
    case "nurture":
      return Nurture;
    case "onyx":
      return Onyx;
    case "pikachu":
      return Pikachu;
    case "rhyhorn":
      return Rhyhorn;
    case "legacy":
      return Legacy;
    case "orion":
      return Orion;
    case "palette":
      return Palette;
    case "ignite":
      return Ignite;
    case "joyful":
      return Joyful;
    case "pinnacle":
      return Pinnacle;
    case "aurora":
      return Aurora;
    case "maven":
      return Maven;
    case "professional":
      return Professional;
    case "classic":
      return Classic;
    case "vintage":
      return Vintage;
    case "sleek":
      return Sleek;
    case "simple":
      return Simple;
    case "designer":
      return Designer;
    default:
      return Onyx;
  }
};
