'use client';

import { ActionModal } from "@/components/admin/ActionModal";

import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CmsPageSectionDto, Locale, SectionType } from '@/lib/types/cms-page';
import { SortableSectionCard } from './SortableSectionCard';
import { Plus } from 'lucide-react';

interface PageBuilderCanvasProps {
  sections: CmsPageSectionDto[];
  setSections: React.Dispatch<React.SetStateAction<CmsPageSectionDto[]>>;
  activeLocale: Locale;
}

export const PageBuilderCanvas: React.FC<PageBuilderCanvasProps> = ({ sections, setSections, activeLocale }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id || item.sectionOrder === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id || item.sectionOrder === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addSection = (type: SectionType) => {
    const newSection: CmsPageSectionDto = {
      sectionOrder: sections.length,
      sectionType: type,
      configuration: {
        translations: {
          en: {}, fr: {}, zh: {}
        }
      }
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (index: number) => {
    setSectionToDelete(index);
  };

  const confirmDelete = () => {
    if (sectionToDelete === null) return;
    const newSections = [...sections];
    newSections.splice(sectionToDelete, 1);
    setSections(newSections);
    setSectionToDelete(null);
  };

  const updateSection = (index: number, newConfig: any) => {
    const newSections = [...sections];
    newSections[index].configuration = newConfig;
    setSections(newSections);
  };

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s, i) => s.id || i)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <SortableSectionCard
                key={section.id || index}
                id={section.id || index}
                section={section}
                activeLocale={activeLocale}
                onRemove={() => removeSection(index)}
                onUpdate={(config) => updateSection(index, config)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl">
          <p className="text-zinc-500 font-medium mb-4">No sections added yet.</p>
        </div>
      )}

      {/* Add Section Controls */}
      <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex flex-wrap gap-2 items-center justify-center">
        <span className="text-sm font-bold text-zinc-500 mr-2">Add Section:</span>
        {(['HERO', 'IMAGE_TEXT', 'RICH_TEXT', 'VIDEO', 'GALLERY'] as SectionType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addSection(type)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 hover:border-brand-green hover:text-brand-green text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3 h-3" />
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <ActionModal
        isOpen={sectionToDelete !== null}
        onClose={() => setSectionToDelete(null)}
        onConfirm={confirmDelete}
        variant="danger"
        title="Delete Section"
        description="Are you sure you want to remove this section? You can't undo this action unless you discard your draft."
        confirmLabel="Remove"
        cancelLabel="Cancel"
      />
    </div>
  );
};
