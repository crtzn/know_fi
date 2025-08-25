import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export default function useFetchPost() {
  const { actors } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [actors]);

  const fetchPosts = async () => {
    if (!actors?.forum) return;
    setIsLoading(true);
    try {
      const allPosts = await actors.forum.getAllPosts();
      const sortedPosts = [...allPosts].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      setPosts(sortedPosts);
      console.log('All user posts: ', sortedPosts);
    } catch (error) {
      console.log('Error fetching posts: ', error);
    } finally {
      setIsLoading(false);
      console.log('Done Fetching: ', posts);
    }
  };

  return { posts, isLoading, refetch: fetchPosts };
}
