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
    <div className="mb-3 flex flex-col items-start gap-1 text-left">
      <div className="flex flex-col gap-1">
        <div className="text-3xl font-bold tracking-widest">{basics.name.toUpperCase()}</div>
        <div className="text-md tracking-wider text-primary">{basics.headline.toUpperCase()}</div>
      </div>

      <div className="flex flex-wrap items-start gap-x-2 text-sm">
        {basics.location && (
          <div className="flex items-center gap-x-1.5">
            <i className="ph ph-bold ph-map-pin" />
            <div>{basics.location}</div>
          </div>
        )}
        {basics.phone && (
          <div className="flex items-center gap-x-1.5">
            <i className="ph ph-bold ph-phone" />
            <a
              href={`tel:${basics.phone}`}
              target="_blank"
              rel="noreferrer"
              className="no-underline"
            >
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
    </div>
  );
};

const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id} className="group-[.sidebar]:border-b">
      <h4 className="text-md mb-2 border-b pb-0.5 font-bold tracking-[2px]">
        {section.name.toUpperCase()}
      </h4>

      <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: section.content }} />
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
    <div className="mb-2 flex items-start gap-x-1.5">
      {icon ?? <i className="ph ph-bold ph-link mt-1 group-[.main]:text-primary" />}
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

  let alignChanges;

  if (section.id === "skills") {
    alignChanges = "flex flex-wrap px-1 gap-x-4 mb-4 gap-y-4 text-left -mx-2";
  } else if (section.id === "interests") {
    alignChanges = "flex flex-wrap px-1 text-left gap-x-5 group-[.sidebar]:gap-x-6  -mx-2";
  } else {
    alignChanges = "grid gap-x-6 gap-y-3";
  }

  return (
    <section id={section.id} className="grid">
      <h4 className="mb-2 border-b pb-0.5 text-base font-bold tracking-[2px]">
        {section.name.toUpperCase()}
      </h4>

      <div
        className={alignChanges}
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

                {summary !== undefined && !isEmptyString(summary) && section.id!=='skills' && (
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

const Experience = () => {
  const section = useArtboardStore((state) => state.resume.sections.experience);

  return (
    <Section<Experience> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold">{item.company}</div>
            <div className="group-[.main]:text-primary">{item.position}</div>
          </div>

          <div className="shrink-0 text-right group-[.sidebar]:text-left">
            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="">{item.date}</div>
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
        <div className="flex flex-col justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="">
            <div className="font-bold group-[.main]:text-primary">{item.institution}</div>
            <div className="flex items-center gap-3">
              <div>{item.area}</div>
              <div className="font-bold">{item.score}</div>
            </div>
          </div>

          <div className="">
            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="">{item.date}</div>
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
        <div className="flex items-center gap-2">
          {isUrl(item.url.href) ? (
            <Link
              url={item.url}
              label={item.username}
              icon={
                item.icon && (
                  <img
                    className="ph mt-1"
                    width={fontSize}
                    height={fontSize}
                    alt={item.network}
                    src={`https://cdn.simpleicons.org/${item.icon}`}
                  />
                )
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
            <div className="group-[.main]:text-primary">{item.awarder}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="">{item.date}</div>
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
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold">{item.name}</div>
            <div className="group-[.main]:text-primary">{item.issuer}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="">{item.date}</div>
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
    <Section<Skill>
      section={section}
      levelKey="level"
      keywordsKey="keywords"
      className=" group-[.main]:w-[40%]"
    >
      {(item) => (
        <div>
          <div className="group-[.sidebar]:border-b">{item.name}</div>
        </div>
      )}
    </Section>
  );
};

const Interests = () => {
  const section = useArtboardStore((state) => state.resume.sections.interests);

  return (
    <Section<Interest> section={section} keywordsKey="keywords" className="mb-2 space-y-0.5">
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
            <div className="group-[.main]:text-primary">{item.publisher}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="">{item.date}</div>
            </div>
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
            <div className="group-[.main]:text-primary">{item.position}</div>
          </div>

          <div className="shrink-0 group-[.main]:text-right">
            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="">{item.date}</div>
            </div>
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
    <Section<Language> section={section} levelKey="level" className="mb-3">
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
            <div className="">{item.description}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="">{item.date}</div>
            </div>
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
            <div className="group:[.main]:text-primary">{item.description}</div>

            <div className="flex items-center gap-1">
              {item.date && <i className="ph ph-calendar-dots ph-bold"></i>}
              <div className="font-bold">{item.date}</div>
            </div>
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

export const Sleek = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;

  return (
    <div className="p-custom text-text overflow-wrap-anywhere">
      {isFirstPage && <Header />}

      <div className="grid grid-cols-5 gap-x-4 ">
        <div className="sidebar overflow-wrap-anywhere group col-span-2 space-y-4">
          {sidebar.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>
        <div className="main overflow-wrap-anywhere group col-span-3 space-y-4 pl-4">
          {main.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
