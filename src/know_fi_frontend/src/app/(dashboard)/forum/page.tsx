'use client';

import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

import PostDialog from '@/components/features/forum/PostDialog';
import { Button } from '@/components/ui/button';
import FloatingActionMenu from '@/components/ui/floating-action-menu';
import { Textarea } from '@/components/ui/textarea';
import useFetchPost from '@/hooks/useFetchPost';
import useResponsePost from '@/hooks/useResponsePost';

const CATEGORY_LIST = [
  { id: 0, title: 'Frontend' },
  { id: 1, title: 'Backend' },
  { id: 2, title: 'Chain Fusion' },
  { id: 3, title: 'AI' },
  { id: 4, title: 'Bitcoin DeFi' },
];

export default function Page() {
  const { register, handleSubmit, isSubmitting, errors, submitComment, comments } = useResponsePost();
  const { posts: fetchedPosts, isLoading, refetch } = useFetchPost();
  const [posts, setPosts] = useState(fetchedPosts);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handlePostSuccess = () => {
    refetch();
  };

  useEffect(() => {
    setPosts(fetchedPosts);
  }, [fetchedPosts]);

  useEffect(() => {
    console.log('This is your postID', selectedPostId);
  }, [selectedPostId]);

  const handleToggleComments = (postId: number) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  const handleAddComment = (postId: number, newComment: { content: string }) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          response: [...post.response, { id: Date.now(), ...newComment }],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Posts List */}
      <div>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="size-10 animate-spin rounded-full border-y-2 border-blue-500"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-lg border-2 border-black p-2 outline-2">
                <div className="user-details flex flex-col">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="text-gray-500">
                    @{post.authorName} • {post.authorId.toString().slice(0, 10)}...
                  </p>
                </div>

                {/* post body */}
                <p className="mt-2 text-gray-900">{post.content}</p>
                <div className="mt-10 flex justify-between align-middle">
                  <div>
                    <div className="gap2 flex gap-2">
                      {CATEGORY_LIST.map((category) => (
                        <div
                          key={category.id}
                          className="flex w-24 justify-center rounded-full border-2 border-black p-1 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]"
                        >
                          <p className="text-sm">{category.title}</p>
                        </div>
                      ))}
                    </div>
                    {selectedPostId === post.id && (
                      <div className="mt-5">
                        <form
                          onSubmit={handleSubmit((data) =>
                            submitComment(post.id.toString(), data, (newComment) =>
                              handleAddComment(post.id, newComment)
                            )
                          )}
                          className="space-y-2"
                        >
                          <Textarea {...register('content')} placeholder="Comment" />
                          {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
                          <Button disabled={isSubmitting}>{isSubmitting ? 'Posting...' : 'Post'}</Button>
                        </form>
                      </div>
                    )}
                  </div>
                  <div>
                    <button onClick={() => handleToggleComments(post.id)} className="text-blue-500">
                      {selectedPostId === post.id ? 'Hide Comments' : 'View Comments'}
                    </button>
                  </div>
                </div>
                {selectedPostId === post.id && (
                  <div className="mt-4 flex flex-col gap-2">
                    {post.response.length > 0 ? (
                      post.response.map((comment) => (
                        <div key={comment.id} className="rounded-sm border border-black p-2">
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          <p className="text-xs text-gray-500">@{comment.authorName}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No Comment</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-gray-500">No posts yet. Be the first to create a post!</p>
        )}
      </div>

      <FloatingActionMenu
        options={[
          {
            label: 'Post',
            Icon: <User />,
            onClick: () => setShowDialog(true),
          },
        ]}
      />
      <PostDialog open={showDialog} onClose={() => setShowDialog(false)} onSuccess={handlePostSuccess} />
    </div>
  );
}
