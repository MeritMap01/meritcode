import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { t, Trans } from "@lingui/macro";
import { ArrowCounterClockwise, DotsSixVertical, Plus, TrashSimple } from "@phosphor-icons/react";
import { defaultMetadata } from "@reactive-resume/schema";
import { Button, Portal, Tooltip } from "@reactive-resume/ui";
import {
  cn,
  LayoutLocator,
  moveItemInLayout,
  parseLayoutLocator,
  SortablePayload,
} from "@reactive-resume/utils";
import get from "lodash.get";
import { useState ,useEffect} from "react";

import { useResumeStore } from "@/client/stores/resume";

import { getSectionIcon } from "../shared/section-icon";

type ColumnProps = {
  id: string;
  name: string;
  items: string[];
};

const Column = ({ id, name, items }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <div className="relative">
        <div className="absolute inset-0 w-3/4 rounded bg-secondary/50" />

        <div className="relative z-10 p-3 pb-8">
          <p className="mb-3 text-xs font-bold">{name}</p>

          <div ref={setNodeRef} className="space-y-3">
            {items.map((section) => (
              <SortableSection key={section} id={section} />
            ))}
          </div>
        </div>
      </div>
    </SortableContext>
  );
};

type SortableSectionProps = {
  id: string;
};

const SortableSection = ({ id }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transition,
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Section id={id} />
    </div>
  );
};

type SectionProps = {
  id: string;
  isDragging?: boolean;
};

const Section = ({ id, isDragging = false }: SectionProps) => {
  const name = useResumeStore((state) =>
    get(state.resume.data.sections, `${id}.name`, id),
  ) as string;

  return (
    <div
      className={cn(
        "cursor-grab rounded bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary-accent",
        isDragging && "cursor-grabbing",
      )}
    >
      <div className="flex items-center gap-x-2">
        <DotsSixVertical size={12} weight="bold" />
        <p className="flex-1 truncate text-xs font-medium">{name}</p>
      </div>
    </div>
  );
};

const calculateSectionHeight = (sectionId: string): number => {
  const sectionElement = document.getElementById(sectionId);
  return sectionElement ? sectionElement.offsetHeight : 0;
};

const getOverflowingSections = (page: string[][], maxHeight: number): { main: string[], sidebar: string[] } => {
  const sectionHeights = page.map((column) =>
    column.reduce((acc, sectionId) => acc + calculateSectionHeight(sectionId), 0)
  );

  const overflow = { main: [] as string[], sidebar: [] as string[] };

  if (sectionHeights.some((height) => height > maxHeight)) {
    page.forEach((column, columnIndex) => {
      let height = 0;
      for (const sectionId of column) {
        const sectionHeight = calculateSectionHeight(sectionId);
        if (height + sectionHeight > maxHeight) {
          if (columnIndex === 0) {
            overflow.main.push(sectionId);
          } else {
            overflow.sidebar.push(sectionId);
          }
        } else {
          height += sectionHeight;
        }
      }
    });
  }

  return overflow;
};

