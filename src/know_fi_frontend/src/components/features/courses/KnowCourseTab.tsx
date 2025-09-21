'use client';

import { RefreshCw, Star } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { canisterService } from '@/services/canisterService';

export function KnowCourseTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load courses from backend
  const loadCourses = async () => {
    try {
      setLoading(true);

      // Check if canister service is initialized
      if (!canisterService.isInitialized()) {
        console.log('Canister service not initialized yet, using mock data');
        setCourses(mockCourses);
        setLoading(false);
        return;
      }

      const coursesActor = canisterService.getActor('courses');
      const backendCourses = await coursesActor.getCourses();

      // Convert backend courses to display format
      const convertedCourses = backendCourses.map((course: any, index: number) => {
        // Handle category variant from Motoko backend
        const categoryKey = Object.keys(course.category)[0];
        const category = categoryKey || 'other';

        // Set color bar based on category
        const getColorBar = (cat: string) => {
          switch (cat) {
            case 'trading':
              return 'bg-teal-500';
            case 'blockchain':
            case 'icp':
              return 'bg-orange-500';
            case 'ai':
              return 'bg-gray-600';
            case 'motoko':
              return 'bg-blue-500';
            case 'programming':
              return 'bg-green-500';
            default:
              return 'bg-purple-500';
          }
        };

        return {
          id: Number(course.id),
          title: course.title,
          description: course.description,
          rating: course.rating || 4.5,
          tokens: `${course.token_reward} Tokens`,
          category: category,
          colorBar: getColorBar(category),
        };
      });

      console.log('Loaded courses from backend:', convertedCourses);

      // Add our static programming course for demo
      const staticProgrammingCourse = {
        id: 999, // Use a high ID to avoid conflicts
        title: 'Motoko Fundamentals',
        description:
          'Learn Motoko programming language for Internet Computer development. Build smart contracts and canisters with hands-on coding experience.',
        rating: 4.9,
        tokens: '200 Tokens',
        category: 'programming',
        colorBar: 'bg-green-500',
      };

      // Combine backend courses with our static course
      const allCourses = [...convertedCourses, staticProgrammingCourse];
      setCourses(allCourses);
      setError(null);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Failed to load courses from backend');
      // Fallback to mock data
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const mockCourses = [
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
    {
      id: 7,
      title: 'Web Development with JavaScript',
      description:
        'Learn modern web development with JavaScript, HTML, CSS, and build interactive projects using our integrated Web IDE.',
      rating: 4.8,
      tokens: '150 Token',
      category: 'programming',
      colorBar: 'bg-green-500',
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
          <Link href={`/course/${course.id}`}>
            <button className="rounded-full bg-purple-700 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-purple-800">
              Get Course →
            </button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="container mt-8 flex items-center justify-center px-4">
      <Tabs defaultValue="all-category" className="w-full max-w-6xl">
        {/* Error message */}
        {error && (
          <div className="mb-4 rounded border border-yellow-400 bg-yellow-100 p-4 text-yellow-700">{error}</div>
        )}

        {/* Refresh button */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

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

        {/* Loading state - positioned after tabs */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="mr-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
            <span className="text-gray-600">Loading courses...</span>
          </div>
        )}

        {/* Show content only when not loading */}
        {!loading && (
          <>
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
                {courses
                  .filter((course) => course.category === 'programming')
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
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
          </>
        )}
      </Tabs>
    </div>
  );
}
