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
  
  import { Picture } from "../components/picture";
  import { useArtboardStore } from "../store/artboard";
  import { TemplateProps } from "../types/template";
  
  const Header = () => {
    const basics = useArtboardStore((state) => state.resume.basics);
    const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);
    return (
      <div className="flex items-center space-x-4 border-b">  
        <div className="space-y-2 text-left m-10 ml-0  ">
            <div className="text-5xl tracking-normal font-bold mb-4" style={{ color: primaryColor }}>
              {basics.name}
            </div>
            <div className="text-3xl " style={{ color: primaryColor }}>
              {basics.headline}
            </div>
        </div>
        <Picture className="mt-2 mb-2" />
      </div>
    );
  };
  
  const Summary = () => {
    const section = useArtboardStore((state) => state.resume.sections.summary);
  
    if (!section.visible || isEmptyString(section.content)) return null;
  
    return (
      <section id={section.id} className="flex flex-col p-4 pl-0 pr-0">
        <div className="m-auto ml-0">
          <h4 className="text-base tracking-normal font-bold text-primary">{section.name}</h4>
        </div>
        <div
          className="wysiwyg"
          style={{ columns: section.columns }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </section>
    );
  };

  const Contact = () =>{
    const basics = useArtboardStore((state) => state.resume.basics);
    return(
      <div className="mt-6 border-l p-8">
  <div className="flex flex-col items-start flex-wrap justify-center gap-x-2 gap-y-2 text-sm">
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
    )
  }
  
  
  type RatingProps = { level: number };
  
  const Rating = ({ level }: RatingProps) => (
    <div className="flex items-center gap-x-1.5">
      <div className="w-2/5 h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-primary "
          style={{ width: `${(level / 5) * 100}%` }}
        />
      </div>
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
      <section id={section.id} className="grid grid-cols-5 border-b pt-2.5">
        <div>
          <h4 className="text-base tracking-normal font-bold text-primary">{section.name}</h4>
        </div>
  
        <div
          className={cn(section.id === "skills" || section.id === "interests" ? "flex flex-wrap gap-x-9 gap-y-6 col-span-4 mb-4" : "col-span-4 grid gap-x-6 gap-y-3 mb-4")}
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
  
    return (
      <Section<Profile> section={section}>
        {(item) => (
          <div className="flex gap-2 items-center">
            {isUrl(item.url.href) ? (
              <Link
                url={item.url}
                label={item.username}
                icon={item.icon &&
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
          <div className="flex justify-between">
            <div className="text-left">
              <div className="font-bold">{item.company}</div>
              <div className="flex items-center">
              <div className="m-2 ml-0">{item.position}</div>
              <div style={{ height: '20px', width: '1px', backgroundColor: 'black' }}></div>
              <div className="m-2">{item.date}</div>
            </div>
            <div>{item.location}</div>
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
          <div className="flex items-center justify-between">
            <div className="flex flex-col" >
              <div className="font-bold">{item.institution}</div>
              <div className="flex items-center">
              <div className="mr-2 italic">{item.area}</div>
              {item.date && <div >|</div>}
              <div className="m-2">{item.date}</div>
            </div>
              <div>{item.score}</div>
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
      <Section<Certification> section={section} urlKey="url" summaryKey="summary">
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
  
    return (
      <Section<Skill> section={section} levelKey="level" keywordsKey="keywords">
        {(item) => (
          <div className="space-y-0.5">
            <div className="font-bold">{item.name}</div>
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
              <div className="font-bold">{item.name}</div>
              <div>{item.publisher}</div>
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
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-bold">{item.organization}</div>
              <div>{item.position}</div>
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
  
  const Languages = () => {
    const section = useArtboardStore((state) => state.resume.sections.languages);
  
    return (
      <Section<Language> section={section} levelKey="level">
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
  
  export const Designer = ({ columns, isFirstPage = false }: TemplateProps) => {
    const [main, sidebar] = columns;
  
    return (
      <div className="p-custom space-y-4 min-h-[inherit] overflow-wrap-anywhere bg-[#fffef7] text-text relative">
        <div className="m-7">
        {isFirstPage && <Header />}
        <div className="flex flex-row items-start border-b">
            <div className="flex-1">{isFirstPage && <Summary/>}</div>
            <div className="flex-0 bg-black h-full mx-4"></div>
            <div className="flex-1 flex justify-center">{isFirstPage && <Contact/>}</div>
        </div>
        {isFirstPage && <div className="w-full h-0.5 bg-background"></div>}
        <div className="space-y-4">
          {main.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
         
          {sidebar.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>
        </div>
      </div>
    );
  };
  