export const LayoutSection = () => {
  const setValue = useResumeStore((state) => state.setValue);
  const layout = useResumeStore((state) => state.resume.data.metadata.layout);
  const pageHeight=1122;

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const onDragCancel = () => {
    setActiveId(null);
  };

  const onDragEvent = ({ active, over }: DragOverEvent | DragEndEvent) => {
    if (!over || !active.data.current) return;

    const currentPayload = active.data.current.sortable as SortablePayload | null;
    const current = parseLayoutLocator(currentPayload);

    if (active.id === over.id) return;

    if (!over.data.current) {
      const [page, column] = (over.id as string).split(".").map(Number);
      const target = { page, column, section: 0 } as LayoutLocator;

      const newLayout = moveItemInLayout(current, target, layout);
      setValue("metadata.layout", newLayout);

      return;
    }

    const targetPayload = over.data.current.sortable as SortablePayload | null;
    const target = parseLayoutLocator(targetPayload);

    const newLayout = moveItemInLayout(current, target, layout);
    setValue("metadata.layout", newLayout);
  };

  const onDragEnd = (event: DragEndEvent) => {
    onDragEvent(event);
    setActiveId(null);
  };

  const onAddPage = (event: CustomEvent) => {
    console.log('Adding new page with overflowing sections:', event.detail);

    const layoutCopy = JSON.parse(JSON.stringify(layout)) as string[][][];

    if (event && event.detail) {
      let sectionsToMove = { main: event.detail.main, sidebar: event.detail.sidebar };
      let pageIndex = layoutCopy.length - 1;

      while (sectionsToMove.main.length > 0 || sectionsToMove.sidebar.length > 0) {
        const newPage: string[][] = [[], []];
        layoutCopy.push(newPage);

        sectionsToMove.main.forEach((sectionId: string) => {
          layoutCopy.forEach((page, pageIndex) => {
            page.forEach((column, columnIndex) => {
              const sectionIndex = column.indexOf(sectionId);
              if (sectionIndex > -1) {
                const movedSection = layoutCopy[pageIndex][columnIndex].splice(sectionIndex, 1)[0];
                newPage[0].push(movedSection);
                console.log(`Moved section ${sectionId} from page ${pageIndex}, column ${columnIndex} to new page ${layoutCopy.length - 1}`);
              }
            });
          });
        });

        sectionsToMove.sidebar.forEach((sectionId: string) => {
          layoutCopy.forEach((page, pageIndex) => {
            page.forEach((column, columnIndex) => {
              const sectionIndex = column.indexOf(sectionId);
              if (sectionIndex > -1) {
                const movedSection = layoutCopy[pageIndex][columnIndex].splice(sectionIndex, 1)[0];
                newPage[1].push(movedSection);
                console.log(`Moved section ${sectionId} from page ${pageIndex}, column ${columnIndex} to new page ${layoutCopy.length - 1}`);
              }
            });
          });
        });

        sectionsToMove = getOverflowingSections(layoutCopy[pageIndex], pageHeight);
        pageIndex++;
      }
    } else {
      layoutCopy.push([[], []]);
    }

    console.log('Updated layout:', layoutCopy);
    setValue('metadata.layout', layoutCopy);
    setTimeout(() => {
      const message = { type: 'checkOverflow' };
      window.parent.postMessage(message, "*");
  }, 100);
};

  const onRemovePage = (page: number) => {
    const layoutCopy = JSON.parse(JSON.stringify(layout)) as string[][][];

    layoutCopy[0][0].push(...layoutCopy[page][0]); // Main
    layoutCopy[0][1].push(...layoutCopy[page][1]); // Sidebar

    layoutCopy.splice(page, 1);

    setValue("metadata.layout", layoutCopy);
  };

  const onResetLayout = () => {
    const layoutCopy = JSON.parse(JSON.stringify(defaultMetadata.layout)) as string[][][];

    // Loop through all pages and columns, and get any sections that start with "custom."
    // These should be appended to the first page of the new layout.
    const customSections: string[] = [];

    layout.forEach((page) => {
      page.forEach((column) => {
        customSections.push(...column.filter((section) => section.startsWith("custom.")));
      });
    });

    if (customSections.length > 0) layoutCopy[0][0].push(...customSections);

    setValue("metadata.layout", layoutCopy);
  };
  useEffect(() => {
    const handleAddPageEvent = (event: MessageEvent) => {
      if (event.data.type === "addPage") {
        console.log("Received addPage event:", event.data);
        onAddPage(event.data);
      }
    };

    window.addEventListener("message", handleAddPageEvent);

    return () => {
      window.removeEventListener("message", handleAddPageEvent);
    };
  }, []);
  return (
    <section id="layout" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("layout")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Layout`}</h2>
        </div>

        <Tooltip content={t`Reset Layout`}>
          <Button size="icon" variant="ghost" onClick={onResetLayout}>
            <ArrowCounterClockwise />
          </Button>
        </Tooltip>
      </header>

      <main className="grid gap-y-4">
        {/* Pages */}
        <DndContext
          sensors={sensors}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragCancel={onDragCancel}
          collisionDetection={closestCenter}
        >
          {layout.map((page, pageIndex) => {
            const mainIndex = `${pageIndex}.0`;
            const sidebarIndex = `${pageIndex}.1`;

            const main = page[0];
            const sidebar = page[1];

            return (
              <div key={pageIndex} className="rounded border p-3 pb-4">
                <div className="flex items-center justify-between">
                  <p className="mb-3 text-xs font-bold">
                    <Trans>Page {pageIndex + 1}</Trans>
                  </p>

                  {pageIndex !== 0 && (
                    <Tooltip content={t`Remove Page`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => onRemovePage(pageIndex)}
                      >
                        <TrashSimple size={12} className="text-error" />
                      </Button>
                    </Tooltip>
                  )}
                </div>

                <div className="grid grid-cols-2 items-start gap-x-4">
                  <Column id={mainIndex} name={t`Main`} items={main} />
                  <Column id={sidebarIndex} name={t`Sidebar`} items={sidebar} />
                </div>
              </div>
            );
          })}

          <Portal>
            <DragOverlay>{activeId && <Section id={activeId} isDragging />}</DragOverlay>
          </Portal>
        </DndContext>

        <Button variant="outline" className="ml-auto" onClick={() => onAddPage(new CustomEvent('addPage'))}>
          <Plus />
          <span className="ml-2">{t`Add New Page`}</span>
        </Button>
      </main>
    </section>
  );
};
