import {
    Award,
    Certification,
    CustomSection,
    CustomSectionGroup,
    // Education,
   // Experience,
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
        <div className="text-center border-b-2 border-gray-400 p-6 pt-10 space-y-4">
      <h1 className="text-6xl font-extrabold tracking-wide">{basics.name.toUpperCase()}</h1>
      <div className="text-2xl text-center text-gray-600 overflow-wrap-anywhere tracking-widest">{basics.headline}</div>
    </div>
    );
  };

  const Contact = () => {
    const basics = useArtboardStore((state) => state.resume.basics);
  
    return (
      <section className="m-2 mt-0 p-2 space-y-2">
        <h2 className="font-bold border-b-2 border-gray-400 tracking-widest text-xl mb-5 pb-1">CONTACT</h2>
        <div className="space-y-1 text-sm">
          {
            basics.phone && 
            <div className="flex items-center space-x-4 overflow-wrap-anywhere">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="10" height="10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                 </svg>
                 <div>{basics.phone}</div> 
            </div>
          }
          {basics.email && 
          <div className="flex items-center space-x-4 overflow-wrap-anywhere">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="10" height="10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
            </svg>
            <div>{basics.email}</div>
            </div>
            }
          {basics.location &&
          <div className="flex items-center space-x-4 overflow-wrap-anywhere">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="10" height="10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>

          <div>{basics.location}</div>
          </div>}
          {basics.url.href && 
          (
            <div className="flex items-center space-x-4 overflow-wrap-anywhere">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="10" height="10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>

              <a href={basics.url.href} target="_blank" rel="noreferrer">
                {basics.url.href}
              </a>
            </div>
          )}
        </div>
      </section>
    );
  };
  

  const Summary = () => {
    const section = useArtboardStore((state) => state.resume.sections.summary);
  
    if (!section.visible || isEmptyString(section.content)) return null;
  
    return (
        <section className="m-4">
            <h2 className="font-bold border-b-2 border-gray-400 tracking-widest text-xl mb-5 pb-1">{section.name.toUpperCase()}</h2>
            <div
            className="wysiwyg overflow-wrap-anywhere"
            dangerouslySetInnerHTML={{ __html: section.content }} />
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
      <section id={section.id} className="grid ml-4">
        <div className="m-2 ml-0 font-bold  group-[.main]:block">
          <h4 className="tracking-widest border-b-2 border-gray-400 mb-5 pb-1 text-xl">{section.name.toUpperCase()}</h4>
        </div>
  
        <div className="mx-auto mb-2 ml-4 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
          <div className="h-1.5 w-1.5 rounded-full border border-primary" />
          <h4>{section.name.toUpperCase()}</h4>
          <div className="h-1.5 w-1.5 rounded-full border border-primary" />
        </div>
  
        <div
          className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto"
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
        <section className="p-4 overflow-wrap-anywhere">
        <h4 className="font-bold border-b-2 border-gray-400 tracking-widest text-xl mb-5 pb-1">{section.name.toUpperCase()}</h4>
        {section.items.map((item) => (
          <div key={item.id} className="mb-4 mt-3">
            <div className="flex items-center space-x-4">
                <h4 className="font-bold overflow-wrap-anywhere">{item.company.toUpperCase()}</h4>
                <p className="overflow-wrap-anywhere">{item.location&&"- "}{item.location}</p>
            </div>
            <div className="flex items-center space-x-4">
            <h4 className="font-bold ">{item.position}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div>{item.date&&"- "}{item.date}</div>
              </div>
            </div>
            <p className="overflow-wrap-anywhere text-left"> {item.url.href}</p>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
          </div>
        ))}
      </section>
    );
  };
  
  const Education = () => {
    const section = useArtboardStore((state) => state.resume.sections.education);
  
    return (
        <section className="p-4">
        <h4 className="font-bold border-b-2 text-xl border-gray-400 tracking-widest mb-5  pb-1">{section.name.toUpperCase()}</h4>
        {section.items.map((item) => (
          <div key={item.id} className="mb-4">
            <h4 className="text-l">{item.institution}</h4>
            <h4 className="text-l overflow-wrap-anywhere ">{item.studyType}</h4>
            <p>{item.area}</p>
            <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
            <div className="text-l font-bold shrink-0 text-left overflow-wrap-anywhere">{item.date}</div>          
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
            <div className="flex items-center space-x-12">
              <h4 className="font-bold overflow-wrap-anywhere">{item.name}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div>
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
    <section className="p-4">
      <h4 className="font-bold border-b-2 border-gray-400 tracking-widest text-xl mb-5 pb-1">{section.name.toUpperCase()}</h4>
      <ul className=" grid grid-cols-1 gap-2 mt-3 fas fa-caret-right list-inside">
        {section.items.map((item) => (
          <div className="flex items-center space-x-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="10" height="10">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <li  key={item.id}>{item.name}</li>
            </div>
        ))}
      </ul>
    </section>
    );
  };
  
  const Interests = () => {
    const section = useArtboardStore((state) => state.resume.sections.interests);
  
    return (
      <Section<Interest> section={section} keywordsKey="keywords" className="space-y-0.5">
        {(item) => <ul className="list-disc space-x-4 overflow-wrap-anywhere">
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
  
  export const Professional = ({ columns, isFirstPage = false }: TemplateProps) => {
    const [main, sidebar] = columns;
  
    return (
      <div className="pt-0 space-y-0">
        {isFirstPage && <Header />}
  
        <div className="flex flex-1 overflow-wrap ">
          
          <div className="w-1/3 p-4 space-y-2 max-w-full break-words overflow-wrap-anywhere">
            {isFirstPage && <Contact/>}
            {sidebar.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </div>
          <div className="mt-8 mb-8"style={{width: '1px', backgroundColor: 'rgb(156 163 175)' }}></div>
          <div className="flex-1 p-2 space-y-0 max-w-full break-words overflow-wrap-anywhere">
            {main.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  