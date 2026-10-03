import type { BlogPost } from "./data";

let serverBlogPosts: readonly BlogPost[] = [];

export function setServerBlogPosts(posts: readonly BlogPost[]) {
  serverBlogPosts = posts;
}

export function getRuntimeBlogPost(slug: string): BlogPost | undefined {
  if (typeof window === "undefined") {
    return serverBlogPosts.find((post) => post.slug === slug);
  }

  const serializedPost = document.getElementById("root")?.getAttribute("data-blog-post");
  if (!serializedPost) return undefined;

  try {
    const post = JSON.parse(serializedPost) as BlogPost;
    return post.slug === slug ? post : undefined;
  } catch {
    return undefined;
  }
}