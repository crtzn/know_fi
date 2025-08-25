import { Star } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function KnowCourseTab() {
  const courses = [
    {
      id: 1,
      title: 'MOTOKO Fundamentals',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt.',
      rating: 4.5,
      tokens: '120 Token',
      category: 'trading',
      colorBar: 'bg-teal-500',
    },
    {
      id: 2,
      title: 'ICP 101',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt.',
      rating: 4.5,
      tokens: '120 Token',
      category: 'blockchain',
      colorBar: 'bg-orange-500',
    },
    {
      id: 3,
      title: 'Artificial Intelligence',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt.',
      rating: 4.5,
      tokens: '120 Token',
      category: 'ai',
      colorBar: 'bg-gray-600',
    },
    {
      id: 4,
      title: 'Trading 101',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt.',
      rating: 4.5,
      tokens: '120 Token',
      category: 'trading',
      colorBar: 'bg-teal-500',
    },
    {
      id: 5,
      title: 'Blockchain Fundamentals',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt.',
      rating: 4.5,
      tokens: '120 Token',
      category: 'blockchain',
      colorBar: 'bg-orange-500',
    },
    {
      id: 6,
      title: 'Artificial Intelligence',
      description: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt.',
      rating: 4.5,
      tokens: '120 Token',
      category: 'ai',
      colorBar: 'bg-gray-600',
    },
  ];

  const CourseCard = ({ course }) => (
    <div className="conatiner">
      <Card className="rounded-none border-black bg-gray-100 shadow-xl transition-all duration-200 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <CardHeader className="relative">
          <div className={`absolute left-5 top-8 h-10 w-1 ${course.colorBar}`}></div>
          <div className="pl-4">
            <CardTitle className="mb-2 text-xl font-bold text-gray-900">{course.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed text-gray-600">{course.description}</CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex items-center justify-between border-t-2 border-gray-300 pt-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{course.rating}</span>
            </div>
            <div className="text-sm font-medium text-gray-700">{course.tokens}</div>
            <div className="text-xs text-gray-500">Access This Course</div>
          </div>
          <button className="rounded-full bg-purple-700 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-purple-800">
            Get Course →
          </button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="container mt-8 flex items-center justify-center px-4">
      <Tabs defaultValue="all-category" className="w-full max-w-6xl">
        <TabsList className="grid h-auto w-full grid-cols-5 gap-0 border-none bg-transparent p-0">
          <TabsTrigger
            value="all-category"
            className="rounded-none border border-purple-700 px-6 py-4 text-base font-semibold text-black hover:bg-gray-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            All Category
          </TabsTrigger>
          <TabsTrigger
            value="trading"
            className="rounded-none border-b border-r border-t border-purple-700 bg-white px-6 py-4 text-base font-semibold text-black hover:bg-gray-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Trading
          </TabsTrigger>
          <TabsTrigger
            value="programming"
            className="rounded-none border-b border-r border-t border-purple-700 bg-white px-6 py-4 text-base font-semibold text-black hover:bg-gray-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Programming
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="rounded-none border-b border-r border-t border-purple-700 bg-white px-6 py-4 text-base font-semibold text-black hover:bg-gray-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            AI
          </TabsTrigger>
          <TabsTrigger
            value="creatives"
            className="rounded-none border-b border-r border-t border-purple-700 bg-white px-6 py-4 text-base font-semibold text-black hover:bg-gray-300 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Creatives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-category" className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trading" className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter((course) => course.category === 'trading')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="programming" className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full py-12 text-center text-gray-500">Programming courses coming soon...</div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter((course) => course.category === 'ai')
              .map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="creatives" className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full py-12 text-center text-gray-500">Creative courses coming soon...</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
