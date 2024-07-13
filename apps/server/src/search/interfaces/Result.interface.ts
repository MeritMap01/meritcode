interface Css {
    value: string;
    visible: boolean;
}

interface PageOptions {
    breakLine: boolean;
    pageNumbers: boolean;
}

interface Page {
    format: string;
    margin: number;
    options: PageOptions;
}

interface Theme {
    text: string;
    primary: string;
    background: string;
}

type Layout = [string[], string[]];

interface Font {
    size: number;
    family: string;
    subset: string;
    variants: string[];
}

interface Typography {
    font: Font;
    hideIcons: boolean;
    lineHeight: number;
    underlineLinks: boolean;
}

interface Metadata {
    css: Css;
    page: Page;
    notes: string;
    theme: Theme;
    layout: Layout[];
    template: string;
    typography: Typography;
}

interface Picture {
    url: string;
    size: number;
    effects: {
        border: boolean;
        hidden: boolean;
        grayscale: boolean;
    };
    aspectRatio: number;
    borderRadius: number;
}

interface BasicInfo {
    url: { href: string; label: string };
    name: string;
    email: string;
    phone: string;
    picture: Picture;
    headline: string;
    location: string;
    customFields: any[];
}

interface Section {
    id: string;
    name: string;
    items: any[];
    columns: number;
    visible: boolean;
    content?: string;
}

interface Sections {
    [key: string]: Section;
}

export interface InputJson {
    basics: BasicInfo;
    sections: Sections;
    metadata: Metadata;
}

export interface OutputJson {
    basics: BasicInfo;
    sections: Sections;
}
