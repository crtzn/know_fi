'use client';

import { BookOpen, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreatorCourses } from '@/hooks/useCreatorCourses';

interface CourseSelectionStepProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNew: () => void;
  onAddToExisting: (courseId: number) => void;
}

export function CourseSelectionStep({ open, onOpenChange, onCreateNew, onAddToExisting }: CourseSelectionStepProps) {
  const { courses, isLoading } = useCreatorCourses();
  const approvedCourses = courses.filter((course) => course.status === 'approved');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">📚 Choose Your Action</DialogTitle>
          <p className="text-gray-600">Create a new course or add modules to an existing course</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Course Option */}
          <Card className="border-2 border-green-300 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-200 p-3">
                    <Plus className="size-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">Create New Course</h3>
                    <p className="text-green-600">Start a completely new course from scratch</p>
                  </div>
                </div>
                <Button onClick={onCreateNew} className="bg-green-600 text-white hover:bg-green-700">
                  Create New
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add to Existing Course Section */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="size-5" />
              Add Modules to Existing Course
            </h3>

            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Loading your courses...</p>
              </div>
            ) : approvedCourses.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="p-6 text-center">
                  <p className="mb-2 text-gray-500">No approved courses found</p>
                  <p className="text-sm text-gray-400">Create your first course to start adding modules</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approvedCourses.map((course) => (
                  <Card key={course.id} className="border transition-colors hover:border-purple-300">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="line-clamp-2 text-lg font-bold">{course.title}</h4>
                          <p className="line-clamp-2 text-sm text-gray-600">{course.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700">
                            {course.category}
                          </span>
                          <span className="text-gray-500">{course.content.total_lectures} lectures</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-yellow-600">⭐ {course.rating.toFixed(1)}</span>
                            <span className="ml-2 text-gray-500">{course.student_count} students</span>
                          </div>
                          <Button
                            onClick={() => onAddToExisting(course.id)}
                            size="sm"
                            className="bg-purple-600 text-white hover:bg-purple-700"
                          >
                            Add Module
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
