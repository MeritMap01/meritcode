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
import { cn, hexToRgb, isEmptyString, isUrl, linearTransform } from "@reactive-resume/utils";
import get from "lodash.get";
import { Fragment } from "react";

import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);

  return (
    <div className="flex flex-col space-y-4 mb-9">

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="font-bold text-7xl">{basics.name.toUpperCase()}</div>
          <div className="tracking-[10px] self-stretch font-bold text-xl">{basics.headline.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id}>
      {/* <h4 className="mb-2 border-b pb-0.5 text-sm font-bold">{section.name}</h4> */}

      <div
        className="wysiwyg group-[.sidebar]:px-10"
        style={{ columns: section.columns }}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </section>
  );
};

type RatingProps = { level: number };

const Rating = ({ level }: RatingProps) => {
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);

  return (
    <div className="relative">
      <div
        className="h-2.5 w-full rounded-sm"
        style={{ backgroundColor: hexToRgb(primaryColor, 0.4) }}
      />
      <div
        className="absolute inset-y-0 left-0 h-2.5 w-full rounded-sm bg-primary"
        style={{ width: `${linearTransform(level, 0, 5, 0, 100)}%` }}
      />
    </div>
  );
};

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
      {icon ?? <i className="ph ph-bold ph-link text-primary group-[.sidebar]:text-primary" />}
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
  const forIcons = (icon: string) => {
    switch (icon) {
      case "Education":
        return <i className="ph-fill ph-graduation-cap "></i>
      case "Experience":
        return <i className="ph-fill ph-briefcase "></i>
      case "Projects":
        return <i className="ph-fill ph-calendar-check "></i>
      case "Profiles":
        return <i className="ph-fill ph-users"></i>
      case "Certifications":
        return <i className="ph-fill ph-certificate"></i>
      case "Skills":
        return <i className="ph-fill ph-code-simple"></i>
      case "Interests":
        return <i className="ph-fill ph-game-controller"></i>
      case "References":
        return <i className="ph-fill ph-sliders"></i>
      case "Awards":
        return <i className="ph-fill ph-medal"></i>
      default:
        return <i className="ph-fill ph-read-cv-logo"></i>
    }
  }

  const nameChanges = section.name === "Education" ? "Education background" : section.name === "Experience" ? "Work Experience" : section.name

  return (
    <section id={section.id} className="grid">
      <div className="group-[.main]:flex group-[.main]:gap-3 items-center mb-5">
        <span className=" rounded-full bg-[#000] flex items-center px-2 py-2 text-[#fff] group-[.sidebar]:hidden">{forIcons(section.name)}</span>

        <div className="flex flex-col w-full group-[.sidebar]:pl-10">
          <h4 className="tracking-[6px] p-0 m-0 self-stretch text-sm font-bold w-[90%] group-[.sidebar]:text-primary -mb-1">
            {nameChanges.toUpperCase()}
          </h4>
          <hr className="border-primary mt-2 w-[90%] group-[.sidebar]:w-full m-0 p-0" />
        </div>
      </div>

      <div
        className="grid gap-x-6 gap-y-3 p-10 group-[.sidebar]:pl-14   py-0"
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
              <div key={item.id} className={cn("relative space-y-2", "border-primary group-[.main]:border-l  group-[.main]:pl-4", className)}>
                <div className="absolute top-0 left-[-4.5px] group-[.main]:h-[8px] w-[8px] rounded-full bg-primary group-[.main]:block" />
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
                <div className="absolute bottom-0 left-[-4.5px] group-[.main]:h-[8px] w-[8px] rounded-full bg-primary group-[.main]:block" />
              </div>
            );
          })}

      </div>
    </section>
  );
};

const Experience = () => {
  const section = useArtboardStore((state) => state.resume.sections.experience);

  return (
    <Section<Experience> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold">{item.company}</div>
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

const Education = () => {
  const section = useArtboardStore((state) => state.resume.sections.education);

  return (
    <Section<Education> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex flex-col justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="">
            <div className="font-bold">{item.institution}</div>
            <div>{item.area}</div>

          </div>

          <div className="">
            <div className="flex gap-20 items-center">
              <div className="font-bold">{item.date}</div>
              <div className="font-bold">{item.score}</div>
            </div>

            <div>{item.studyType}</div>
          </div>
        </div>
      )}
    </Section>
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

const Awards = () => {
  const section = useArtboardStore((state) => state.resume.sections.awards);

  return (
    <Section<Award> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold">{item.title}</div>
            <div className="flex gap-5 items-center">
              <div>{item.awarder}</div>
              <div className="font-bold">{item.date}</div>
            </div>

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
        <div className="flex flex-col justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="">
            <div className="font-bold">{item.name}</div>
            <div className="flex gap-5 items-center">
              <div>{item.issuer}</div>
              <div className="font-bold">{item.date}</div>
            </div>

          </div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useArtboardStore((state) => state.resume.sections.skills);

  return (
    <Section<Skill> section={section} levelKey="level" keywordsKey="keywords" >
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
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
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
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
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
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
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

export const Aurora = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;
  const picture = useArtboardStore((state) => state.resume.basics.picture);
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);

  return (
    <div className="grid min-h-[inherit] grid-cols-5">
      <div
        className="sidebar overflow-wrap-anywhere col-span-2 group py-6 space-y-4"
        style={{ backgroundColor: hexToRgb(primaryColor, 0.2) }}
      >
        {isFirstPage && picture.url && <div className="flex justify-center"><img src={picture.url} className="rounded-full h-72 w-72 text-center" /></div>}


        {sidebar.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>

      <div className="main p-custom overflow-wrap-anywhere group col-span-3 space-y-4">
        {isFirstPage && <Header />}
        {main.map((section) => (
          <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
        ))}
      </div>
    </div>
  );
};
