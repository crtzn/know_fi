import CoursePageClient from './CoursePageClient';

// Generate static params for Next.js export
export async function generateStaticParams() {
  // Return static course IDs for static export
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '999' }, // Our static programming course
  ];
}

// Main page component that handles static generation
export default function CoursePage() {
  return <CoursePageClient />;
}
