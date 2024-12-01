import { getAllPosts, getSinglePost } from "@/lib/notion/auth";
import React from "react";
import Markdown from "react-markdown";

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function Post({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const res = await getSinglePost(slug);
  const { title, tags, description, postDate } = res.metaData;
  const mdString = res.mdString;
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                {title}
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap -m-4"></div>
          <Markdown children={mdString}></Markdown>
        </div>
      </section>
    </div>
  );
}

export default Post;
