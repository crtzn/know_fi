'use client';

import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, Clock, Play, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Web IDE Components
import { CodeEditor } from '@/components/features/web-ide/code-editor';
import { Terminal } from '@/components/features/web-ide/terminal';
import { TutorialSidebar } from '@/components/features/web-ide/tutorial-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { canisterService } from '@/services/canisterService';

// Sample quiz questions - in real app this would come from backend
const examQuestions = [
  {
    id: 1,
    question: 'What is the main topic covered in this course?',
    options: ['Web Development', 'Blockchain Technology', 'Data Science', 'Mobile Development'],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which technology stack is primarily used?',
    options: ['React and Node.js', 'Python and Django', 'Java and Spring', 'PHP and Laravel'],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: 'What is the passing score for this course?',
    options: ['60%', '70%', '80%', '90%'],
    correctAnswer: 1,
  },
];

interface Course {
  id: number;
  title: string;
  description: string;
  creator: {
    name: string;
    bio?: string;
  };
  videoUrl?: string;
  imageUrl?: string;
  category: string;
  difficulty: string;
  duration: string;
  rating: number;
  enrolledCount: number;
  totalLessons: number;
  price: number;
  tokens: number;
  sections: Section[]; // Changed from lessons to sections
  status: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  status: string;
  isExpanded?: boolean;
}

interface Lesson {
  id: number;
  title: string;
  description?: string;
  duration: string;
  videoUrl?: string;
  content?: string;
  type?: string;
  order?: number;
  isCompleted: boolean;
}

