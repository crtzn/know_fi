'use client';

import { ChevronDown, ChevronUp, Edit3, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Lecture = {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
};

type Section = {
  id: number;
  title: string;
  lectures: Lecture[];
};

interface CreateStep3Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  sectionsData: Section[];
  setSectionsData: React.Dispatch<React.SetStateAction<Section[]>>;
  mode?: 'new' | 'existing' | null;
  selectedCourseId?: number | null;
}

export function CreateStep3({
  open,
  onOpenChange,
  onBack,
  onNext,
  sectionsData,
  setSectionsData,
  mode = 'new',
  selectedCourseId,
}: CreateStep3Props) {
  // Initialize openSections with all existing sections opened by default
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>(() => {
    const initialOpen: { [key: number]: boolean } = {};
    sectionsData.forEach((section) => {
      initialOpen[section.id] = true; // Open all sections by default
    });
    return initialOpen;
  });

  const [openLectures, setOpenLectures] = useState<{ [key: string]: boolean }>({});
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);

  // Update openSections when sectionsData changes or modal opens
  useEffect(() => {
    if (open && sectionsData.length > 0) {
      const newOpenSections: { [key: number]: boolean } = {};
      sectionsData.forEach((section) => {
        newOpenSections[section.id] = true; // Open all sections by default
      });
      setOpenSections(newOpenSections);
    }
  }, [open, sectionsData]);

  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLecture = (sectionId: number, lectureId: number) => {
    const key = `${sectionId}-${lectureId}`;
    setOpenLectures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addSection = () => {
    const sectionNumber = sectionsData.length + 1;

    const newSection: Section = {
      id: Date.now(),
      title: `Section ${sectionNumber}: ${mode === 'existing' ? 'New Module Title' : 'Your Section Title'}`,
      lectures: [],
    };
    setSectionsData([...sectionsData, newSection]);
    // Automatically open the new section
    setOpenSections((prev) => ({ ...prev, [newSection.id]: true }));
  };

  const addLecture = (sectionId: number) => {
    const newLecture: Lecture = {
      id: Date.now(),
      title: 'New Lecture',
      description: '',
      videoUrl: '',
    };

    setSectionsData((sections) =>
      sections.map((section) =>
        section.id === sectionId ? { ...section, lectures: [...section.lectures, newLecture] } : section,
      ),
    );

    const key = `${sectionId}-${newLecture.id}`;
    setOpenLectures((prev) => ({ ...prev, [key]: true }));
  };

  const removeSection = (sectionId: number) => {
    setSectionsData((sections) => sections.filter((s) => s.id !== sectionId));
  };

  const removeLecture = (sectionId: number, lectureId: number) => {
    setSectionsData((sections) =>
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, lectures: section.lectures.filter((l) => l.id !== lectureId) }
          : section,
      ),
    );
  };

  const updateSectionTitle = (sectionId: number, title: string) => {
    setSectionsData((sections) =>
      sections.map((section) => (section.id === sectionId ? { ...section, title } : section)),
    );
  };

  const updateLecture = (sectionId: number, lectureId: number, field: keyof Lecture, value: string) => {
    setSectionsData((sections) =>
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.map((lecture) =>
                lecture.id === lectureId ? { ...lecture, [field]: value } : lecture,
              ),
            }
          : section,
      ),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            📚 Step 3: {mode === 'existing' ? 'Course Modules (Add New)' : 'Course Modules & Lectures'}
          </DialogTitle>
          <p className="text-gray-600">
            {mode === 'existing'
              ? 'Current course modules are shown. Add new sections below existing ones.'
              : 'Create your course structure with sections and lectures'}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Debug info - remove later */}
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded bg-gray-100 p-2 text-xs text-gray-500">
              Debug: {sectionsData.length} sections, Mode: {mode}, Course ID: {selectedCourseId}
            </div>
          )}

          {sectionsData.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-center">
              <p className="mb-4 text-gray-500">
                {mode === 'existing'
                  ? 'Ready to add new modules to your course!'
                  : 'No sections yet. Create your first course section!'}
              </p>
              <Button type="button" onClick={addSection} className="bg-purple-600 text-white hover:bg-purple-700">
                <Plus className="mr-2 size-4" />
                {mode === 'existing' ? 'Add First Module' : 'Add First Section'}
              </Button>
            </div>
          )}

          {sectionsData.map((section, sectionIndex) => {
            // Determine if this is an existing section (has numeric ID < 1000000000000)
            const isExistingSection = section.id < 1000000000000;

            return (
              <div key={section.id} className="overflow-hidden rounded-lg border">
                {/* Section Header */}
                <div
                  className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
                    openSections[section.id]
                      ? isExistingSection
                        ? 'border-b bg-blue-100'
                        : 'border-b bg-purple-100'
                      : isExistingSection
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'bg-purple-50 hover:bg-purple-100'
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${isExistingSection ? 'text-blue-700' : 'text-purple-700'}`}>
                      {sectionIndex + 1}.
                    </span>
                    {isExistingSection && (
                      <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">EXISTING</span>
                    )}
                    {editingSectionId === section.id ? (
                      <Input
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        onBlur={() => setEditingSectionId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingSectionId(null);
                        }}
                        className="text-lg font-semibold"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        disabled={isExistingSection} // Disable editing for existing sections
                      />
                    ) : (
                      <span className="text-lg font-semibold text-gray-800">{section.title}</span>
                    )}
                    {!isExistingSection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSectionId(section.id);
                        }}
                        className="text-gray-500 hover:text-purple-600"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-white px-2 py-1 text-sm text-gray-600">
                      {section.lectures.length} lectures
                    </span>
                    {openSections[section.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    {!isExistingSection && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(section.id);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Content */}
                {openSections[section.id] && (
                  <div className="bg-white p-4">
                    {section.lectures.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 text-center">
                        <p className="mb-3 text-gray-500">No lectures in this section yet</p>
                        <Button
                          type="button"
                          onClick={() => addLecture(section.id)}
                          variant="outline"
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          <Plus className="mr-2 size-4" />
                          Add First Lecture
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {section.lectures.map((lecture, lectureIndex) => {
                          const lectureKey = `${section.id}-${lecture.id}`;
                          return (
                            <div key={lecture.id} className="rounded-lg border">
                              {/* Lecture Header */}
                              <div
                                className={`flex cursor-pointer items-center justify-between p-3 ${
                                  openLectures[lectureKey] ? 'border-b bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'
                                }`}
                                onClick={() => toggleLecture(section.id, lecture.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-blue-600">
                                    {sectionIndex + 1}.{lectureIndex + 1}
                                  </span>
                                  {editingLectureId === lectureKey ? (
                                    <Input
                                      value={lecture.title}
                                      onChange={(e) => updateLecture(section.id, lecture.id, 'title', e.target.value)}
                                      onBlur={() => setEditingLectureId(null)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') setEditingLectureId(null);
                                      }}
                                      autoFocus
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <span className="font-medium">{lecture.title}</span>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingLectureId(lectureKey);
                                    }}
                                    className="text-gray-400 hover:text-blue-600"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-2">
                                  {openLectures[lectureKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeLecture(section.id, lecture.id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* Lecture Content */}
                              {openLectures[lectureKey] && (
                                <div className="space-y-4 bg-white p-4">
                                  <div>
                                    <Label htmlFor={`description-${lectureKey}`} className="text-sm font-medium">
                                      📝 Lecture Description
                                    </Label>
                                    <Textarea
                                      id={`description-${lectureKey}`}
                                      placeholder="Describe what students will learn in this lecture..."
                                      value={lecture.description}
                                      onChange={(e) =>
                                        updateLecture(section.id, lecture.id, 'description', e.target.value)
                                      }
                                      className="mt-1"
                                      rows={3}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor={`video-${lectureKey}`} className="text-sm font-medium">
                                      🎥 YouTube Video URL
                                    </Label>
                                    <Input
                                      id={`video-${lectureKey}`}
                                      placeholder="https://www.youtube.com/watch?v=..."
                                      value={lecture.videoUrl}
                                      onChange={(e) =>
                                        updateLecture(section.id, lecture.id, 'videoUrl', e.target.value)
                                      }
                                      className="mt-1"
                                    />
                                    {lecture.videoUrl && (
                                      <p className="mt-1 text-xs text-green-600">✓ Video URL added</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Lecture Button */}
                    {section.lectures.length > 0 && (
                      <div className="mt-4 text-center">
                        <Button
                          type="button"
                          onClick={() => addLecture(section.id)}
                          variant="outline"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Plus className="mr-2 size-4" />
                          Add Another Lecture
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Section Button */}
          {sectionsData.length > 0 && mode === 'existing' && (
            <div className="border-t-2 border-dashed border-purple-300 pt-4">
              <div className="py-4 text-center">
                <p className="mb-3 text-sm text-gray-600">Add new modules below existing ones</p>
                <Button type="button" onClick={addSection} className="bg-purple-600 text-white hover:bg-purple-700">
                  <Plus className="mr-2 size-4" />
                  Add New Module
                </Button>
              </div>
            </div>
          )}

          {/* Add Section Button for new courses */}
          {sectionsData.length > 0 && mode === 'new' && (
            <div className="py-4 text-center">
              <Button type="button" onClick={addSection} className="bg-purple-600 text-white hover:bg-purple-700">
                <Plus className="mr-2 size-4" />
                Add New Section
              </Button>
            </div>
          )}

          <Separator className="my-6" />

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={onBack} className="border-2 border-gray-300">
              ← {mode === 'existing' ? 'Back to Course Selection' : 'Back to Course Details'}
            </Button>

            <div className="text-center">
              <p className="mb-1 text-sm text-gray-600">
                {sectionsData.length} sections, {sectionsData.reduce((acc, s) => acc + s.lectures.length, 0)} lectures
              </p>
            </div>

            <Button
              type="button"
              onClick={onNext}
              disabled={sectionsData.length === 0 || sectionsData.every((s) => s.lectures.length === 0)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Review & Submit →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
