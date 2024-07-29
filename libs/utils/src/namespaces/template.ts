export const templatesList = [
  // Jai
  "orion",
  "legacy",
  "palette",
  "ignite",
  "joyful",
  "professional",
  "classic",
  "simple",
  "designer",
  // Vivek
  "majestic",
  "horizon",
  "elevate",
  "naruto",
  "nurture",
  "eternal",
  "innovate",
  // Vamsi
  "genesis",
  "nexus",
  "zenith",
  "pinnacle",
  "aurora",
  "maven",
  "vintage",
  "sleek",
  // Old
  "azurill",
  "bronzor",
  "chikorita",
  "developerx",
  "ditto",
  "gengar",
  "glalie",
  "kakuna",
  "leafish",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
  
] as const;

export const layoutsList = {
  //jai
    "orion": [[["summary", "skills", "experience", "education", "projects", "volunteer", "references"],
    ["certifications", "awards", "interests", "publications", "languages","profiles"]]],
    "legacy": [[["summary", "skills", "education", "experience", "projects", "profiles","volunteer", "references"],
    ["certifications", "awards", "publications", "interests", "languages"]]],
    "palette": [[[ "experience","education", "projects", "certifications", "awards", "volunteer", "references"],
    ["summary","skills", "profiles",   "interests",   "publications", "languages"]]],
    "ignite": [[["experience", "projects", "volunteer", "references"],
    [ "education","skills", "certifications", "profiles", "interests", "awards", "publications", "languages"]]],
    "joyful": [[["summary", "skills", "experience", "education", "projects", "volunteer", "references"],
    ["interests", "certifications", "awards", "publications", "languages","profiles"]]],
    "professional": [[["summary",  "experience", "projects", "volunteer", "references"],
    ["education","skills","certifications", "awards", "profiles", "publications", "interests", "languages"]]],
    "classic": [[["summary", "skills", "experience","education", "projects","volunteer", "references"],
    ["profiles",   "interests",   "publications", "languages", "certifications", "awards"]]],
    "simple": [[[ "summary", "experience", "projects","skills", "volunteer", "references"],
    ["education", "certifications", "awards", "profiles","interests","publications", "languages"]]],
    "designer": [[[ "summary", "experience", "education", "projects", "volunteer", "references"],
    ["profiles","skills","interests", "certifications", "awards", "publications", "languages"]]],
//vivek
    "majestic": [[["summary", "experience","education", "projects", "certifications", "awards", "volunteer", "references"],
    ["skills", "profiles",   "interests",   "publications", "languages"]]],
    "horizon": [[["experience", "projects",   "volunteer", "references"],
    [ "profiles","skills","certifications","education", "interests", "awards", "publications", "languages"]]],
    "elevate": [[["summary", "experience", "education", "projects", "volunteer", "references"],
    ["profiles", "skills","interests", "certifications", "awards", "publications", "languages"]]],
    "naruto": [[["summary",  "experience", "education","projects", "volunteer", "references"],
    ["skills","certifications", "awards", "profiles", "publications", "interests", "languages"]]],
    "nurture": [[["summary",  "experience","education", "projects","volunteer", "references"],
    ["profiles",  "skills", "interests",   "publications", "languages", "certifications", "awards"]]],
    "eternal": [[[ "summary","skills","projects", "experience", "education", "volunteer", "references"],
    ["profiles","interests", "certifications", "awards", "publications", "languages"]]],
    "innovate": [[[ "summary", "experience", "projects", "volunteer", "references"],
    ["profiles","skills","education", "certifications", "awards", "publications", "interests", "languages"]]],
//vamsi
    "genesis": [[["summary", "experience","education", "projects", "certifications", "awards", "volunteer", "references"],
    ["skills", "profiles",   "interests",   "publications", "languages"]]],
    "nexus": [[["experience", "projects",   "volunteer", "references"],
    [ "profiles","skills","certifications","education", "interests", "awards", "publications", "languages"]]],
    "zenith": [[["summary", "experience", "education", "projects", "volunteer", "references"],
    ["skills","interests", "certifications", "awards", "publications", "languages","profiles"]]],
    "pinnacle": [[["summary",  "experience", "education","projects", "certifications", "awards","volunteer", "references"],
    ["skills","profiles", "publications", "interests", "languages"]]],
    "aurora": [[["summary", "experience","education", "projects","volunteer", "references"],
    ["certifications", "awards", "skills", "profiles",   "interests",   "publications", "languages"]]],
    "maven": [[[ "summary", "education", "interests", "experience","projects", "volunteer", "references"],
    ["profiles","skills","certifications", "awards", "publications", "languages"]]],
    "vintage": [[[ "summary", "experience", "education", "projects", "volunteer", "references"],
    ["profiles","skills","interests", "certifications", "awards", "publications", "languages"]]],
    "sleek": [[[ "summary", "experience", "education", "projects", "volunteer", "references"],
    ["profiles","skills","interests", "certifications", "awards", "publications", "languages"]]],
//old
    "azurill": [[["summary", "experience","education", "projects", "certifications", "awards", "volunteer", "references"],
    ["skills", "profiles",   "interests",   "publications", "languages"]]],
    "bronzor": [[[ "profiles","summary", "experience", "education", "projects",   "volunteer", "references"],
    ["skills","certifications", "interests", "awards", "publications", "languages"]]],
    "chikorita": [[["summary", "experience", "education", "projects", "volunteer", "references"],
    ["skills","interests", "certifications", "awards", "publications", "languages","profiles"]]],
    "developerx": [[["summary",  "experience", "education","projects", "certifications", "awards","volunteer", "references"],
    ["skills","profiles", "publications", "interests", "languages"]]],
    "ditto": [[["summary", "skills", "experience","education", "projects","volunteer", "references"],
    ["profiles",   "interests",   "publications", "languages", "certifications", "awards"]]],
    "gengar": [[[ "summary", "experience", "education", "projects", "volunteer", "references"],
    ["profiles","skills","interests", "certifications", "awards", "publications", "languages"]]],
    "glalie": [[[ "summary", "experience", "education", "projects", "volunteer", "references"],
    ["profiles","skills","interests", "certifications", "awards", "publications", "languages"]]],
    "kakuna": [[["summary", "experience","education", "projects", "certifications", "awards", "volunteer", "references"],
    ["skills", "profiles",   "interests",   "publications", "languages"]]],
    "leafish": [[["experience", "projects",   "volunteer", "references"],
    [ "profiles","skills","certifications","education", "interests", "awards", "publications", "languages"]]],
    "nosepass": [[["summary", "experience", "education", "projects", "volunteer", "references"],
    ["skills","interests", "certifications", "awards", "publications", "languages","profiles"]]],
    "onyx": [[["summary",  "experience", "education","projects", "certifications", "awards","volunteer", "references"],
    ["skills","profiles", "publications", "interests", "languages"]]],
    "pikachu": [[["summary", "skills", "experience","education", "projects","volunteer", "references"],
    ["profiles",   "interests",   "publications", "languages", "certifications", "awards"]]],
    "rhyhorn": [[["profiles", "summary", "experience", "education", "projects", "volunteer", "references"],
    ["certifications","skills","interests", "awards", "publications", "languages"]]],
};

export const premiumList = {
  //jai
  "orion": true, "legacy": true, "palette": false, "joyful": false, "ignite": true, "professional": true, "classic": true, "simple": true, "designer": false,
  //vivek
  "majestic": false, "eternal": true, "naruto": true, "nurture": false, "elevate":true, "innovate":  false, "horizon": true, 
  //vamsi
  "genesis": false, "nexus": false, "zenith": false, "pinnacle": false, "aurora": true, "maven": true, "vintage": true, "sleek": false,
  //old
  "azurill": false, "bronzor": true, "chikorita": false, "developerx": false, "ditto": false, "gengar": false, "glalie": false, "kakuna": false, 
  "leafish": false, "nosepass": false, "onyx": true, "pikachu": false, "rhyhorn": true
}

export type Template = (typeof templatesList)[number];
