import {
    Award,
    Certification,
    CustomSection,
    CustomSectionGroup,
    // Education,
  //  Experience,
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
  import { cn, isEmptyString, isUrl, linearTransform } from "@reactive-resume/utils";
  import get from "lodash.get";
  import React, { Fragment } from "react";
  
  import { Picture } from "../components/picture";
  import { useArtboardStore } from "../store/artboard";
  import { TemplateProps } from "../types/template";
  
  const Header = () => {
    const basics = useArtboardStore((state) => state.resume.basics);
  
    return (
        <div className="relative bg-teal-400 text-white text-wrap p-6">
        <div className="p-custom flex items-center space-x-12">
          <div className="relative z-10 -mb-10">
            <div className="transform rotate-6 bg-yellow-300 p-2">
              <Picture />
            </div>
          </div>
          <div  className="overflow-wrap-anywhere mb-3">
            <h1 className="text-5xl font-bold break-all tracking-widest mb-2">{basics.name.toUpperCase()}</h1>
            <h2 className="text-2xl break-word">{basics.headline}</h2>
          </div>
          {/* <div className="overflow-wrap-anywhere">
             <h3 className="text-xl font-bold text-yellow-300">Get In Touch</h3>
             <p>Email: {basics.email}</p>
             <p>Website: {basics.url.href}</p>
             <p>Contact: {basics.phone}</p>
             <p>Address: {basics.location}</p></div> */}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-10">
            <path
              d="M0.00,49.98 
              C20.83,100 41.67,0 62.50,49.98 
              C83.33,100 104.17,0 125.00,49.98 
              C145.83,100 166.67,0 187.50,49.98 
              C208.33,100 229.17,0 250.00,49.98 
              C270.83,100 291.67,0 312.50,49.98 
              C333.33,100 354.17,0 375.00,49.98 
              C395.83,100 416.67,0 437.50,49.98 
              C458.33,100 479.17,0 500.00,49.98 
              L500.00,150.00 L0.00,150.00 Z"
              style={{ fill: 'white' }}
            />
          </svg>
        </div>
      </div>
    );
  };
  
  const Summary = () => {
    const section = useArtboardStore((state) => state.resume.sections.summary);
  
    if (!section.visible || isEmptyString(section.content)) return null;
  
    return (
        <section className="mt-7">
        <h3 className="text-xl font-bold text-teal-400 mb-4 tracking-widest">{section.name.toUpperCase()}</h3>
        <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: section.content }} />
        
      </section>
    );
  };
  
  type RatingProps = { level: number };
  
  const Rating = ({ level }: RatingProps) => (
    <div className="relative h-1 w-[128px] group-[.sidebar]:mx-auto">
      <div className="absolute inset-0 h-1 w-[128px] rounded bg-primary opacity-25" />
      <div
        className="absolute inset-0 h-1 rounded bg-primary"
        style={{ width: linearTransform(level, 0, 5, 0, 128) }}
      />
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
        <div className="mb-4 mt-7 tracking-wider font-bold text-teal-400 group-[.main]:block">
          <h4 className="tracking-widest text-xl">{section.name.toUpperCase()}</h4>
        </div>
  
        <div className="mx-auto mb-2  hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
          <div className="h-1.5 w-1.5 rounded-full border border-primary" />
          <h4>{section.name}</h4>
          <div className="h-1.5 w-1.5 rounded-full border border-primary" />
        </div>
  
        <div
          className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto  group-[.sidebar]:text-center"
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
                <div
                  key={item.id}
                  className={cn(
                    "relative space-y-2",
                    "border-primary group-[.main]:border-l group-[.main]:pl-4",
                    className,
                  )}
                >
                  <div>{children?.(item as T)}</div>
  
                  {summary !== undefined && !isEmptyString(summary) && (
                    <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: summary }} />
                  )}
  
                  {level !== undefined && level > 0 && <Rating level={level} />}
  
                  {keywords !== undefined && keywords.length > 0 && (
                    <p className="text-sm">{keywords.join(", ")}</p>
                  )}
  
                  {url !== undefined && <Link url={url} />}
  
                  <div className="absolute left-[-4.5px] top-px hidden h-[8px] w-[8px] rounded-full bg-primary group-[.main]:block" />
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
        <section className="overflow-wrap-anywhere">
        <h3 className="text-xl font-bold text-teal-400 mt-7 mb-4 tracking-widest">{section.name.toUpperCase()}</h3>
        {section.items.map((item) => (
          <div key={item.id} className="mb-4">
            <h4 className="font-bold text-xl text-yellow-300 tracking-widest">{item.position}</h4>
            <div className="flex items-center justify-between space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.company} | {item.date}</h4>
              {/* <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div> */}
            </div>
            <p className="overflow-wrap-anywhere mb-4">{item.location}  {item.url.href}</p>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
          </div>
        ))}
      </section>
    );
  };
  
  const Education = () => {
    const section = useArtboardStore((state) => state.resume.sections.education);
  
    return (
        <section >
        <h3 className="text-xl font-bold text-teal-400 mt-7 mb-4 tracking-widest">{section.name.toUpperCase()}</h3>
        {section.items.map((item) => (
          <div key={item.id} className="mb-4">
            <h4 className="font-bold text-xl text-yellow-300 tracking-widest">{item.institution}</h4>
            <div className="flex items-center justify-between space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.studyType} | {item.date}</h4>
              {/* <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div> */}
            </div>
            <p>{item.area}</p>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
          </div>
        ))}
      </section>
    );
  };
  
  const Awards = () => {
    const section = useArtboardStore((state) => state.resume.sections.awards);
  
    return (
      <Section<Award> section={section} urlKey="url" summaryKey="summary">
        {(item) => (
          <div>
            <div className="flex items-center space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.title}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div>
            </div>
            <div>{item.awarder}</div>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
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
          <div className="overflow-wrap-anywhere">
            <div className="flex items-center justify-between space-x-12">
            <h4 className="font-bold break-words">
  {item.name}
  {item.date && <span> - {item.date}</span>}
</h4>
            </div>
            <div>{item.issuer}  </div>
            <div> {item.url.href}</div>
            
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
          </div>
        )}
      </Section>
    );
  };
  
  const Skills = () => {
    const section = useArtboardStore((state) => state.resume.sections.skills);
  
    return (
<section>
      <h3 className="text-xl font-bold text-teal-400 mb-5 mt-7 tracking-widest">{section.name.toUpperCase()}</h3>
      <ul className="mt-2 grid grid-cols-1 gap-2 list-disc list-inside">
        {section.items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </section>
    );
  };
  
  const Interests = () => {
    const section = useArtboardStore((state) => state.resume.sections.interests);
  
    return (
      <Section<Interest> section={section} keywordsKey="keywords" className="space-y-0.5">
        {(item) => <ul className="overflow-wrap-anywhere">
                        <li className="font-bold">{item.name}</li>
                   </ul>}
      </Section>
    );
  };
  
  const Publications = () => {
    const section = useArtboardStore((state) => state.resume.sections.publications);
  
    return (
      <Section<Publication> section={section} urlKey="url" summaryKey="summary">
        {(item) => (
          <div>
            <div className="flex items-center space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.name}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div>
            </div>
            <div>{item.publisher}</div>
            <div className="overflow-wrap-anywhere">{item.url.href}</div>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
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
          <div className="overflow-wrap-anywhere">
            <div className="font-bold">{item.organization}</div>
            <div className="flex items-center space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.position}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div>
            </div>
            <div >{item.location} </div>
            <div> {item.url.href}</div>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
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
            <div className="font-bold text-yellow-300">{item.name}</div>
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
            <div className="flex items-center space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.name}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div>
            </div>
            <div className="overflow-wrap-anywhere">{item.url.href}</div>
              <div>{item.description}</div>
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
            <div className="font-bold text-yellow-300">{item.name}</div>
            <div>{item.description}</div>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
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
            <div className="flex items-center space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.name}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div>
            </div>
              <div>{item.description}</div>
              <div>{item.location}</div>
              <div>{item.url.href}</div>
              <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
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
  
  export const Joyful = ({ columns, isFirstPage = false }: TemplateProps) => {
    const [main, sidebar] = columns;
    const basics = useArtboardStore((state) => state.resume.basics);
    const margin = useArtboardStore((state)=>state.resume.metadata.page.margin)
    return (
      <div className="pt-0 space-y-0">
        {isFirstPage && <Header />}
  
        <div className="flex flex-1 overflow-wrap " style={{margin:margin}}>
          
          <div className="w-2/5 space-y-2 max-w-full overflow-wrap-anywhere pr-8">
            {sidebar.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
            <div className="overflow-wrap-anywhere">
             <h3 className="text-xl font-bold text-teal-400 mb-4 mt-7 tracking-wider">GET IN TOUCH</h3>
             <p>Email: {basics.email}</p>
             <p>Website: {basics.url.href}</p>
             <p>Contact: {basics.phone}</p>
             <p>Address: {basics.location}</p>
            </div>
          </div>
          <div className="flex-1 space-y-0 space-x-5 max-w-full overflow-wrap-anywhere">
            {main.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  