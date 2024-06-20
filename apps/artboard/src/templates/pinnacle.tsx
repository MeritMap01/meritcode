import {
    Award,
    Certification,
    CustomSection,
    CustomSectionGroup,
    Education,
    Experience,
    Interest,
    Language,
    Project,
    Publication,
    Reference,
    SectionKey,
    SectionWithItem,
    Skill,
    URL,
    Profile,
    Volunteer,
} from "@reactive-resume/schema";
import { cn, isEmptyString, isUrl } from "@reactive-resume/utils";
import get from "lodash.get";
import React, { Fragment } from "react";

import { Picture } from "../components/picture";
import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";

const Header = () => {
    const basics = useArtboardStore((state) => state.resume.basics);
    const profiles = useArtboardStore((state) => state.resume.sections.profiles);
    const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);

    return (
        <div className="flex flex-row space-x-4 justify-between pb-5">
            <Picture className=" w-64 h-72 mr-6" />
            <div className="h-auto self-stretch w-0.5 bg-primary  text-center"></div>
            <div className="flex flex-col items-center gap-3 text-center w-[100%] justify-center">
                <h1 className="text-5xl font-bold tracking-widest text-primary">{basics.name.toUpperCase()}</h1>
                <p className="text-xl">{basics.headline}</p>
            </div>
        </div>
    );
};

const Summary = () => {
    const section = useArtboardStore((state) => state.resume.sections.summary);

    if (!section.visible || isEmptyString(section.content)) return null;

    return (
        <section id={section.id}>
            <div
                className="wysiwyg"
                style={{ columns: section.columns }}
                dangerouslySetInnerHTML={{ __html: section.content }}
            />
        </section>
    );
};

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => (
    <div className="flex items-center gap-x-1">
        {Array.from({ length: 5 }).map((_, index) => (
            <div
                key={index}
                className={cn("h-2.5 w-5 border border-primary", level > index && "bg-primary")}
            />
        ))}
    </div>
);

type LinkProps = {
    url: URL;
    icon?: React.ReactNode;
    label?: string;
    className?: string;
};

const Link = ({ url, icon, label, className }: LinkProps) => {
    if (!isUrl(url.href)) return null;

    return (
        <div className="flex items-center gap-x-1.5">
            {icon ?? <i className="ph ph-bold ph-link text-primary group-[.sidebar]:text-background" />}
            <a
                href={url.href}
                target="_blank"
                rel="noreferrer noopener nofollow"
                className={cn("inline-block", className)}
            >
                {label || url.label || url.href}
            </a>
        </div>
    );
};

type SectionProps<T> = {
    section: SectionWithItem<T> | CustomSectionGroup;
    children?: (item: T) => React.ReactNode;
    className?: string;
    urlKey?: keyof T;
    levelKey?: keyof T;
    summaryKey?: keyof T;
    keywordsKey?: keyof T;
};

