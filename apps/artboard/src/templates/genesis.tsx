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
import { cn, hexToRgb, isEmptyString, isUrl } from "@reactive-resume/utils";
import get from "lodash.get";
import { Fragment } from "react";

import { Picture } from "../components/picture";
import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);
  const primaryColor = useArtboardStore((state) => state.resume.metadata.theme.primary);
  const picture = useArtboardStore((state) => state.resume.basics.picture);
  return (
    <div className="relative pb-0" style={{ backgroundColor: hexToRgb(primaryColor, 0.2) }}>
      <div className="flex relative justify-between w-full p-custom">
        <div className="p-6">
          <h2 className="text-5xl font-bold text-primary">{basics.name}</h2>
          <p className="mt-2 text-xl">{basics.headline}</p>
          <div className="mt-2">
            {basics.phone && (
              <>
                <div className="flex items-center gap-x-1.5">
                  <i className="ph ph-bold ph-phone  " />
                  <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
                    {basics.phone}
                  </a>
                </div>

              </>
            )}
            {basics.location && (
              <>
                <div className="flex items-center gap-x-1.5">
                  <i className="ph ph-bold ph-map-pin " />
                  <div>{basics.location}</div>
                </div>

              </>
            )}
            {basics.email && (
              <>
                <div className="flex items-center gap-x-1.5">
                  <i className="ph ph-bold ph-at " />
                  <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
                    {basics.email}
                  </a>
                </div>

              </>
            )}

            {isUrl(basics.url.href) && (
              <>
                <Link url={basics.url} />
                <div className="bg-text h-1 w-1 rounded-full last:hidden" />
              </>
            )}
            {basics.customFields.map((item) => (
              <Fragment key={item.id}>
                <div className="flex items-center gap-x-1.5">
                  <i className={cn(`ph ph-bold ph-${item.icon}`, "")} />
                  <span>{[item.name, item.value].filter(Boolean).join(": ")}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        {picture.url && <img src={picture.url} className=" h-64 w-64 text-center" />}
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
      <div
        key={index}
        className={cn("h-2 w-4 border border-primary", level > index && "bg-primary")}
      />
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
    <div className="flex items-start gap-x-1.5">
      {icon ?? <i className="ph ph-bold ph-link mt-1" />}
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
    alignChanges = "flex flex-wrap gap-x-5 gap-y-3 text-left group-[.main]:mb-4"
  }
  else if (section.id === "interests") {
    alignChanges = "flex flex-wrap gap-x-6 group-[.main]:mb-4"
  } else {
    alignChanges = "grid gap-x-6 gap-y-3 group-[.main]:mb-4"
  }
  return (
    <section id={section.id} className="grid group-[.main]:border-b">
      <h4 className="mb-2 text-primary font-bold">{section.name}</h4>

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
                className={cn("relative space-y-2 group-[.sidebar]:pl-0", className)}
              >
                <div className="relative  group-[.sidebar]:ml-0">
                  <div className=" group-[.sidebar]:pl-0">
                    {children?.(item as T)}
                    {url !== undefined && <Link url={url} />}
                  </div>

                  <div className="absolute inset-y-0 group-[.sidebar]:hidden" />
                </div>

                {summary !== undefined && !isEmptyString(summary) && (
                  <div className="wysiwyg" dangerouslySetInnerHTML={{ __html: summary }} />
                )}

                {level !== undefined && level > 0 && <Rating level={level} />}

                {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm">{keywords.join(", ")}</p>
                )}

                <div className="absolute inset-y-0  group-[.sidebar]:hidden" />
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
        <div className="flex gap-4 items-center">
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
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div className="font-bold text-primary">{item.company}</div>
            <div className="text-primary">{item.position}</div>
          </div>
          <div className="flex gap-4">
            {(item.date || item.location) && <div className="bg-primary h-8 flex-shrink-0">|</div>}
            <div className="shrink-0 text-right">
              <div className="font-bold">{item.date}</div>
              <div>{item.location}</div>
            </div>
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
        <div className="group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="">
            <div className="flex">
              <div className="font-bold">{item.institution}</div>
              {item.area && <div>,{item.area}</div>}
            </div>
          </div>

          <div className="">
            <div className="font-bold">{item.date}</div>
            <div className="flex justify-between items-center">
              <div>{item.studyType}</div>
              <div>{item.score}</div>
            </div>
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
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
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
            <div className="font-bold mt-6">{item.date}</div>
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
          <div className="">{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Interests = () => {
  const section = useArtboardStore((state) => state.resume.sections.interests);

  return (
    <Section<Interest> section={section} className="space-y-0" keywordsKey="keywords">
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
        <div className="flex items-center justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
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

export const Genesis = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;

  return (
    <div className="text-text overflow-wrap-anywhere">
      {isFirstPage && (
        <div className="relative">
          <Header />
        </div>
      )}

      <div className="p-custom grid grid-cols-5">
        <div className="main p-custom group col-span-3 space-y-4 overflow-wrap-anywhere">
          {main.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>
        <div className="sidebar p-custom col-span-2 group space-y-4 overflow-wrap-anywhere">
          {sidebar.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>


      </div>
    </div>
  );
};
