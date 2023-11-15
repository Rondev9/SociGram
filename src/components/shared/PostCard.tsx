import { useUserContext } from "@/context/AuthContext";
import { getRelativeTime } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  //   const videoRef = useRef();

  // Define a function to mute the video
  const muteVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  };

  // Define a function to unmute the video
  const unmuteVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  };

  // Use the Intersection Observer API to detect when the video enters or exits the viewport
  useEffect(() => {
    const options = {
      root: videoRef.current, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Trigger the callback when at least 50% of the video is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Video is in the viewport, unmute it
          unmuteVideo();
        } else {
          // Video is out of the viewport, mute it
          muteVideo();
        }
      }, options);

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }, options);

    return () => {
      observer.disconnect();
    };
  }, [videoRef]);

  let modifiedVideoUrl = "";

  if (post.isVideo) {
    modifiedVideoUrl =
      post.imageUrl.replace(/\/preview\?[^/]+/, "/view") +
      "?project=654288d943ac85d3021e&mode=admin";
  }

  const { user } = useUserContext();

//   console.log("post deta:", post);

  if (!post.creator) return;

  const playVideo = () => {
    if (videoRef.current) {
      // console.log("in playvudeo")
      videoRef?.current?.play();
    }
  };

  useEffect(() => {
    // console.log("in playvudeo effect")
    playVideo();
  }, []);

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {getRelativeTime(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li className="text-light-3" key={tag}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        {post.isVideo ? (
          <video
            ref={videoRef}
            className="post-card_img"
            controls={false}
            loop={true}
            autoPlay={true}
            muted={true}
            autoFocus={true}
          >
            <source src={modifiedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            className="post-card_img"
            alt="post image"
          />
        )}
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