const Section = <T,>({
    section,
    children,
    className,
    urlKey,
    levelKey,
    summaryKey,
    keywordsKey,
}: SectionProps<T>) => {
    if (!section.visible || !section.items.length) return null;

    const nameChanges = section.name === "Experience" ? "WORK EXPERIENCE" : section.name
    const changeStyles = section.name === "Experience" && "group-[.main]:text-center"
    const alignChanges = section.name === "Skills" ? "flex flex-wrap px-2  text-left -mx-2" : "grid gap-x-6 gap-y-3 pl-0 p-9 group-[.main]:pl-9"

    return (
        <section id={section.id} className="grid">
            <h4 className="mb-2 border-b border-t tracking-widest text-xl p-6 text-center border-primary font-bold text-primary">{nameChanges.toUpperCase()}</h4>

            <div
                className={`${changeStyles} ${alignChanges}`}
                style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
            >
                {section.items
                    .filter((item) => item.visible)
                    .map((item) => {
                        const url = (urlKey && get(item, urlKey)) as URL | undefined;
                        const level = (levelKey && get(item, levelKey, 0)) as number | undefined;
                        const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
                        const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

                        return (
                            <div key={item.id} className={cn("space-y-2", className)}>
                                <div>
                                    {children?.(item as T)}
                                    {url !== undefined && <Link url={url} />}
                                </div>

                                {summary !== undefined && !isEmptyString(summary) && (
                                    <div className="" dangerouslySetInnerHTML={{ __html: summary }} />
                                )}

                                {level !== undefined && level > 0 && <Rating level={level} />}

                                {keywords !== undefined && keywords.length > 0 && (
                                    <p className="text-sm">{keywords.join(", ")}</p>
                                )}
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};

const Profiles = () => {
    const section = useArtboardStore((state) => state.resume.sections.profiles);
    const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);

    return (
        <Section<Profile> section={section}>
            {(item) => (
                <div>
                    {isUrl(item.url.href) ? (
                        <Link
                            url={item.url}
                            label={item.username}
                            icon={
                                <img
                                    className="ph"
                                    width={fontSize}
                                    height={fontSize}
                                    alt={item.network}
                                    src={`https://cdn.simpleicons.org/${item.icon}`}
                                />
                            }
                        />
                    ) : (
                        <p>{item.username}</p>
                    )}
                    <p className="text-sm">{item.network}</p>
                </div>
            )}
        </Section>
    );
};

const Experience = () => {
    const section = useArtboardStore((state) => state.resume.sections.experience);

    return (
        <Section<Experience> section={section} summaryKey="summary">
            {(item) => (
                <div className="flex flex-col justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="flex justify-center">
                        <div className="font-bold">{item.company}</div>
                        <div>{item.position}</div>
                    </div>

                    <div className="flex justify-center">
                        <div className="font-bold">{item.date}</div>
                        <div>,{item.location}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

const Education = () => {
    const section = useArtboardStore((state) => state.resume.sections.education);

    return (
        <Section<Education> section={section} urlKey="url" summaryKey="summary">
            {(item) => (
                <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <div className="font-bold">{item.institution}</div>
                        <div>{item.area}</div>
                        <div>{item.score}</div>
                    </div>

                    <div className="shrink-0 text-right group-[.sidebar]:text-left">
                        <div className="font-bold">{item.date}</div>
                        <div>{item.studyType}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

const Awards = () => {
    const section = useArtboardStore((state) => state.resume.sections.awards);

    return (
        <Section<Award> section={section} urlKey="url" summaryKey="summary">
            {(item) => (
                <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <div className="font-bold">{item.title}</div>
                        <div>{item.awarder}</div>
                    </div>

                    <div className="shrink-0 text-right group-[.sidebar]:text-left">
                        <div className="font-bold">{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

const Certifications = () => {
    const section = useArtboardStore((state) => state.resume.sections.certifications);

    return (
        <Section<Certification> section={section} urlKey="url" summaryKey="summary">
            {(item) => (
                <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <div className="font-bold">{item.name}</div>
                        <div>{item.issuer}</div>
                    </div>

                    <div className="shrink-0 text-right group-[.sidebar]:text-left">
                        <div className="font-bold">{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

const Skills = () => {
    const section = useArtboardStore((state) => state.resume.sections.skills);

    return (
        <Section<Skill> section={section} levelKey="level" keywordsKey="keywords" className=" group-[.main]:w-[50%] px-2">
            {(item) => (
                <div>
                    <div className="flex items-center gap-2">
                        <i className="ph ph-bold ph-check-circle"></i>
                        <div className="font-bold">{item.name}</div>
                    </div>
                    <div>{item.description}</div>
                </div>
            )}
        </Section>
    );
};

const Interests = () => {
    const section = useArtboardStore((state) => state.resume.sections.interests);

    return (
        <Section<Interest> section={section} className="space-y-1" keywordsKey="keywords">
            {(item) => <div className="font-bold">{item.name}</div>}
        </Section>
    );
};

const Publications = () => {
    const section = useArtboardStore((state) => state.resume.sections.publications);

    return (
        <Section<Publication> section={section} urlKey="url" summaryKey="summary">
            {(item) => (
                <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <div className="font-bold">{item.name}</div>
                        <div>{item.publisher}</div>
                    </div>

                    <div className="shrink-0 text-right group-[.sidebar]:text-left">
                        <div className="font-bold">{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

const Volunteer = () => {
    const section = useArtboardStore((state) => state.resume.sections.volunteer);

    return (
        <Section<Volunteer> section={section} urlKey="url" summaryKey="summary">
            {(item) => (
                <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <div className="font-bold">{item.organization}</div>
                        <div>{item.position}</div>
                    </div>

                    <div className="shrink-0 text-right group-[.sidebar]:text-left">
                        <div className="font-bold">{item.date}</div>
                        <div>{item.location}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

const Languages = () => {
    const section = useArtboardStore((state) => state.resume.sections.languages);

    return (
        <Section<Language> section={section} levelKey="level">
            {(item) => (
                <div>
                    <div className="font-bold">{item.name}</div>
                    <div>{item.description}</div>
                </div>
            )}
        </Section>
    );
};

const Projects = () => {
    const section = useArtboardStore((state) => state.resume.sections.projects);

    return (
        <Section<Project> section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords">
            {(item) => (
                <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
                    <div className="text-left">
                        <div className="font-bold">{item.name}</div>
                        <div>{item.description}</div>
                    </div>

                    <div className="shrink-0 text-right group-[.sidebar]:text-left">
                        <div className="font-bold">{item.date}</div>
                    </div>
                </div>
            )}
        </Section>
    );
};

const References = () => {
    const section = useArtboardStore((state) => state.resume.sections.references);

    return (
        <Section<Reference> section={section} urlKey="url" summaryKey="summary">
            {(item) => (
                <div>
                    <div className="font-bold">{item.name}</div>
                    <div>{item.description}</div>
                </div>
            )}
        </Section>
    );
};

const Custom = ({ id }: { id: string }) => {
    const section = useArtboardStore((state) => state.resume.sections.custom[id]);
    const basics = useArtboardStore((state) => state.resume.basics);
    return (
        <Section<CustomSection>
            section={section}
            urlKey="url"
            summaryKey="summary"
            keywordsKey="keywords"
        >
            {(item) => (
                <div className="flex flex-col items-start gap-y-2 text-sm">
                    {basics.location && (
                        <div className="flex items-center gap-x-1.5">
                            <i className="ph ph-bold ph-map-pin" />
                            <div>{basics.location}</div>
                        </div>
                    )}
                    {basics.phone && (
                        <div className="flex items-center gap-x-1.5">
                            <i className="ph ph-bold ph-phone" />
                            <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer" className="no-underline">
                                {basics.phone}
                            </a>
                        </div>
                    )}
                    {basics.email && (
                        <div className="flex items-center gap-x-1.5">
                            <i className="ph ph-bold ph-at" />
                            <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                                {basics.email}
                            </a>
                        </div>
                    )}
                    {isUrl(basics.url.href) && <Link url={basics.url} />}
                    {basics.customFields.map((item) => (
                        <Fragment key={item.id}>
                            <div className="flex items-center gap-x-1.5">
                                <i className={cn(`ph ph-bold ph-${item.icon}`)} />
                                <span>{[item.name, item.value].filter(Boolean).join(": ")}</span>
                            </div>
                        </Fragment>
                    ))}
                </div>
            )}
        </Section>
    );
};

const mapSectionToComponent = (section: SectionKey) => {
    switch (section) {
        case "profiles":
            return <Profiles />;
        case "experience":
            return <Experience />;
        case "education":
            return <Education />;
        case "awards":
            return <Awards />;
        case "certifications":
            return <Certifications />;
        case "skills":
            return <Skills />;
        case "interests":
            return <Interests />;
        case "publications":
            return <Publications />;
        case "volunteer":
            return <Volunteer />;
        case "languages":
            return <Languages />;
        case "projects":
            return <Projects />;
        case "references":
            return <References />;
        default:
            if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

            return null;
    }
};

export const Pinnacle = ({ columns, isFirstPage = false }: TemplateProps) => {
    const [main, sidebar] = columns;

    return (
        <div className="p-custom space-y-3">
            {isFirstPage && <Header />}

            <div className="grid grid-cols-[1fr_auto_2fr]">
                <div className="sidebar group space-y-4">
                    {sidebar.map((section) => (
                        <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
                    ))}
                </div>
                <div className="w-0.5 bg-primary"></div>

                <div className="main group space-y-4">
                    {main.map((section) => (
                        <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};