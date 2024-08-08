import {
  Award,
  Certification,
  CustomSection,
  CustomSectionGroup,
  // Education,
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

import { Picture } from "../components/picture";
import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);
  const margin = useArtboardStore((state) => state.resume.metadata.page.margin)
  return (
    <div className="bg-gray-100 mb-2 p-custom">
    <div className="flex flex-col items-center justify-center text-center" style={{margin:margin}}>
      <div className="flex justify-between w-full items-center mt-4 mb-4 overflow-wrap-anywhere">
        <h1 className="text-4xl font-extrabold" style={{ color: '#5baaab' }}>{basics.name.toUpperCase()}</h1>
        <h2 className="text-2xl text-gray-600">{basics.headline.toUpperCase()}</h2>
      </div>
      <div style={{ height: '1px', width: '100%', backgroundColor: '#5baaab' }}></div>
      <div className="flex flex-wrap justify-center mt-2 space-x-12 overflow-wrap-anywhere">
        {basics.email && <a href={`mailto:${basics.email}`} className="text-gray-600 overflow-wrap-anywhere">{basics.email}</a>}
        <div style={{ height: '20px', width: '1px', backgroundColor: '#5baaab' }}></div> {/* Vleertical line */}
        {basics.phone && <span className="text-gray-600 overflow-wrap-anywhere">{basics.phone}</span>}
        <div style={{ height: '20px', width: '1px', backgroundColor: '#5baaab' }}></div> {/* Vertical line */}
        {basics.location && <span className="text-gray-600 overflow-wrap-anywhere">{basics.location}</span>}
      </div>
    </div>
    </div>
  );
};



const ProfileSummary = () => {
  const summary = useArtboardStore((state) => state.resume.sections.summary);

  if (!summary.visible || isEmptyString(summary.content)) return null;

  return (
   <div className="w-full"> <section className="mb-6 ">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{summary.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      <div
        className="wysiwyg"
        style={{ columns: summary.columns }}
        dangerouslySetInnerHTML={{ __html: summary.content }}
      />
    </section></div>
  );
};


type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => (
  <div className="relative h-1 w-[128px] group-[.sidebar]:mx-auto">
    <div className="absolute inset-0 h-1 w-[128px] rounded bg-sky-600 opacity-25" />
    <div
      className="absolute inset-0 h-1 rounded bg-sky-400"
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
      <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
        <h4>{section.name}</h4>
      </div>

      <div className="mx-auto mb-4 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
        <div className="h-1.5 w-1.5 rounded-full border border-primary" />
        <h4>{section.name}</h4>
        <div className="h-1.5 w-1.5 rounded-full border border-primary" />
      </div>

      <div
        className={cn("grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center",className)}
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
                  "relative space-y-2 col-span-1",
                  "border-primary group-[.main]:border-l group-[.main]:pl-4",
                  
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
  if(!section.items.length || !section.visible){
    return null;
  } 
  return (
    <section className="mb-6 mt-5">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{section.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>

      <Section<Profile> section={section} className="flex gap-x-5">
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
            <p className="font-sans">{item.username}</p>
          )}
          <p className="text-sm font-sans">{item.network}</p>
        </div>
      )}
    </Section>
    </section>
  );
  // return (
    // <Section<Profile> section={section}>
    //   {(item) => (
    //     <div>
    //       {isUrl(item.url.href) ? (
    //         <Link
    //           url={item.url}
    //           label={item.username}
    //           icon={
    //             <img
    //               className="ph"
    //               width={fontSize}
    //               height={fontSize}
    //               alt={item.network}
    //               src={`https://cdn.simpleicons.org/${item.icon}`}
    //             />
    //           }
    //         />
    //       ) : (
    //         <p className="font-sans">{item.username}</p>
    //       )}
    //       <p className="text-sm font-sans">{item.network}</p>
    //     </div>
    //   )}
    // </Section>
  // );
};

