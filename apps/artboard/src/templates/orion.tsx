import React, { Fragment, useEffect, useRef, useState  } from "react";
import { InView } from "react-intersection-observer";
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
import { cn, isEmptyString, isUrl, linearTransform, pageSizeMap, } from "@reactive-resume/utils";
import get from "lodash.get";
import { Picture } from "../components/picture";
import { useArtboardStore } from "../store/artboard";
import { TemplateProps } from "../types/template";
import { MM_TO_PX, } from "../components/page";

const Header = () => {
  const basics = useArtboardStore((state) => state.resume.basics);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 pb-2 mt-5 text-center border-b-2 border-gray-600">
      
      <div>
        <div className="text-3xl font-bold font-roboto">{basics.name}</div>
        <div className="text-xl text-gray-600">{basics.headline}</div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        {basics.phone && (
          <div className="flex items-center gap-1">
            <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
              {basics.phone}
            </a>
          </div>
        )}
        {basics.email && (
          <div className="flex items-center gap-1">
            <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
              {basics.email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};


const Summary = () => {
  const section = useArtboardStore((state) => state.resume.sections.summary);

  if (!section.visible || isEmptyString(section.content)) return null;

  return (
    <section id={section.id} className="mt-4">
      <h4 className="font-bold ">Summary</h4>
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
      <div className="mb-2  font-bold  group-[.main]:block">
        <h2>{section.name}</h2>
      </div>

      <div className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
        <div className="h-1.5 w-1.5 rounded-full border border-primary" />
        <h4>{section.name}</h4>
        <div className="h-1.5 w-1.5 rounded-full border border-primary" />
      </div>

      <div
        className={cn(section.id === "profiles" || section.id==="certifications" ? "flex flex-wrap gap-x-8 gap-y-4 text-left":"grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center",className)}
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
    <Section<Experience> section={section} urlKey="url" summaryKey="summary">
    {(item) => (
      <div className="flex items-center justify-between">
        <div className="text-left">
          <div className="font-bold">{item.company}</div>
          <div>{item.position}</div>
          <div>{item.location}</div>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-bold">{item.date}</div>
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
        <div className="flex items-center justify-between overflow-wrap-anywhere">
        <div className="text-left">
          <div className="font-bold">{item.institution}</div>
          <div>{item.studyType}</div>
          <div>{item.area}</div>
          <div>{item.score}</div>
        </div>

        <div className="shrink-0 text-right overflow-wrap-anywhere">
          <div className="font-bold">{item.date}</div>
        </div>
      </div>
      )}
    </Section>
  );
};

const Awards = () => {
  const section = useArtboardStore((state) => state.resume.sections.awards);

  return (
    <Section<Award> section={section} urlKey="url" summaryKey="summary" className="flex gap-x-10">
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

const Certifications = () => {
  const section = useArtboardStore((state) => state.resume.sections.certifications);

  return (
    <Section<Certification> section={section} urlKey="url" summaryKey="summary">
      {(item) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.issuer}</div>
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = useArtboardStore((state) => state.resume.sections.skills);

  return (
    <section id={section.id} className="mt-4">
      <h2 className="font-bold">{section.name}</h2>
      <ul className="mt-2 grid grid-cols-4 gap-2 list-disc list-inside">
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
          <div className="flex items-center space-x-12 w-full">
              <h3 className="font-bold overflow-wrap-anywhere flex-grow"> {item.organization}</h3>
              <div className="shrink-0 text-right overflow-wrap-anywhere">
                  <div className="font-bold">{item.date}</div>
              </div>
          </div>
          <div>{item.position}</div>
          <div>{item.location}</div>
          
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
      return <Skills/>;
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
export const Orion = ({ columns, isFirstPage = false }: TemplateProps) => {
  const [main, sidebar] = columns;
  const margin = useArtboardStore((state) => state.resume.metadata.page.margin);
  const pageHeight = pageSizeMap[useArtboardStore((state) => state.resume.metadata.page.format)].height * MM_TO_PX;
  const [overflowingSections, setOverflowingSections] = useState<string[]>([]);
  const [isPaginating, setIsPaginating] = useState(true);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const checkOverflow = () => {
    const totalHeight = sectionRefs.current.reduce((acc, section) => {
      return acc + (section ? section.offsetHeight : 0);
    }, 0);

    console.log("Total Height:", totalHeight);
    console.log("Page Height:", pageHeight);

    if (totalHeight > pageHeight) {
      const overflowSections = sectionRefs.current.filter((section) => {
        return section && (section.offsetTop + section.offsetHeight > pageHeight);
      }).map((section) => section?.id);

      console.log("Overflowing Sections:", overflowSections);

      setOverflowingSections(overflowSections as string[]);
      const message = { type: "addPage", detail: overflowSections };
      console.log("Posting message to parent window:", message);
      window.parent.postMessage(message, "*");
    } else {
      setOverflowingSections([]);
      setIsPaginating(false); // Stop pagination once content fits within pages
    }
  };

  useEffect(() => {
    if (isPaginating) {
      const interval = setInterval(checkOverflow, 100);
      return () => clearInterval(interval);
    }
  }, [isPaginating]);

  useEffect(() => {
    if (overflowingSections.length > 0) {
      checkOverflow();
    }
  }, [overflowingSections]);

  useEffect(() => {
    // Re-enable pagination when content changes
    setIsPaginating(true);
  }, [columns]);


  return (
    <div className={`p-2 space-y-0 m-${margin}`} style={{margin:margin}}>
      {isFirstPage && <Header />}

      <div className="space-y-6">
        {main.map((section, sectionIndex) => (
          <InView key={section} triggerOnce={true}>
            {({ ref }) => (
              <div
                id={section}
                ref={(el) => {
                  if (typeof ref === 'function') ref(el);
                  sectionRefs.current[sectionIndex] = el;
                }}
              >
                {mapSectionToComponent(section)}
              </div>
            )}
          </InView>
        ))}
      </div>
      <div className="space-y-6">
        {sidebar.map((section, sectionIndex) => (
          <InView key={section} triggerOnce={true}>
            {({ ref }) => (
              <div
                id={section}
                ref={(el) => {
                  if (typeof ref === 'function') ref(el);
                  sectionRefs.current[main.length + sectionIndex] = el;
                }}
              >
                {mapSectionToComponent(section)}
              </div>
            )}
          </InView>
        ))}
      </div>
    </div>
  );
};