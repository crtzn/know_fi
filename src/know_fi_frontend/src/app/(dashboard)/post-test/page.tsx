'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: number;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
}

export default function ForumPage() {
  const { actors, isAuthenticated, isLoading: authLoading, login, getActor } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Real-time polling states
  const [isPolling, setIsPolling] = useState(true);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isTyping, setIsTyping] = useState(false);

  // Fetch all posts with change detection
  const fetchPosts = async (isPollingCall = false) => {
    if (!actors?.forum) return;

    try {
      if (!isPollingCall) {
        setIsLoading(true);
      }
      setError('');

      const allPosts = await actors.forum.getAllPosts();

      // Sort posts by timestamp (newest first)
      const sortedPosts = [...allPosts].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

      // Check if there are new posts (only during polling)
      if (isPollingCall && posts.length > 0 && sortedPosts.length > posts.length) {
        const newCount = sortedPosts.length - posts.length;
        setNewPostsCount(newCount);

        // Auto-clear notification after 5 seconds
        setTimeout(() => setNewPostsCount(0), 5000);

        // Optional: Show browser notification if user allows
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${newCount} new post${newCount > 1 ? 's' : ''} in the forum!`);
        }
      }

      setPosts(sortedPosts);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (!isPollingCall) {
        setError('Failed to load posts. Please try again.');
      }
    } finally {
      if (!isPollingCall) {
        setIsLoading(false);
      }
    }
  };

  // Initial fetch when actor is available
  useEffect(() => {
    if (actors?.forum) {
      fetchPosts(false);
    }
  }, [actors?.forum]);

  // Smart polling for real-time updates
  useEffect(() => {
    if (!actors?.forum || !isPolling) return;

    const pollForUpdates = async () => {
      // Only poll if tab is visible and user is not typing
      if (document.visibilityState === 'visible' && !isTyping && !isLoading) {
        await fetchPosts(true);
      }
    };

    // Start polling every 5 seconds
    const interval = setInterval(pollForUpdates, 5000);

    // Poll immediately when user comes back to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isTyping && !isLoading) {
        fetchPosts(true);
      }
    };

    // Poll when user focuses window
    const handleFocus = () => {
      if (!isTyping && !isLoading) {
        fetchPosts(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [actors?.forum, isPolling, isTyping, isLoading, posts.length]);

  // Request notification permission when component mounts
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
      await fetchPosts(false);
      // Clear any new posts notification since user just posted
      setNewPostsCount(0);
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
      {/* New Posts Notification */}
      {newPostsCount > 0 && (
        <div className="fixed right-4 top-4 z-50 animate-bounce rounded-lg bg-blue-500 px-4 py-2 text-white shadow-lg">
          🎉 {newPostsCount} new post{newPostsCount > 1 ? 's' : ''}!
        </div>
      )}

      {/* Header with Polling Status */}

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
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
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
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
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
            <div className="size-10 animate-spin rounded-full border-y-2 border-blue-500"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                <h3 className="text-lg font-semibold">{post.title}</h3>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>Posted by: {post.authorId.toString().slice(0, 10)}...</span>
                  <span>authorName: {post.authorName}</span>
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
