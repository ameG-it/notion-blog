import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

//クライアント
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// notion2Markdown
const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 *
 * @returns すべての投稿
 */
export const getAllPosts = async () => {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_BD_ID || "",
    page_size: 100,
  });

  const allPosts = posts.results;

  return allPosts.map((post) => getPageMetadata(post));
};

export const getSinglePost = async (slug) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BD_ID || "",
    filter: {
      property: "slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  const metaData = getPageMetadata(response.results[0]);
  const mdblock = await n2m.pageToMarkdown(metaData.id);
  const mdString = n2m.toMarkdownString(mdblock).parent;

  return { metaData, mdString };
};

const getPageMetadata = (post) => {
  const item = {
    id: post.id,
    title: "",
    tags: [""],
    description: "",
    postDate: "",
    slug: post.id,
  };

  Object.keys(post.properties).forEach((key) => {
    switch (post.properties[key].type) {
      case "date":
        item[key] = post.properties[key].date?.start;
        break;
      case "rich_text":
        item[key] = post.properties[key].rich_text?.[0]?.plain_text || "";
        break;
      case "multi_select":
        item[key] =
          post.properties[key].multi_select?.map((item) => item.name) || [];
        break;
      case "title":
        item[key] = post.properties[key].title?.[0]?.plain_text || "";
        break;
      case "select":
        item[key] = post.properties[key].select;
        break;
      default:
        item[key] = post.properties[key];
    }
  });

  return item;
};