// Component that will be client-side rendered
export default function CoursePageClient() {
  const params = useParams();
  const courseId = params?.id as string;
  const { actors } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [examPassed, setExamPassed] = useState(false);
  const [showClaimBadge, setShowClaimBadge] = useState(false);
  const [examAnswers, setExamAnswers] = useState<{ [key: number]: number }>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);

  // IDE Modal state
  const [isIdeModalOpen, setIsIdeModalOpen] = useState(false);

  // Web IDE state
  const [activeFile, setActiveFile] = useState<string>('src/main.mo');
  const [files, setFiles] = useState({
    'src/main.mo': `actor HelloWorld {
  var greeting : Text = "Hello, ";

  public func setGreeting(prefix : Text) : async () {
    greeting := prefix;
  };

  public query func greet(name : Text) : async Text {
    return greeting # name # "!";
  };
}`,
    'dfx.json': `{
  "version": 1,
  "canisters": {
    "hello_world": {
      "type": "motoko",
      "main": "src/main.mo"
    }
  }
}`,
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [codeCompleted, setCodeCompleted] = useState(false);

  // Section and lesson selection functions
  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const selectLesson = (lesson: Lesson, sectionId: number) => {
    setSelectedLesson(lesson);
    setSelectedSectionId(sectionId);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const coursesActor = await canisterService.getActor('courses');
        const courses = await coursesActor.getCourses();

        // Find the course by ID
        const foundCourse = courses.find((c: any) => c.id.toString() === courseId);

        if (foundCourse) {
          // Calculate total lessons from all sections
          let totalLessons = 0;
          if (foundCourse.content.sections) {
            for (const section of foundCourse.content.sections) {
              totalLessons += section.lessons?.length || 0;
            }
          }

          const formattedCourse: Course = {
            id: Number(foundCourse.id),
            title: foundCourse.title,
            description: foundCourse.description,
            creator: {
              name: foundCourse.creator.name,
              bio: foundCourse.creator.bio?.[0] || '',
            },
            videoUrl: foundCourse.content.sections?.[0]?.lessons?.[0]?.content_url?.[0] || '',
            imageUrl: foundCourse.thumbnail_url?.[0] || '/assets/defaultCourse.png',
            category: Object.keys(foundCourse.category)[0] || 'General',
            difficulty: Object.keys(foundCourse.difficulty)[0] || 'Beginner',
            duration: `${foundCourse.content.estimated_duration_hours || 1} hour`,
            rating: foundCourse.rating || 4.5,
            enrolledCount: Number(foundCourse.student_count) || 0,
            totalLessons: totalLessons,
            price: Number(foundCourse.price_tokens) || 0,
            tokens: Number(foundCourse.token_reward) || 0,
            status: Object.keys(foundCourse.status)[0] || 'published',
            sections: foundCourse.content.sections?.map((section: any, sectionIndex: number) => ({
              id: Number(section.id),
              title: section.title || `Section ${sectionIndex + 1}`,
              description: section.description || '',
              order: Number(section.order) || sectionIndex,
              status: Object.keys(section.status || { approved: null })[0] || 'approved',
              isExpanded: sectionIndex === 0, // Expand first section by default
              lessons:
                section.lessons?.map((lesson: any, lessonIndex: number) => ({
                  id: Number(lesson.id),
                  title: lesson.title || `Lesson ${lessonIndex + 1}`,
                  duration: lesson.duration_minutes?.[0] ? `${lesson.duration_minutes[0]} min` : '10 min',
                  videoUrl: lesson.content_url?.[0] || '',
                  content: lesson.content_text?.[0] || '',
                  isCompleted: false,
                })) || [],
            })) || [
              {
                id: 1,
                title: 'Course Content',
                description: foundCourse.description,
                order: 0,
                status: 'approved',
                isExpanded: true,
                lessons: [
                  {
                    id: 1,
                    title: 'Main Course Content',
                    duration: `${foundCourse.content.estimated_duration_hours || 1} hour`,
                    videoUrl: foundCourse.content.sections?.[0]?.lessons?.[0]?.content_url?.[0] || '',
                    content: foundCourse.content.introduction || foundCourse.description,
                    isCompleted: false,
                  },
                ],
              },
            ],
          };

          setCourse(formattedCourse);
          // Set the first lesson from the first section as selected
          if (formattedCourse.sections.length > 0 && formattedCourse.sections[0].lessons.length > 0) {
            setSelectedLesson(formattedCourse.sections[0].lessons[0]);
            setSelectedSectionId(formattedCourse.sections[0].id);
            // Initialize expanded sections - expand first section by default
            setExpandedSections(new Set([formattedCourse.sections[0].id]));
          }
        } else {
          // Handle static courses for demo purposes
          if (courseId === '7' || courseId === '999') {
            const staticCourse: Course = {
              id: parseInt(courseId),
              title: 'Motoko Fundamentals',
              description:
                'Learn Motoko programming language for Internet Computer development. Build smart contracts and canisters with hands-on coding experience using our integrated Web IDE.',
              creator: {
                name: 'KnowFi Academy',
                bio: 'Official KnowFi Motoko curriculum for ICP developers',
              },
              videoUrl: 'https://www.youtube.com/watch?v=0JVGWkd4tgQ', // Motoko Variables, Types, Functions & Loops
              imageUrl: '/assets/defaultCourse.png',
              category: 'programming',
              difficulty: 'Beginner',
              duration: '10 hours',
              rating: 4.9,
              enrolledCount: 850,
              totalLessons: 15,
              price: 0,
              tokens: 200,
              status: 'published',
              sections: [
                {
                  id: 1,
                  title: 'Motoko Basics',
                  description: 'Introduction to Motoko programming language',
                  order: 1,
                  status: 'approved',
                  isExpanded: true,
                  lessons: [
                    {
                      id: 1,
                      title: 'Variables, Types, Functions & Loops',
                      description:
                        'Learn about Motoko fundamentals: variables, data types, functions, and control structures',
                      content:
                        'Welcome to Motoko! Learn the core concepts of variables, types, functions, and loops in the Motoko programming language.',
                      type: 'video',
                      duration: '25 min',
                      order: 1,
                      videoUrl: 'https://www.youtube.com/watch?v=0JVGWkd4tgQ',
                      isCompleted: false,
                    },
                    {
                      id: 2,
                      title: 'Anatomy of a Motoko Project',
                      description: 'Understand the structure and components of a Motoko project',
                      content: 'Explore how Motoko projects are organized, file structure, and key components.',
                      type: 'video',
                      duration: '20 min',
                      order: 2,
                      videoUrl: 'https://www.youtube.com/watch?v=_T7GgPxxSKo',
                      isCompleted: false,
                    },
                    {
                      id: 3,
                      title: 'Hands-on: Basic Motoko Syntax',
                      description: 'Practice writing basic Motoko code with our Web IDE',
                      content:
                        'Practice declaring variables, writing functions, and using basic Motoko syntax in our integrated development environment.',
                      type: 'interactive',
                      duration: '30 min',
                      order: 3,
                      isCompleted: false,
                    },
                  ],
                },
                {
                  id: 2,
                  title: 'Data Structures & Collections',
                  description: 'Working with Arrays, Lists, and HashMap in Motoko',
                  order: 2,
                  status: 'approved',
                  isExpanded: false,
                  lessons: [
                    {
                      id: 4,
                      title: 'Arrays, Lists & Buffer',
                      description: 'Master Motoko data structures for collections',
                      content:
                        'Learn how to work with different collection types in Motoko including Arrays, Lists, and Buffers.',
                      type: 'video',
                      duration: '22 min',
                      order: 1,
                      videoUrl: 'https://www.youtube.com/watch?v=mOZFOoffYqk',
                      isCompleted: false,
                    },
                    {
                      id: 5,
                      title: 'Text, Characters & Iterators',
                      description: 'Work with text processing and iteration in Motoko',
                      content:
                        'Understand how to manipulate text, work with characters, and use iterators effectively.',
                      type: 'video',
                      duration: '18 min',
                      order: 2,
                      videoUrl: 'https://www.youtube.com/watch?v=sE5Nf7aDYpA',
                      isCompleted: false,
                    },
                    {
                      id: 6,
                      title: 'HashMap & CRUD Operations',
                      description: 'Implement Create, Read, Update, Delete operations with HashMap',
                      content: 'Learn to use HashMap for storing and manipulating data with CRUD operations.',
                      type: 'video',
                      duration: '25 min',
                      order: 3,
                      videoUrl: 'https://www.youtube.com/watch?v=akI_IuzCHgE',
                      isCompleted: false,
                    },
                  ],
                },
                {
                  id: 3,
                  title: 'Advanced Concepts',
                  description: 'Intercanister calls, upgrades, and error handling',
                  order: 3,
                  status: 'approved',
                  isExpanded: false,
                  lessons: [
                    {
                      id: 7,
                      title: 'Intercanister Calls',
                      description: 'Learn how canisters communicate with each other',
                      content:
                        'Master the art of making calls between different canisters in the Internet Computer ecosystem.',
                      type: 'video',
                      duration: '28 min',
                      order: 1,
                      videoUrl: 'https://www.youtube.com/watch?v=lHDDjLCZwnk',
                      isCompleted: false,
                    },
                    {
                      id: 8,
                      title: 'Upgrades & Memory Management',
                      description: 'Handle canister upgrades and memory persistence',
                      content:
                        'Understand how to upgrade canisters while preserving data and managing memory effectively.',
                      type: 'video',
                      duration: '24 min',
                      order: 2,
                      videoUrl: 'https://www.youtube.com/watch?v=BafCxFj8o2U',
                      isCompleted: false,
                    },
                    {
                      id: 9,
                      title: 'Practice: Build a Complete Canister',
                      description: 'Apply your knowledge to build a functional canister',
                      content:
                        "Put everything together by building a complete canister that demonstrates all the concepts you've learned.",
                      type: 'interactive',
                      duration: '45 min',
                      order: 3,
                      isCompleted: false,
                    },
                  ],
                },
              ],
            };
            setCourse(staticCourse);
            setSelectedLesson(staticCourse.sections[0].lessons[0]);
            setSelectedSectionId(staticCourse.sections[0].id);
            setExpandedSections(new Set([staticCourse.sections[0].id]));
          } else {
            setError('Course not found');
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Listen for video completion events
  useEffect(() => {
    const handleVideoCompleted = (event: CustomEvent) => {
      console.log('Video completed:', event.detail);
      setVideoCompleted(true);
    };

    window.addEventListener('videoCompleted', handleVideoCompleted as EventListener);

    return () => {
      window.removeEventListener('videoCompleted', handleVideoCompleted as EventListener);
    };
  }, []);

  const handleExamAnswer = (questionId: number, answerIndex: number) => {
    setExamAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const submitExam = () => {
    let correctAnswers = 0;
    examQuestions.forEach((question) => {
      if (examAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / examQuestions.length) * 100);
    setExamScore(score);
    setExamSubmitted(true);

    // Passing score is 70%
    if (score >= 70) {
      setExamPassed(true);
      setShowClaimBadge(true);
    }
  };

  const [claimedBadge, setClaimedBadge] = useState<any>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const claimBadge = async () => {
    try {
      const courseName = course?.title || 'Course Completion';
      const tokenId = await actors.nft.mintCourseCompletionCertificate(courseName);
      const allNFTs = await actors.nft.getAllNFTs();
      const mintedBadge = allNFTs.find(([id]: any) => id === tokenId);

      setClaimedBadge(mintedBadge);
      setIsClaimModalOpen(true);
    } catch (error) {
      console.error('Error claiming badge:', error);
    }
  };

  const extractText = (value: any) => {
    return value?.Text || value;
  };

  const shareOnTwitter = () => {
    if (!claimedBadge) return;
    const imageUrl = extractText(claimedBadge[1].metadata.find(([key]: any) => key === 'image')[1]);
    const url = `https://twitter.com/intent/tweet?text=I%20just%20earned%20a%20badge%20for%20completing%20${course?.title}!%20Check%20it%20out:%20${imageUrl}%20Credits%20to%20KnowFi%20for%20creating%20this%20platform!`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    if (!claimedBadge) return;
    const imageUrl = extractText(claimedBadge[1].metadata.find(([key]: any) => key === 'image')[1]);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${imageUrl}`;
    window.open(url, '_blank');
  };

  // Web IDE helper functions
  const handleFileRename = (oldPath: string, newPath: string) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      newFiles[newPath] = newFiles[oldPath];
      delete newFiles[oldPath];

      if (activeFile === oldPath) {
        setActiveFile(newPath);
      }

      return newFiles;
    });
  };

  const handleFileCopy = (sourcePath: string, targetPath: string) => {
    setFiles((prev) => ({
      ...prev,
      [targetPath]: prev[sourcePath],
    }));
  };

  const handleFolderCreate = (path: string) => {
    const placeholderPath = `${path}/.gitkeep`;
    setFiles((prev) => ({
      ...prev,
      [placeholderPath]: '# This file keeps the folder in version control',
    }));
  };

  const handleLoadTutorial = (code: string) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: code,
    }));
  };

  const handleRunCode = async () => {
    setIsDeploying(true);
    console.log('[Course IDE] Starting deployment...');

    // Simulate deployment process
    setTimeout(() => {
      console.log('[Course IDE] Deployment complete!');
      setIsDeploying(false);
      setCodeCompleted(true);
    }, 3000);
  };

  // Check if this course should show web IDE (Motoko/ICP courses or programming courses with interactive lessons)
  const shouldShowWebIDE = () => {
    const hasInteractiveLessons =
      selectedLesson?.type === 'interactive' ||
      course?.sections?.some((section) => section.lessons?.some((lesson) => lesson.type === 'interactive'));

    return (
      course?.category?.toLowerCase().includes('motoko') ||
      course?.category?.toLowerCase().includes('icp') ||
      course?.title?.toLowerCase().includes('motoko') ||
      course?.title?.toLowerCase().includes('canister') ||
      (course?.category?.toLowerCase().includes('programming') && hasInteractiveLessons)
    );
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const renderVideoPlayer = (videoUrl: string) => {
    const youtubeId = extractYouTubeVideoId(videoUrl);

    if (youtubeId) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
          <iframe
            id={`youtube-player-${selectedLesson?.id}`}
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
            title="Course Video"
            className="h-full w-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Demo button to mark video as completed */}
          {!videoCompleted && (
            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-blue-600 bg-opacity-90 p-3 text-white">
              <p className="mb-2 text-sm">For demo purposes:</p>
              <Button
                onClick={() => setVideoCompleted(true)}
                className="bg-white text-sm text-blue-600 hover:bg-gray-100"
              >
                Mark Video as Completed
              </Button>
            </div>
          )}

          {/* Video completion detector */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (window.YT) {
                  const player = new YT.Player('youtube-player-${selectedLesson?.id}', {
                    events: {
                      'onStateChange': function(event) {
                        if (event.data === YT.PlayerState.ENDED) {
                          window.dispatchEvent(new CustomEvent('videoCompleted', {
                            detail: { lessonId: ${selectedLesson?.id} }
                          }));
                        }
                      }
                    }
                  });
                }
              `,
            }}
          />

          {videoCompleted && (
            <div className="absolute right-4 top-4 flex items-center rounded-full bg-green-500 px-3 py-1 text-sm text-white">
              <span className="mr-1">✓</span>
              Video Completed
            </div>
          )}
        </div>
      );
    }

    // Fallback for non-YouTube videos or invalid URLs
    return (
      <div className="relative flex aspect-video w-full items-center justify-center rounded-lg bg-gray-900">
        <div className="text-center">
          <Play className="mx-auto mb-2 h-12 w-12 text-gray-400" />
          <p className="text-gray-400">Video not available</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Course Not Found</h2>
          <p className="mb-6 text-gray-600">{error || 'The requested course could not be found.'}</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Mobile Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1">
            {/* Course Header */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="hidden items-center text-purple-600 hover:text-purple-700 lg:inline-flex"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => {
                      setVideoCompleted(false);
                      setExamSubmitted(false);
                      setExamPassed(false);
                      setExamScore(0);
                      setShowClaimBadge(false);
                      setClaimedBadge(null);
                      setCodeCompleted(false);
                      setIsDeploying(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    🔄 Reset Demo
                  </Button>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-sm">{course.enrolledCount} enrolled</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-sm">{course.duration}</span>
                  </div>
                </div>
              </div>

              <h1 className="mb-2 text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mb-4 text-gray-600">{course.description}</p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.difficulty}</Badge>
                {course.tokens > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">{course.tokens} KNF Tokens</Badge>
                )}
              </div>
            </div>

            {/* Video Player */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="mb-2 text-lg font-semibold">{selectedLesson?.title || 'Course Content'}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="ml-1">{selectedLesson?.duration}</span>
                  </div>
                </div>

                {selectedLesson?.videoUrl ? (
                  renderVideoPlayer(selectedLesson.videoUrl)
                ) : (
                  <div className="relative flex aspect-video w-full items-center justify-center rounded-lg bg-gray-900">
                    <div className="text-center">
                      <Play className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-gray-400">No video available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={`grid w-full ${shouldShowWebIDE() ? 'grid-cols-5' : 'grid-cols-4'}`}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                {shouldShowWebIDE() && (
                  <Button
                    onClick={() => setIsIdeModalOpen(true)}
                    variant="ghost"
                    className={`h-10 justify-center whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${codeCompleted ? 'bg-green-50 text-green-700' : ''}`}
                  >
                    Code Lab {codeCompleted && '✓'}
                  </Button>
                )}
                <TabsTrigger
                  value="exam"
                  disabled={!videoCompleted && !codeCompleted}
                  className={videoCompleted || codeCompleted ? 'bg-green-50 text-green-700' : ''}
                >
                  Final Exam {(videoCompleted || codeCompleted) && '✓'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5" />
                      <span className="ml-2">Course Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{course.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Total Lessons:</span>
                        <span className="ml-2 text-gray-600">{course.totalLessons}</span>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2 text-gray-600">{course.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>{selectedLesson?.content || course.description}</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-lg font-semibold">{course.creator.name}</h4>
                    <p className="mt-2 text-gray-600">
                      {course.creator.bio || 'Experienced educator passionate about sharing knowledge.'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Web IDE Tab Content - Removed, now using modal */}

              <TabsContent value="exam">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Final Exam
                      {videoCompleted && (
                        <Badge className="bg-green-100 text-green-800">Video Completed - Exam Unlocked</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Complete this exam to earn your course completion badge. Passing score: 70%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!examSubmitted ? (
                      <div className="space-y-6 text-center">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                          <h3 className="mb-2 text-lg font-semibold text-blue-900">🎓 Final Assessment</h3>
                          <p className="mb-4 text-blue-700">
                            You have successfully completed the video content. Click the button below to mark your
                            course as complete and claim your badge!
                          </p>
                          <Button
                            onClick={() => {
                              setExamSubmitted(true);
                              setExamPassed(true);
                              setExamScore(100);
                              setShowClaimBadge(true);
                            }}
                            className="bg-green-600 px-8 py-3 text-lg text-white hover:bg-green-700"
                          >
                            ✓ Complete Course & Pass Exam
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-center">
                        <div className={`text-6xl ${examPassed ? 'text-green-500' : 'text-red-500'}`}>
                          {examPassed ? '🎉' : '😞'}
                        </div>
                        <h3 className="text-2xl font-bold">{examPassed ? 'Congratulations!' : 'Keep Learning!'}</h3>
                        <p className="text-lg">
                          Your score:{' '}
                          <span className={`font-bold ${examPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {examScore}%
                          </span>
                        </p>
                        <p className="text-gray-600">
                          {examPassed
                            ? 'You passed the exam! You can now claim your completion badge.'
                            : 'You need 70% or higher to pass. Please review the course content and try again.'}
                        </p>

                        {examPassed && showClaimBadge ? (
                          <div className="space-y-4">
                            <Button
                              onClick={claimBadge}
                              className="bg-green-600 px-8 py-3 text-lg text-white hover:bg-green-700"
                            >
                              🏆 Claim Your Badge
                            </Button>
                            <p className="text-sm text-gray-500">This will mint an NFT certificate of completion</p>
                          </div>
                        ) : (
                          !examPassed && (
                            <Button
                              onClick={() => {
                                setExamSubmitted(false);
                                setExamAnswers({});
                                setExamScore(0);
                              }}
                              variant="outline"
                            >
                              Retake Exam
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>
                  {course.totalLessons} lesson{course.totalLessons !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Video Progress</span>
                    <span className={videoCompleted ? 'text-green-600' : 'text-gray-500'}>
                      {videoCompleted ? 'Completed ✓' : 'In Progress'}
                    </span>
                  </div>
                  {shouldShowWebIDE() && (
                    <div className="flex justify-between text-sm">
                      <span>Code Lab</span>
                      <span className={codeCompleted ? 'text-green-600' : 'text-gray-500'}>
                        {codeCompleted ? 'Completed ✓' : 'Available'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Final Exam</span>
                    <span
                      className={
                        examPassed
                          ? 'text-green-600'
                          : examSubmitted
                            ? 'text-red-600'
                            : videoCompleted || codeCompleted
                              ? 'text-blue-600'
                              : 'text-gray-500'
                      }
                    >
                      {examPassed ? 'Passed ✓' : examSubmitted ? 'Failed ✗' : videoCompleted ? 'Available' : 'Locked'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Badge Claim</span>
                    <span className={showClaimBadge ? 'text-green-600' : 'text-gray-500'}>
                      {showClaimBadge ? 'Available ✓' : 'Locked'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t pt-3">
                  {course.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="mb-3">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-center justify-between rounded-lg border-2 border-transparent bg-gray-100 p-3 text-left transition-colors hover:bg-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-medium text-white">
                              {sectionIndex + 1}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{section.title}</h4>
                            <p className="text-xs text-gray-500">
                              {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
                              {section.status === 'pending' && (
                                <span className="ml-2 inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                  Pending Approval
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </button>

                      {/* Section Lessons - Only show if section is expanded and approved */}
                      {expandedSections.has(section.id) && section.status === 'approved' && (
                        <div className="ml-6 mt-2 space-y-1">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(lesson, section.id)}
                              className={`w-full rounded-lg p-3 text-left transition-colors ${
                                selectedLesson?.id === lesson.id && selectedSectionId === section.id
                                  ? 'border-2 border-purple-200 bg-purple-50'
                                  : 'border-2 border-transparent bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="mt-1 flex-shrink-0">
                                  <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
                                      selectedLesson?.id === lesson.id && selectedSectionId === section.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                    }`}
                                  >
                                    {lesson.isCompleted ? (
                                      <span>✓</span>
                                    ) : lesson.videoUrl ? (
                                      <Play className="h-3 w-3" />
                                    ) : (
                                      `${sectionIndex + 1}.${lessonIndex + 1}`
                                    )}
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="truncate text-sm font-medium text-gray-900">{lesson.title}</h5>
                                  <p className="text-xs text-gray-500">{lesson.duration}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Show pending message for pending sections */}
                      {expandedSections.has(section.id) && section.status === 'pending' && (
                        <div className="ml-6 mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                          <p className="text-sm text-yellow-800">
                            This section is pending admin approval and will be available soon.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Web IDE Modal */}
      {isIdeModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 text-white">
          {/* Full Screen IDE like Scrimba */}
          <div className="h-screen w-full bg-gray-900 text-white">
            {/* Top Bar */}
            <div className="flex h-14 items-center justify-between border-b border-gray-700 bg-gray-800 px-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-white">Motoko IDE</h1>
                <span className="text-sm text-gray-400">Interactive Learning Environment</span>
              </div>
              <div className="flex items-center space-x-4">
                {codeCompleted && <Badge className="bg-green-600 text-white">Exercise Complete ✓</Badge>}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsIdeModalOpen(false)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  ← Exit IDE
                </Button>
              </div>
            </div>

            {/* Main IDE Layout */}
            <div className="flex h-[calc(100vh-56px)]">
              {/* File Explorer */}
              <div className="flex w-80 flex-col border-r border-gray-700 bg-gray-800">
                <div className="flex h-12 items-center border-b border-gray-700 bg-gray-900 px-6">
                  <span className="text-sm font-medium uppercase tracking-wide text-gray-100">Explorer</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {/* File Tree with proper text colors */}
                    <div className="space-y-1">
                      <div className="flex cursor-pointer items-center space-x-2 rounded p-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                        <span className="text-blue-400">📁</span>
                        <span className="text-sm">src</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        <div
                          className={`flex cursor-pointer items-center space-x-2 rounded p-2 ${
                            activeFile === 'src/main.mo'
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                          onClick={() => setActiveFile('src/main.mo')}
                        >
                          <span className="text-purple-400">📄</span>
                          <span className="text-sm">main.mo</span>
                        </div>
                      </div>
                      <div className="flex cursor-pointer items-center space-x-2 rounded p-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                        <span className="text-yellow-400">📄</span>
                        <span className="text-sm">dfx.json</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Editor Area */}
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Editor Tabs */}
                <div className="flex h-12 items-center border-b border-gray-700 bg-gray-800 px-6">
                  <div className="rounded-t border-l border-r border-t border-gray-600 bg-gray-900 px-4 py-2 text-sm text-white">
                    {activeFile}
                  </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 bg-gray-900">
                  <CodeEditor
                    file={activeFile}
                    content={files[activeFile] || ''}
                    onChange={(content) => setFiles((prev) => ({ ...prev, [activeFile]: content }))}
                  />
                </div>

                {/* Terminal */}
                <div className="h-52 border-t border-gray-700 bg-black">
                  <div className="flex h-10 items-center border-b border-gray-700 bg-gray-800 px-6">
                    <span className="text-sm font-medium uppercase tracking-wide text-gray-300">Terminal</span>
                  </div>
                  <div className="h-42 p-2">
                    <Terminal />
                  </div>
                </div>
              </div>

              {/* Tutorial Sidebar - Made wider and more responsive */}
              <div className="flex w-[450px] flex-col overflow-hidden border-l border-gray-700 bg-gray-800">
                <div className="flex h-12 items-center border-b border-gray-700 bg-gray-900 px-6">
                  <span className="text-sm font-medium uppercase tracking-wide text-gray-100">Motoko Tutorial</span>
                </div>
                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                  <div className="max-w-full overflow-hidden">
                    <TutorialSidebar
                      onLoadTutorial={handleLoadTutorial}
                      onRunCode={handleRunCode}
                      isDeploying={isDeploying}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-between border-t border-gray-700 bg-gray-800 px-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Ready • Motoko</span>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-400">dfx stopped</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-400">Line 1, Column 1</span>
                <span className="text-xs text-gray-400">Spaces: 2</span>
                <span className="text-xs text-gray-400">UTF-8</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge Claim Modal */}
      {isClaimModalOpen && claimedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsClaimModalOpen(false)}
        >
          <div
            className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-xl font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
              <div className="mb-4 flex justify-center">
                <img
                  src={extractText(claimedBadge[1].metadata.find(([key]: any) => key === 'image')[1])}
                  alt="Badge"
                  className="h-24 w-24"
                />
              </div>
              <h2 className="mb-2 text-xl font-bold">
                {extractText(claimedBadge[1].metadata.find(([key]: any) => key === 'name')[1])}
              </h2>
              <p className="mb-6 text-gray-600">
                {extractText(claimedBadge[1].metadata.find(([key]: any) => key === 'description')[1])}
              </p>
              <div className="space-y-2">
                <Button onClick={shareOnTwitter} className="w-full bg-blue-500 hover:bg-blue-600">
                  Share on Twitter
                </Button>
                <Button onClick={shareOnLinkedIn} className="w-full bg-blue-700 hover:bg-blue-800">
                  Share on LinkedIn
                </Button>
                <Button onClick={() => setIsClaimModalOpen(false)} variant="outline" className="mt-2 w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
