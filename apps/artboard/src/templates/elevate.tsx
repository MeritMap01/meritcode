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
  import { cn, isEmptyString, isUrl, linearTransform } from "@reactive-resume/utils";
  import get from "lodash.get";
  import React, { Fragment } from "react";
  
//   import { Picture } from "../components/picture";
  import { useArtboardStore } from "../store/artboard";
  import { TemplateProps } from "../types/template";
  
  const Header = () => {
    const basics = useArtboardStore((state) => state.resume.basics);
    const color = useArtboardStore((state) => state.resume.metadata.theme.primary)
    return (
      <div className="flex flex-col items-center justify-center space-y-2 pb-2 text-center">
        {/* <Picture /> */}
        <div>
          <div className="text-5xl tracking-widest font-bold mb-4" >{basics.name.toUpperCase()}</div>
          <div className="text-md tracking-widest font-bold">{basics.headline.toUpperCase()}</div>
        </div>
  
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-sm">
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
        
  
        <div className="mb-2 hidden items-center gap-x-2 text-center font-bold text-primary">
          <div  />
          <h4>{section.name}</h4>
          <div  />
        </div>
  
        {/* <main className={cn("relative space-y-2", "border-l border-primary pl-4")}>
          <div className="absolute left-[-4.5px] top-[8px] hidden h-[8px] w-[8px] rounded-full bg-primary group-[.main]:block" />
   */}
          <div
            className="wysiwyg"
            style={{ columns: section.columns }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

        {/* </main> */}
      </section>
    );
  };
  
  type RatingProps = { level: number };
  
  const Rating = ({ level }: RatingProps) => (
    <div className="relative h-1 w-[128px]">
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
        <div className="group-[.sidebar]:mt-2 mb-2 font-bold text-primary  items-center flex ">
  <h4 className="tracking-widest flex-[1_1_0%]">{section.name.toUpperCase()}</h4>
  <div className="flex-[4_1_0%]">
    <hr className="border-t-2 border-primary"/>
  </div>
</div>


  
        <div
          className={cn("grid gap-x-6 gap-y-3 border-primary group-[.main]:border-l group-[.sidebar]:text-left",className)}
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
                    " group-[.main]:pl-4   ",
                    className,
                  )}
                >
                  <div>{children?.(item as T)}</div>
                <div className="group-[.main]:col-span-4">
                  {summary !== undefined && !isEmptyString(summary) && (
                    <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: summary }} />
                  )}
  
                  {level !== undefined && level > 0 && <Rating level={level} />}
  
                  {keywords !== undefined && keywords.length > 0 && (
                    <p className="text-sm">{keywords.join(", ")}</p>
                  )}
  
                  {url !== undefined && <Link url={url} />}
                    </div>
                  <div className="absolute left-[-4.5px] top-px hidden h-[8px] w-[8px] rounded-full bg-primary group-[.main]:block" />
                </div>
                
              );
            })}
        </div>
      </section>
    );
  };
  
  

  // const Profiles = () => {
  //   const section = useArtboardStore((state) => state.resume.sections.profiles);
  //   const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);
  
  //   return (
  //     <Section<Profile> section={section} className="grid grid-cols-3">
  //       {(item) => (
  //         <div className="grid col-span-1"> 
  //           {isUrl(item.url.href) ? (
  //             <Link
  //               url={item.url}
  //               label={item.username}
  //               icon={
  //                 <img
  //                   className="ph"
  //                   width={fontSize}
  //                   height={fontSize}
  //                   alt={item.network}
  //                   src={`https://cdn.simpleicons.org/${item.icon}`}
  //                 />
  //               }
  //             />
  //           ) : (
  //             <p>{item.username}</p>
  //           )}
  //           <p className="text-sm">{item.network}</p>
  //         </div>
  //       )}
  //     </Section>
    // );
  // };
  
  const Profiles = () => {
    const section = useArtboardStore((state) => state.resume.sections.profiles);
    const bcolor = useArtboardStore((state)=>state.resume.metadata.theme.primary);
    const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);
    if (!section.visible || !section.items.length) return null;
    return (
      <div className="mt-2 max-w-5xl mx-auto">
<div className="mb-2 font-bold text-primary  items-center flex ">
  <h4 className="tracking-widest flex-[1_1_0%]">{section.name.toUpperCase()}</h4>
  <div className="flex-[4_1_0%]">
    <hr className="border-t-2 border-primary"/>
  </div>
</div>        
        <div className="grid grid-cols-3 gap-y-2">
          {section.items.map((item) => (
          <div className="col-span-1 ml-3">
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
      <Section<Experience> section={section} urlKey="url" summaryKey="summary" className="grid grid-cols-5">
        {(item) => (
          <div>
            <div className="font-bold">{item.company}</div>
            <div>{item.position}</div>
            <div>{item.location}</div>
            <div>{item.date}</div>
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
            <div className="font-bold">{item.institution}</div>
            <div>{item.area}</div>
            <div>{item.score}</div>
            <div>{item.studyType}</div>
            <div className="font-bold">{item.date}</div>
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
            <div className="font-bold">{item.title}</div>
            <div>{item.awarder}</div>
            <div className="font-bold">{item.date}</div>
          </div>
        )}
      </Section>
    );
  };
  
  // const Certifications = () => {
  //   const section = useArtboardStore((state) => state.resume.sections.certifications);
  
  //   return (
  //     <Section<Certification> section={section} urlKey="url" summaryKey="summary">
  //       {(item) => (
  //         <div>
  //           <div className="font-bold">{item.name}</div>
  //           <div>{item.issuer}</div>
  //           <div className="font-bold">{item.date}</div>
  //         </div>
  //       )}
  //     </Section>
  //   );
  // };
  
  const Certifications = () => {
    const section = useArtboardStore((state) => state.resume.sections.certifications);
    const bcolor = useArtboardStore((state)=>state.resume.metadata.theme.primary);
    if (!section.visible || !section.items.length) return null;

  return(
    <div className="max-w-5xl mx-auto text-left">
<div className="mb-2 font-bold text-primary  items-center flex ">
  <h4 className="tracking-widest flex-[1_1_0%]">{section.name.toUpperCase()}</h4>
  <div className="flex-[4_1_0%]">
    <hr className="border-t-2 border-primary"/>
  </div>
</div>        <div className="grid grid-cols-3 gap-y-2">
        {section.items.map((item) => 
              <div key={item.id} className="col-span-1">
                <div className="flex">
                <span className="h-1 w-1 rounded-full bg-black mt-2 mr-2"></span>
                <div>
                <div className="font-bold">{item.name}</div>
              <div>{item.issuer}</div>
                <div className="font-bold">{item.date}</div>
                </div>
              </div>
              </div>
            )
          }
        </div>
      </div>
    );
  };

  // const Skills = () => {
  //   const section = useArtboardStore((state) => state.resume.sections.skills);
  
  //   return (
  //     <Section<Skill> section={section} levelKey="level" keywordsKey="keywords" className="grid grid-col-3">
  //       {(item) => (
  //         <div className="grid col-span-1">
  //           <div className="font-bold">{item.name}</div>
  //           <div>{item.description}</div>
  //         </div>
  //       )}
  //     </Section>
  //   );
  // };
  
  const Skills = () => {
    const section = useArtboardStore((state) => state.resume.sections.skills);
    const bcolor = useArtboardStore((state)=>state.resume.metadata.theme.primary);

    if (!section.visible || !section.items.length) return null;
  
    return (
      <div className="max-w-5xl mx-auto text-left mt-4">

<div className="mb-2 font-bold text-primary  items-center flex ">
  <h4 className="tracking-widest flex-[1_1_0%]">{section.name.toUpperCase()}</h4>
  <div className="flex-[4_1_0%]">
    <hr className="border-t-2 border-primary"/>
  </div>
</div>        <div className="grid grid-cols-3 gap-y-2">
          {section.items.map((item) => {
            const keywords = get(item, "keywords", []) as string[] | undefined;
            return (
              <div key={item.id} className="col-span-1">
                
                <div className="flex flex-col ">
                  <div className="flex">
                  <span className="h-1 w-1 rounded-full bg-black mt-2 mr-2"></span>
                  <div>
                <div className="text-left pr-2 font-bold">{item.name}</div>
               
                <div >{item.description}</div>
                {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm">{keywords.join(", ")}</p>
                )}
                 </div>
                </div>
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
          <div>
            <div className="font-bold">{item.name}</div>
            <div>{item.publisher}</div>
            <div className="font-bold">{item.date}</div>
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
            <div className="font-bold">{item.organization}</div>
            <div>{item.position}</div>
            <div>{item.location}</div>
            <div className="font-bold">{item.date}</div>
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
              <div className="font-bold">{item.name}</div>
              <div>{item.description}</div>
  
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
          <div>
            <div>
              <div className="font-bold">{item.name}</div>
              <div>{item.description}</div>
  
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
  
  export const Elevate = ({ columns, isFirstPage = false }: TemplateProps) => {
    const [main, sidebar] = columns;
  
    return (
      <div className="p-custom space-y-3">
        {isFirstPage && <Header />}
  
        <div>
        <div className="main group space-y-4 overflow-wrap-anywhere">
            {main.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </div>
          <div className="sidebar group space-y-4 overflow-wrap-anywhere">
            {sidebar.map((section) => (
              <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  