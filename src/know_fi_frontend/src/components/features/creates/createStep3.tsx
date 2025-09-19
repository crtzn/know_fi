'use client';

import { ChevronDown, ChevronUp, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Lecture = {
  id: number;
  title: string;
  description: string;
  open: boolean;
};

type Section = {
  id: number;
  title: string;
  lectures: Lecture[];
  open: boolean;
};

export function CreateStep3({
  open,
  onOpenChange,
  onBack,
  onNext,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [sections, setSections] = useState<Section[]>([
    {
      id: 1,
      title: 'Course Introduction',
      open: false,
      lectures: [],
    },
  ]);

  const toggleSection = (id: number) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, open: !s.open } : s)));
  };

  const toggleLecture = (sectionId: number, lectureId: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.map((l) => (l.id === lectureId ? { ...l, open: !l.open } : l)),
            }
          : s,
      ),
    );
  };

  const addLecture = (sectionId: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: [
                ...s.lectures,
                {
                  id: Date.now(),
                  title: `Lecture ${s.lectures.length + 1}`,
                  description: '',
                  open: true,
                },
              ],
            }
          : s,
      ),
    );
  };

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now(), title: `Section Title ${sections.length + 1}`, open: false, lectures: [] },
    ]);
  };

  const removeLecture = (sectionId: number, lectureId: number) => {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, lectures: s.lectures.filter((l) => l.id !== lectureId) } : s)),
    );
  };

  const removeSection = (sectionId: number) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>III. Course Content</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id}>
              {/* Section Header */}
              <div
                className={`flex items-center justify-between border px-2 py-1 ${
                  section.open ? 'bg-gray-100 font-bold' : 'bg-gray-300'
                } cursor-pointer`}
                onClick={() => toggleSection(section.id)}
              >
                <span>{section.title}</span>
                <div className="flex items-center gap-2">
                  {section.open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(section.id);
                    }}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {section.open && (
                <div className="border p-3">
                  {section.lectures.map((lecture) => (
                    <div key={lecture.id} className="mb-3">
                      {/* Lecture Header */}
                      <div
                        className="flex cursor-pointer items-center justify-between bg-gray-100 px-2 py-1"
                        onClick={() => toggleLecture(section.id, lecture.id)}
                      >
                        <span>{lecture.title}</span>
                        <div className="flex items-center gap-2">
                          {lecture.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLecture(section.id, lecture.id);
                            }}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Lecture Content */}
                      {lecture.open && (
                        <div className="border p-3">
                          <Textarea
                            placeholder="Your lecture description here..."
                            value={lecture.description}
                            onChange={(e) => {
                              setSections(
                                sections.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        lectures: s.lectures.map((l) =>
                                          l.id === lecture.id ? { ...l, description: e.target.value } : l,
                                        ),
                                      }
                                    : s,
                                ),
                              );
                            }}
                          />
                          <div className="mt-2 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 p-4 text-sm text-gray-500">
                            <Upload size={20} />
                            <span>Upload Video</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="text-center">
                    <Button
                      type="button"
                      className="border-2 border-black bg-green-200 font-bold text-black hover:bg-green-300"
                      onClick={() => addLecture(section.id)}
                    >
                      Add Lecture
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Section */}
          <div className="text-center">
            <Button
              type="button"
              className="border-2 border-black bg-green-200 font-bold text-black hover:bg-green-300"
              onClick={addSection}
            >
              Add Section
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              type="button"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="rounded-md border-2 border-black bg-white text-black hover:bg-gray-100"
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