const WorkExperience = () => {
  const experience = useArtboardStore((state) => state.resume.sections.experience);

  if (!experience.visible || !experience.items.length) return null;

  return (
    <section className="mb-2">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{experience.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>

      {experience.items.map((item) => (
        <div key={item.id} className="mb-4">
          <div className="flex items-center justify-between space-x-8">
              <h4 className="font-bold overflow-wrap-anywhere">{item.position}{item.company && ` - ${item.company}`}</h4>
              <div className="shrink-0  ml-auto  text-right overflow-wrap-anywhere">
                  <div className="font-bold text-[#5baaab]">{item.date}</div>
              </div>
          </div>
          
          {item.summary !== undefined && !isEmptyString(item.summary) && (
                    <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: item.summary }} />
                  )}
        </div>
      ))}
    </section>
  );
};



const Education = () => {
  const education = useArtboardStore((state) => state.resume.sections.education);

  if (!education.visible || !education.items.length) return null;

  return (
    <section className="mb-2">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{education.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      {education.items.map((item) => (
        <div className="flex justify-between overflow-wrap-anywhere mb-4">
        <div className="text-left">
          <div className="font-bold">{item.institution}</div>
          <div>{item.studyType}</div>
          <div>{item.area}</div>
          <div>{item.score}</div>
          <p className="mt-1" dangerouslySetInnerHTML={{ __html: item.summary }} />
        </div>

        <div className="shrink-0 text-right overflow-wrap-anywhere">
          <div className="font-bold text-[#5baaab]">{item.date}</div>         
        </div>
      </div>
      ))}
    </section>
  );
};


const Awards = () => {
  const section = useArtboardStore((state) => state.resume.sections.awards);
  if(!section.items.length || !section.visible){
    return null;
  } 
  return (
    <div>
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{section.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
    <Section<Award> section={section} urlKey="url" summaryKey="summary" className="flex flex-wrap">
      {(item) => (
        <div className="flex gap-x-2 col-span-1">
          <div>
          <div className="font-bold">{item.title}</div>
          <div>{item.awarder}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-bold text-[#5baaab]">{item.date}</div>
          </div>
        </div>
      )}
    </Section></div>
  );
};

const Certifications = () => {
  const section = useArtboardStore((state) => state.resume.sections.certifications);
  if(!section.items.length || !section.visible){
    return null;
  } 
  return (
    <div>
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{section.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
    <Section<Certification> section={section} urlKey="url" summaryKey="summary" className="flex flex-wrap">
      {(item) => (
        <div className="flex gap-x-2 col-span-1">
          <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.issuer}</div>
          </div>
         
          <div className="shrink-0 text-right">
            <div className="font-bold text-[#5baaab]">{item.date}</div>
          </div>
        </div>
      )}
    </Section></div>
    // <Section<Certification> section={section} urlKey="url" summaryKey="summary">
    //   {(item) => (
    //     <div className="flex items-center justify-between">
    //       <div className="text-left">
    //         <div className="font-bold">{item.name}</div>
    //         <div>{item.issuer}</div>
    //       </div>

    //       <div className="shrink-0 text-right">
    //         <div className="font-bold">{item.date}</div>
    //       </div>
    //     </div>
    //   )}
    // </Section>
  );
};

const Skills = () => {
  const skills = useArtboardStore((state) => state.resume.sections.skills);

  if (!skills.visible || !skills.items.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{skills.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      <ul className="grid grid-cols-3 gap-y-2 mt-1 list-disc ml-5 overflow-wrap-anywhere">
        {skills.items.map((skill) => (
            <li key={skill.id} className="pr-3 overflow-wrap-anywhere mr-8">{skill.name}</li>
        ))}
      </ul>
    </section>
  );
};


const Interests = () => {
  const interests = useArtboardStore((state) => state.resume.sections.interests);

  if (!interests.visible || !interests.items.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{interests.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      <ul className="grid grid-cols-3 list-disc list-inside">
        {interests.items.map((interest) => (
          <li key={interest.id}>{interest.name}</li>
        ))}
      </ul>
    </section>
  );
};


const Publications = () => {
  const section = useArtboardStore((state) => state.resume.sections.publications);
  if(!section.items.length || !section.visible){
    return null;
  } 
  return (
   <div> 
    <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{section.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
    <Section<Publication> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.publisher}</div>
          <div className="shrink-0 text-right">
            <div className="font-bold text-[#5baaab]">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
    </div>
  );
};

const Volunteer = () => {
  const section = useArtboardStore((state) => state.resume.sections.volunteer);
  if(!section.items.length || !section.visible){
    return null;
  } 
  return (
    <div>
       <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{section.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      <Section<Volunteer> section={section} urlKey="url" summaryKey="summary">
        {(item) => (
          <div>
            <div className="font-bold">{item.organization}</div>
            <div>{item.position}</div>
            <div>{item.location}</div>
            <div className="shrink-0 text-right">
            <div className="font-bold text-[#5baaab]">{item.date}</div>
          </div>
          </div>
        )}
      </Section>
    </div>
  );
};

const Languages = () => {
  const section = useArtboardStore((state) => state.resume.sections.languages);
  if(!section.items.length || !section.visible){
    return null;
  } 
  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{section.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      <ul className="grid grid-cols-3 list-disc list-inside">
        {section.items.map((language) => (
          <li key={language.id}>{language.name}</li>
        ))}
      </ul>
    </section>
  );
};

const Projects = () => {
  const projects = useArtboardStore((state) => state.resume.sections.projects);

  if (!projects.visible || !projects.items.length) return null;

  return (
    <section className="mb-2">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{projects.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      {projects.items.map((item) => (
        <div key={item.id} className="mb-4">
          <div className="flex items-center space-x-12 w-full">
            <h4 className="font-bold overflow-wrap-anywhere flex-grow">{item.name}</h4>
            <div className="shrink-0 text-right overflow-wrap-anywhere">
              <div className="font-bold text-[#5baaab]">{item.date}</div>
            </div>
          </div>
          <div className="flex items-center space-x-12 w-full">
            <p className="font-bold overflow-wrap-anywhere flex-grow">{item.description}</p>
            <div className="shrink-0 text-right overflow-wrap-anywhere">
              <div className="font-bold text-[#5baaab]">{item.url.href}</div>
            </div>
          </div>
          <p className="mt-1" dangerouslySetInnerHTML={{ __html: item.summary }} />
        </div>
      ))}
    </section>
  );
};


const References = () => {
  const references = useArtboardStore((state) => state.resume.sections.references);

  if (!references.visible || !references.items.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8 mb-4">
        <h3 className="text-lg font-semibold text-[#5baaab]">{references.name}</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      {references.items.map((item) => (
        <div key={item.id} className="mt-2">
          <h4 className="font-bold">{item.name}</h4>
          <div className="text-sm italic">{item.description}</div>
          <p className="mt-1" dangerouslySetInnerHTML={{ __html: item.summary }} />
          
        </div>
      ))}
    </section>
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
      return <ProfileSummary />;
    case "experience":
      return <WorkExperience />;
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

export const Legacy = ({ columns, isFirstPage = false } : TemplateProps) => {
  const [main, sidebar] = columns;
  const margin = useArtboardStore((state) => state.resume.metadata.page.margin)
  return (
    <div>
      {isFirstPage && <Header />}
      <div style={{margin:margin}}>
          <div className="grid grid-cols-4 gap-6">
          <div className="col-span-12 p-custom pt-1">
              {main.map((section) => (
              <Fragment key={section}>
                  {mapSectionToComponent(section)}
              </Fragment>
              ))}
              {sidebar.map((section) => (
              <Fragment key={section}>
                  {mapSectionToComponent(section)}
              </Fragment>
              ))}
          </div>
          </div>
   </div>    
    </div>
  );
};