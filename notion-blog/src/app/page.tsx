import { getAllPosts } from "@/lib/notion/auth";
import PostCard from "./_components/postCard";

export const revalidate = 60;

export default async function Home({}) {
  const allPosts = await getAllPosts();
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          {allPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              tags={post.tags}
              description={post.description}
              postDate={post.postDate}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
