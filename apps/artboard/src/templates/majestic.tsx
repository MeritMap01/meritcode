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
  import { cn, isEmptyString, isUrl } from "@reactive-resume/utils";
  import get from "lodash.get";
  import { Fragment } from "react";
  
  import { useArtboardStore } from "../store/artboard";
  import { TemplateProps } from "../types/template";
  const Header = () => {
    const basics = useArtboardStore((state) => state.resume.basics);
  
    return (
      <div className="flex flex-col items-center space-y-2 text-center">
        <div>
          <div className="text-2xl font-bold">{basics.name}</div>
          <div className="text-base">{basics.headline}</div>
        </div>
  
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-sm">
          {basics.location && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-map-pin text-primary" />
              <div>{basics.location}</div>
            </div>
          )}
          {basics.phone && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-phone text-primary" />
              <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                {basics.phone}
              </a>
            </div>
          )}
          {basics.email && (
            <div className="flex items-center gap-x-1.5">
              <i className="ph ph-bold ph-at text-primary" />
              <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                {basics.email}
              </a>
            </div>
          )}
          <Link url={basics.url} />
          {basics.customFields.map((item) => (
            <div key={item.id} className="flex items-center gap-x-1.5">
              <i className={cn(`ph ph-bold ph-${item.icon}`, "text-primary")} />
              <span>{[item.name, item.value].filter(Boolean).join(": ")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const Summary = () => {
    const section = useArtboardStore((state) => state.resume.sections.summary);
  
    if (!section.visible || isEmptyString(section.content)) return null;
  
    return (
      <section id={section.id}>
        <h2 className="mb-1 text-center text-lg font-bold">{section.name}</h2>
  
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
    <div className="flex items-center gap-x-1.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={cn("h-2 w-2 rounded-full border border-primary", level > index && "bg-primary")}
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
      <section id={section.id} className="mt-2  grid">
        <h2 className="mb-1 text-center text-lg font-bold">{section.name}</h2>
  
        <div
          className="grid gap-x-2"
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
                    <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: summary }} />
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
    if (!section.visible || !section.items.length) return null;
    return (
      <div className="max-w-5xl">
        <h2 className="mb-2 text-center text-lg font-bold">{section.name}</h2>
        <div className="grid grid-cols-3 gap-y-2">
          {section.items.map((item) => (
          <div className="col-span-1">
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
        ))}
        </div>
      </div>
    );
  };
  
  
  const Experience = () => {
    const section = useArtboardStore((state) => state.resume.sections.experience);
  
    return (
      <Section<Experience> section={section} urlKey="url" summaryKey="summary">
        {(item) => (
          <div className="flex flex-col justify-content-center items-start">
            <div className="flex flex-row justify-content-center items-center text-start">
              <div className="font-bold">{item.company}</div>
              <div> - {item.location} </div>
              {item.date && (<div ><span className="pl-1"> (</span>{item.date}<span>)</span></div>)}
              
            </div>
  
            <div className="shrink-0">
              <div>{item.position}</div>
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
          <div className="flex items-left">
            <div className="flex flex-row text-left">
              <div className="font-bold pr-2">{item.institution},</div>
              <div className="pr-2">{item.studyType},</div>
              <div>{item.score}</div>
              {item.date && (<div><span>(</span>{item.date}<span>)</span></div>)}
              
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
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-bold">{item.title}</div>
              <div>{item.awarder}</div>
            </div>
  
            <div className="shrink-0 text-right">
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
      <Section<Certification> section={section} urlKey="url" summaryKey="summary" className="flex flex-row">
        {(item) => (
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-bold">{item.name}</div>
              <div>{item.issuer}</div>
            </div>
  
            <div className="shrink-0 text-right">
              <div className="font-bold">{item.date}</div>
            </div>
          </div>
        )}
      </Section>
    );
  };
  
  const Skills = () => {
    const section = useArtboardStore((state) => state.resume.sections.skills);
  
    if (!section.visible || !section.items.length) return null;
  
    return (
      <div className="max-w-5xl mx-auto">
        <h2 className="mb-2 text-center text-lg font-bold">{section.name}</h2>
        <div className="grid grid-cols-3 gap-y-2">
          {section.items.map((item) => {
            const keywords = get(item, "keywords", []) as string[] | undefined;
            return (
              <div key={item.id} className="col-span-1">
                
                <div className="flex flex-col ">
                  <div className="flex">
                  <span className="h-1 w-1 rounded-full bg-black mt-2 mr-2"></span>
                <div className="text-left pr-2 font-bold">{item.name}</div>
                </div>
                <div className="ml-4">{item.description}</div>
                {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm ml-4">{keywords.join(", ")}</p>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  
  const Interests = () => {
    const section = useArtboardStore((state) => state.resume.sections.interests);
  
    return (
      <Section<Interest> section={section} keywordsKey="keywords" className="space-y-0.5">
        {(item) => <div className="font-bold">{item.name}</div>}
      </Section>
    );
  };
  
  const Publications = () => {
    const section = useArtboardStore((state) => state.resume.sections.publications);
  
    return (
      <Section<Publication> section={section} urlKey="url" summaryKey="summary">
        {(item) => (
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-bold">{item.name}: <span className="font-normal"> {item.publisher}</span></div>
             
            </div>
  
            <div className="shrink-0 text-right">
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
          <div>
           
              <div className="font-bold">{item.organization} <span className="font-normal">: {item.position}</span></div>
              
            
              <div>{item.date}</div>
              <div>{item.location}</div>
          </div>
        )}
      </Section>
    );
  };
  
  const Languages = () => {
    const section = useArtboardStore((state) => state.resume.sections.languages);
  
    return (
      <Section<Language> section={section}>
        {(item) => (
          <div className="space-y-0.5">
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
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-bold">{item.name}</div>
              <div>{item.description}</div>
            </div>
  
            <div className="shrink-0 text-right">
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
  
    return (
      <Section<CustomSection>
        section={section}
        urlKey="url"
        summaryKey="summary"
        keywordsKey="keywords"
      >
        {(item) => (
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-bold">{item.name}</div>
              <div>{item.description}</div>
            </div>
  
            <div className="shrink-0 text-right">
              <div className="font-bold">{item.date}</div>
              <div>{item.location}</div>
            </div>
          </div>
        )}
      </Section>
    );
  };
  
  const mapSectionToComponent = (section: SectionKey) => {
    switch (section) {
      case "profiles":
        return <Profiles />;
      case "summary":
        return <Summary />;
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
  
  export const Majestic = ({ columns, isFirstPage = false }: TemplateProps) => {
    const [main, sidebar] = columns;
  
    return (
      <div className="flex flex-col overflow-wrap-anywhere p-custom space-y-4 m-10">
        {isFirstPage && <Header />}
  
        {main.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
  
        {sidebar.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>
    );
  };
  