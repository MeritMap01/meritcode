import {
  Award,
  Certification,
  CustomSection,
  CustomSectionGroup,
  
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
import { color } from "framer-motion";

const Header = () => {
  const { name, headline, phone,picture,location,email,url } = useArtboardStore((state) => state.resume.basics);
  
  return (
    <header className="flex flex-col  justify-between rounded-md overflow-wrap-anywhere">
  {(isUrl(picture.url) && !picture.effects.hidden) &&  
  <img src={picture.url} alt="Profile" className="w-22 h-22 rounded-full border-solid border-white border-8 mb-5" />}
<div className="flex flex-col items-start mb-7 mt-3">
      <h1 className="text-3xl font-bold text-left mb-2">{name}</h1>
      <h2 className="text-xl text-gray-600 text-left">{headline.toUpperCase()}</h2>
    </div>
    <div className="flex flex-col items-start mt-3  mb-7 space-y-2">
      <div className="flex items- space-x-2 max-w-full">
        <i className="ph ph-bold ph-map-pin text-primary" style={{ color: "#454040" }} />
        <p className="text-left overflow-wrap-anywhere">{location}</p>
      </div>
      <div className="flex items-start space-x-2 max-w-full">
        <i className="ph ph-bold ph-phone text-primary" style={{ color: "#454040" }} />
        <p className="text-left overflow-wrap-anywhere">{phone}</p>
      </div>
      <div className="flex items-start space-x-2 max-w-full">
        <i className="ph ph-bold ph-at text-primary" style={{ color: "#454040" }} />
        <p className="text-left overflow-wrap-anywhere">{email}</p>
      </div>
      <div className="flex items-start space-x-2 max-w-full">
        <p className="text-left overflow-wrap-anywhere">{url.href}</p>
      </div>
    </div>
  </header>
  
  );
};


const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id}>
       <h3 className="text-2xl tracking-wide font-sans border-b-2 font-semibold  mb-7 pb-2" style={{ color: '#454040' }}>{section.name.toUpperCase()}</h3>

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
      <i
        key={index}
        className={cn(
          "ph ph-diamond ",
          level > index && "ph-fill",
          level <= index && "ph-bold",
        )} style={{color:"#959392"}}
      />
      // <div
      //   key={index}
      //   className={cn("h-2 w-4 border border-primary", level > index && "bg-primary")}
      // />
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
      {icon ?? <i className="ph ph-bold ph-link text-primary group-[.summary]:text-background" />}
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
    <section id={section.id} className="grid text-wrap">
       <h3 className="text-2xl tracking-wide text-wrap font-sans border-b-2 font-semibold mb-7 pb-2" style={{ color: '#454040' }}>{section.name.toUpperCase()}</h3>
      <div
        className="grid gap-x-6 text-wrap gap-y-3"
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

const WorkExperience = () => {
  const experience = useArtboardStore((state) => state.resume.sections.experience);
  if (!experience.visible || !experience.items.length) return null;

  return (
    <section className="mt-6">
<h3 className="text-2xl tracking-wide font-sans border-b-2 font-semibold mb-7 pb-2 inline-block" style={{ color: '#454040' }}>
  {experience.name.toUpperCase()}
</h3>
      {experience.items.map((item) => (
        <div key={item.id} className="mb-4 mt-3">
          <h4 className="text-xl font-bold tracking-wide mt-2 mb-2">{item.position.toUpperCase()}</h4>
          <h4 className="text-xl font-bold tracking-wide text-gray-500 italic color-[#94a3b8]">{item.company}</h4>
          <div className="flex justify-between mb-3">
            <p>{item.location}</p>
            <p>{item.date}</p>
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
    <section className="mb-6">
      <h3 className="text-2xl tracking-wide font-sans border-b-2 font-semibold  mb-7 pb-2" style={{ color: '#454040' }}>{education.name.toUpperCase()}</h3>
      {education.items.map((item) => (
        <div key={item.id} className="mt-2">
          <div className="flex justify-between">
          <h4 className="text-xl font-bold">{item.studyType}</h4>
         < div className="shrink-0 text-right">
            <div>{item.date}</div>
          </div>
          </div>
          <h4 className="font-bold text-gray-600 italic text-xl">{item.institution}</h4>
          <p>{item.area}</p>
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
    <Section<Skill> section={section} levelKey="level" keywordsKey="keywords">
      {(item) => (
        <div>
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

  return (
    <Section<CustomSection>
      section={section}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item) => (
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold">{item.name}</div>
            <div>{item.description}</div>
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

const mapSectionToComponent = (section: SectionKey) => {
  switch (section) {
    case "profiles":
      return <Profiles />;
    case "summary":
      return <Summary />;
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

export const Palette = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;

  return (
    <div className="p-custom grid grid-cols-3 space-x-6 overflow-wrap-anywhere">
      <div className="sidebar bg-gray-100 ml-6 mt-4 p-6 group space-y-4 text-wrap max-w-full overflow-wrap-anywhere">
        {isFirstPage && <Header />}
        {sidebar.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>

      <div className="main group col-span-2 space-y-4 overflow-wrap-anywhere mt-3">
        {main.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>
    </div>
  );
};
