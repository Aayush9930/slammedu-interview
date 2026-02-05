"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyPosts } from "../actions";
import { PostCard } from "@/components/post-card";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function MyPostsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["my-posts"],
    queryFn: ({ pageParam }) => getMyPosts(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading posts. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-2xl font-bold">My Posts</h1>

        {data.pages.map((page, i) => (
          <div key={i} className="space-y-6">
            {page.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ))}

        {data.pages[0].posts.length === 0 && (
          <div className="text-center text-muted-foreground py-12 border rounded-lg">
            You haven't posted anything yet.
          </div>
        )}

        <div ref={observerRef} className="h-4 flex justify-center py-4">
          {isFetchingNextPage && <Loader2 className="animate-spin h-6 w-6" />}
        </div>
      </div>
    </div>
  );
}
