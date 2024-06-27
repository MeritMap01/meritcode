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

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 text-center">
      <div className="flex justify-between w-full max-w-4xl items-center p-4 overflow-wrap-anywhere">
        <h1 className="text-3xl font-bold" style={{ color: '#5baaab' }}>{basics.name}</h1>
        <h2 className="text-xl text-gray-600">{basics.headline}</h2>
      </div>
      <div style={{ height: '1px', width: '90%', backgroundColor: '#5baaab' }}></div>
      <div className="flex flex-wrap justify-center mt-2 space-x-12 overflow-wrap-anywhere">
        {basics.email && <a href={`mailto:${basics.email}`} className="text-gray-600 overflow-wrap-anywhere">{basics.email}</a>}
        <div style={{ height: '20px', width: '1px', backgroundColor: '#5baaab' }}></div> {/* Vertical line */}
        {basics.phone && <span className="text-gray-600 overflow-wrap-anywhere">{basics.phone}</span>}
        <div style={{ height: '20px', width: '1px', backgroundColor: '#5baaab' }}></div> {/* Vertical line */}
        {basics.location && <span className="text-gray-600 overflow-wrap-anywhere">{basics.location}</span>}
      </div>
    </div>
  );
};



const ProfileSummary = () => {
  const summary = useArtboardStore((state) => state.resume.sections.summary);

  if (!summary.visible || !summary.content) return null;

  return (
   <div className="w-full"> <section className="mb-6 ">
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Profile Summary</h3>
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

      <div className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
        <div className="h-1.5 w-1.5 rounded-full border border-primary" />
        <h4>{section.name}</h4>
        <div className="h-1.5 w-1.5 rounded-full border border-primary" />
      </div>

      <div
        className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center"
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
            <p className="font-sans">{item.username}</p>
          )}
          <p className="text-sm font-sans">{item.network}</p>
        </div>
      )}
    </Section>
  );
};

const WorkExperience = () => {
  const experience = useArtboardStore((state) => state.resume.sections.experience);

  if (!experience.visible || !experience.items.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Work Experience</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>

      {experience.items.map((item) => (
        <div key={item.id} className="">
          <div className="flex items-center space-x-8">
              <h4 className="font-bold overflow-wrap-anywhere">{item.position} - {item.company}, {item.location}</h4>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold text-[#5baaab]">{item.date}</div>
              </div>
          </div>
          <p className="mt-1" dangerouslySetInnerHTML={{ __html: item.summary }} />
        </div>
      ))}
    </section>
  );
};



const Education = () => {
  const education = useArtboardStore((state) => state.resume.sections.education);

  if (!education.visible || !education.items.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Education</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      {education.items.map((item) => (
        <div className="flex items-center justify-between overflow-wrap-anywhere">
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

  return (
    <div>
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Awards</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
    <Section<Award> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.title}</div>
          <div>{item.awarder}</div>
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

  return (
    <div>
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Certifications</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
    <Section<Certification> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.issuer}</div>
          <div className="shrink-0 text-right">
            <div className="font-bold text-[#5baaab]">{item.date}</div>
          </div>
        </div>
      )}
    </Section></div>
  );
};

const Skills = () => {
  const skills = useArtboardStore((state) => state.resume.sections.skills);

  if (!skills.visible || !skills.items.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Skills</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      <ul className="m-2 grid grid-cols-4 list-disc list-outside">
        {skills.items.map((skill) => (
          <div key={skill.id} className="w-1/2">
            <li key={skill.id}>{skill.name}</li>
            <p>{skill.description}</p>
          </div>
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
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Interests</h3>
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

  return (
   <div> 
    <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Publications</h3>
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

  return (
    <div>
       <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Volunteer</h3>
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

  return (
    <div >
       <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Languages</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
        <Section<Language> section={section} levelKey="level" className="grid grid-cols-3">
        
          {(item) => (
            <div >
              <div className="font-bold">{item.name}</div>
              <div>{item.description}</div>
            </div>
          )}
          
        </Section>
    </div>
  );
};

const Projects = () => {
  const projects = useArtboardStore((state) => state.resume.sections.projects);

  if (!projects.visible || !projects.items.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">Projects</h3>
        <div className="flex-grow border-t-2 border-[#5baaab]"></div>
      </div>
      {projects.items.map((item) => (
        <div key={item.id} className="mt-2">
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
      <div className="flex items-center space-x-8">
        <h3 className="text-lg font-semibold text-[#5baaab]">References</h3>
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

  return (
    <div className=" bg-white ">
      {isFirstPage && <Header />}
      <div className="p-8 w-100vw">
          <div className="grid grid-cols-4 gap-6">
          
          <div className="col-span-12">
              {main.map((section) => (
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