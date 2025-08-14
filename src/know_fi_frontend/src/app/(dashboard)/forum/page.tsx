'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

export default function ForumPage() {
  const { actors, isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch all posts
  const fetchPosts = async () => {
    if (!actors?.forum) return;

    try {
      setIsLoading(true);
      setError('');
      const allPosts = await actors.forum.getAllPosts();
      // Sort posts by timestamp (newest first)
      const sortedPosts = [...allPosts].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when actor is available
  useEffect(() => {
    if (actors?.forum) {
      fetchPosts();
    }
  }, [actors?.forum]);

  // Handle post creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      login();
      return;
    }

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await actors.forum.createPost(title, content);
      setTitle('');
      setContent('');
      // Refresh posts after creating a new one
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format timestamp to human-readable format
  const formatTimeAgo = (timestamp) => {
    // Convert nanoseconds to milliseconds
    const date = new Date(Number(timestamp) / 1000000);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Community Forum</h1>

      {/* Create Post Form */}
      <div className="mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Ask a Question</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="What's your question about?"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Describe your question in detail..."
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className={`w-full rounded-md px-4 py-2 font-medium text-white ${
              isSubmitting || !title.trim() || !content.trim()
                ? 'cursor-not-allowed bg-blue-300'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {!isAuthenticated ? 'Login to Post' : isSubmitting ? 'Posting...' : 'Post Question'}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="mb-4">
        <h2 className="mb-6 text-xl font-semibold">Recent Questions</h2>

        {isLoading || authLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold">{post.title}</h3>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>Posted by: {post.authorId.toString().slice(0, 10)}...</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeAgo(post.timestamp)}</span>
                </div>

                <div className="mt-4">
                  <p
                    className={`text-gray-700 ${expandedPost !== post.id && post.content.length > 200 ? 'line-clamp-3' : ''}`}
                  >
                    {post.content}
                  </p>
                  {post.content.length > 200 && (
                    <button
                      className="mt-1 text-sm text-blue-500"
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    >
                      {expandedPost === post.id ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                {/* Response count */}
                <div className="mt-6">
                  <div className="mb-4 flex items-center">
                    <span className="font-medium">{post.response ? post.response.length : 0} Responses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-gray-500">No posts yet. Be the first to create a post!</p>
        )}
      </div>
    </div>
  );
}
