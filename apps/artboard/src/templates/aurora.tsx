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
    <div className="mb-9 flex flex-col space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="text-7xl font-bold">{basics.name.toUpperCase()}</div>
          <div className="self-stretch text-xl font-bold tracking-widest">
            {basics.headline.toUpperCase()}
          </div>
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
      case "education":
        return <i className="ph-fill ph-graduation-cap "></i>;
      case "experience":
        return <i className="ph-fill ph-briefcase "></i>;
      case "projects":
        return <i className="ph-fill ph-calendar-check "></i>;
      case "profiles":
        return <i className="ph-fill ph-users"></i>;
      case "certifications":
        return <i className="ph-fill ph-certificate"></i>;
      case "skills":
        return <i className="ph-fill ph-code-simple"></i>;
      case "interests":
        return <i className="ph-fill ph-game-controller"></i>;
      case "references":
        return <i className="ph-fill ph-sliders"></i>;
      case "awards":
        return <i className="ph-fill ph-medal"></i>;
      default:
        return <i className="ph-fill ph-read-cv-logo"></i>;
    }
  };

  let alignChanges;

  if (section.id === "skills") {
    alignChanges = "flex flex-wrap p-5 pl-7 gap-x-6 gap-y-5 ml-5 text-left -mx-2";
  } else if (section.id === "interests") {
    alignChanges = "flex flex-wrap  pl-10 gap-x-5 gap-y-3 p-5";
  } else {
    alignChanges = "grid gap-x-6 gap-y-3 p-10 group-[.sidebar]:pl-14 py-0";
  }

  return (
    <section id={section.id} className="grid">
      <div className="mb-5 items-center group-[.main]:flex group-[.main]:gap-3">
        <span className=" flex items-center rounded-full bg-[#000] p-2 text-[#fff] group-[.sidebar]:hidden">
          {forIcons(section.id)}
        </span>

        <div className="flex w-full flex-col group-[.sidebar]:pl-10">
          <h4 className="m-0 -mb-1 w-[90%] self-stretch p-0 text-sm font-bold tracking-[6px] group-[.sidebar]:text-primary">
            {section.name.toUpperCase()}
          </h4>
          <hr className="m-0 mt-2 w-[90%] border-primary p-0 group-[.sidebar]:w-full" />
        </div>
      </div>

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
              <div
                key={item.id}
                className={cn(
                  "relative space-y-2",
                  "border-primary group-[.main]:border-l  group-[.main]:pl-4",
                  className,
                )}
              >
                <div className="absolute left-[-4.5px] top-0 w-[8px] rounded-full bg-primary group-[.main]:block group-[.main]:h-[8px]" />
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
                <div className="absolute bottom-0 left-[-4.5px] w-[8px] rounded-full bg-primary group-[.main]:block group-[.main]:h-[8px]" />
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
            <div className="flex items-center gap-20">
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
        <div className="flex items-center gap-2">
          {isUrl(item.url.href) ? (
            <Link
              url={item.url}
              label={item.username}
              icon={
                item.icon && (
                  <img
                    className="ph"
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
          <p className="align-middle text-sm">{item.network}</p>
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
            <div className="flex items-center gap-5">
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
            <div className="flex items-center gap-5">
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

export const Aurora = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;
  const picture = useArtboardStore((state) => state.resume.basics.picture);
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);
  const basics = useArtboardStore((state) => state.resume.basics);
  return (
    <div className="text-text grid min-h-[inherit] grid-cols-5">
      <div
        className="sidebar overflow-wrap-anywhere group col-span-2 space-y-4 py-6"
        style={{ backgroundColor: hexToRgb(primaryColor, 0.2) }}
      >
        {isFirstPage && picture.url && (
          <div className="flex justify-center">
            <img src={picture.url} alt="profile" className="h-72 w-72 rounded-full text-center" />
          </div>
        )}

        {isFirstPage && (
          <div className=" flex w-full flex-col group-[.sidebar]:pl-10">
            <h1 className="text-base font-bold tracking-[6px] text-primary">CONTACT</h1>
            <hr className="m-0 mb-2 w-[90%] border-primary p-0 group-[.sidebar]:w-full" />
            <div className="flex flex-col items-start gap-y-2 pr-9 text-sm">
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
        )}
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
