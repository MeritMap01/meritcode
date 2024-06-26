import {
    Award,
    Certification,
    CustomSection,
    CustomSectionGroup,
    Education,
    Experience,
    Interest,
    Language,
    Profile,
    Project,
    Publication,
    Reference,
    SectionKey,
    SectionWithItem,
    Skill,
    URL,
    Volunteer,
  } from "@reactive-resume/schema";
  import { cn, hexToRgb, isEmptyString, isUrl } from "@reactive-resume/utils";
  import get from "lodash.get";
  import React, { Fragment } from "react";
  
  import { useArtboardStore } from "../store/artboard";
  import { TemplateProps } from "../types/template";
  
  const Summary = () => {
    const section = useArtboardStore((state) => state.resume.sections.summary);
    const margin = useArtboardStore((state) => state.resume.metadata.page.margin);
    return (
        <div style={{ margin }}>
            <div className="grid">
                <h2 style={{ letterSpacing: '0.3em' }} className="mb-2 pb-3 text-xl border-b border-primary text-left font-bold text-primary">
                    {section.name.toUpperCase()}
                </h2>
                <div
                    className="wysiwyg text-left"
                    style={{ columns: section.columns }}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                />
            </div>
        </div>
    );
}


  const Header = () => {
    const basics = useArtboardStore((state) => state.resume.basics);
    // const flag = useArtboardStore((state) => state.resume.basics.picture.effects.hidden)
    const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);
    return (
      <div style={{ backgroundColor: primaryColor , color : "white"}} className="p-8">
        <div className="grid grid-cols-7">
        <div
          className="p-custom items-center space-x-8 col-span-4">
          <div className="space-y-3">
            <div className="flex flex-col">
              <div className="text-5xl font-bold tracking-widest mb-3">{basics.name.toUpperCase()}</div>
              <div style={{ color : "white"}} className="text-md font-medium text-primary tracking-widest">{basics.headline.toUpperCase()}</div>
            </div>
          </div>
  
          {/* {(!flag && true)? <Picture />:null} */}
        </div>
  
        <div className="p-custom space-y-3 col-span-3 pl-4" style={{ backgroundColor: hexToRgb(primaryColor, 0.4) }}>
          <div className="flex flex-col flex-wrap items-start gap-x-3 gap-y-0.5 text-sm">
            {basics.location && (
              <div className="flex flex-wrap items-center gap-x-1.5">
                <i className="ph ph-bold ph-map-pin text-primary"  style={{ color : "white"}}/>
                <div>{basics.location}</div>
              </div>
            )}
            {basics.phone && (
              <div className="flex items-center flex-wrap gap-x-1.5">
                <i className="ph ph-bold ph-phone text-primary" style={{ color : "white"}} />
                <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                  {basics.phone}
                </a>
              </div>
            )}
            {basics.email && (
              <div className="flex items-center flex-wrap gap-x-1.5">
                <i className="ph ph-bold ph-at text-primary"  style={{ color : "white"}}/>
                <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                  {basics.email}
                </a>
              </div>
            )}
            <Link url={basics.url} />
            {basics.customFields.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-x-1.5">
                <i className={cn(`ph ph-bold ph-${item.icon}`, "text-primary")}  style={{ color : "white"}}/>
                <span>{[item.name, item.value].filter(Boolean).join(": ")}</span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  };
  
  type RatingProps = { level: number };
  
  const Rating = ({ level }: RatingProps) => (
    <div className="flex items-center gap-x-1.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={cn("h-3 w-6 border-2 border-primary", level > index && "bg-primary")}
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
        {icon ?? <i className="ph ph-bold ph-link text-primary" />}
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
  
    return (
      <section id={section.id} className="grid">
        <h2 style={{ letterSpacing: '0.3em' }} className="mb-2 pb-3 text-xl border-b border-primary text-left font-bold text-primary">
          {section.name.toUpperCase()}
        </h2>
  
        <div
          className="grid gap-x-6 gap-y-1"
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
                  <div>{children?.(item as T)}</div>
  
                  {summary !== undefined && !isEmptyString(summary) && (
                    <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: summary }} />
                  )}
  
                  {level !== undefined && level > 0 && <Rating level={level} />}
  
                  {keywords !== undefined && keywords.length > 0 && (
                    <p className="text-sm">{keywords.join(", ")}</p>
                  )}
  
                  {url !== undefined && <Link url={url} />}
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
      <Section<Profile> section={section} className="">
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
      <Section<Experience> section={section} urlKey="url" summaryKey="summary">
        {(item) => (
          <div>
            <div  className="font-semibold">{item.company.toUpperCase()}</div>
            <div>{item.position}</div>
            <div>{item.date}</div>
            <div>{item.location}</div>
            
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
          <div>
            <div className="font-semibold">{item.institution.toUpperCase()}</div>
            <div>{item.area}</div>
            <div>{item.score}</div>
            <div>{item.studyType}</div>
            <div>{item.date}</div>
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
          <div>
            <div  className="font-semibold">{item.title.toUpperCase()}</div>
            <div>{item.awarder}</div>
            <div>{item.date}</div>
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
          <div>
            <div className="font-semibold">{item.name.toUpperCase()}</div>
            <div>{item.issuer}</div>
            <div >{item.date}</div>
          </div>
        )}
      </Section>
    );
  };
  
  const Skills = () => {
    const section = useArtboardStore((state) => state.resume.sections.skills);
  
    return (
      <Section<Skill> section={section} levelKey="level" keywordsKey="keywords">
        {(item) => (
          <div>
            <div className="font-semibold">{item.name.toUpperCase()}</div>
            <div>{item.description}</div>
          </div>
        )}
      </Section>
    );
  };
  
  const Interests = () => {
    const section = useArtboardStore((state) => state.resume.sections.interests);
  
    return (
      <Section<Interest> section={section} keywordsKey="keywords" className="space-y-0.5">
        {(item) => <div className="font-semibold">{item.name.toUpperCase()}</div>}
      </Section>
    );
  };
  
  const Publications = () => {
    const section = useArtboardStore((state) => state.resume.sections.publications);
  
    return (
      <Section<Publication> section={section} urlKey="url" summaryKey="summary">
        {(item) => (
          <div>
            <div className="font-semibold">{item.name.toUpperCase()}</div>
            <div>{item.publisher}</div>
            <div>{item.date}</div>
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
          <div>
            <div className="font-semibold">{item.organization.toUpperCase()}</div>
            <div>{item.position}</div>
            <div>{item.location}</div>
            <div>{item.date}</div>
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
            <div className="font-semibold">{item.name.toUpperCase()}</div>
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
          <div>
            <div>
              <div className="font-semibold">{item.name.toUpperCase()}</div>
              <div>{item.description}</div>
              <div>{item.date}</div>
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
            <div className="font-semibold">{item.name.toUpperCase()}</div>
            <div>{item.description}</div>
          </div>
        )}
      </Section>
    );
  };
  
  const Custom = ({ id }: { id: string }) => {
    const section = useArtboardStore((state) => state.resume.sections.custom[id]);
  
    return (
      <Section<CustomSection>
        section={section}
        urlKey="url"
        summaryKey="summary"
        keywordsKey="keywords"
      >
        {(item) => (
          <div>
            <div>
              <div className="font-semibold">{item.name.toUpperCase()}</div>
              <div>{item.description}</div>
              <div>{item.location}</div>
              <div>{item.date}</div>
            </div>
          </div>
        )}
      </Section>
    );
  };
  
  const mapSectionToComponent = (section: SectionKey) => {
    switch (section) {
      case "experience":
        return <Experience />;
      case "education":
        return <Education />;
      case "awards":
        return <Awards />;
      case "certifications":
        return <Certifications />;
      case "profiles":
        return <Profiles/>;
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
  
  export const Horizon = ({ columns, isFirstPage = false }: TemplateProps) => {
    const [main, sidebar] = columns;
  
    return (
      <div>
        {isFirstPage && <Header />}
        {isFirstPage && <Summary/>}

        <div className="p-custom grid grid-cols-6 items-start space-x-6">
          <div className="grid gap-y-4 col-span-2 overflow-wrap-anywhere">
            {sidebar.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </div>
          <div className="grid gap-y-4 col-span-4 overflow-wrap-anywhere">
            {main.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  