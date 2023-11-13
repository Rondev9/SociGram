import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();
  // const {data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts();
  const {
    data: posts,
    isPending: isPostLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetRecentPosts();

  // console.log("data",posts?.pages[0]?.documents);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages[0]?.documents.map((post: Models.Document) => (
                // <li key={post.$id}>{post.caption}</li>
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
          {hasNextPage && (
            <div ref={ref} className="mt-10">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
