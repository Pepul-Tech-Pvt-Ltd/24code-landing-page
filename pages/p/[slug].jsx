import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";

export default function PostPage({
  frontmatter: { title, description, date, cover_image },
  slug,
  content,
  mdxSource,
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta
          name="keywords"
          content="24 Code, app development, software company, website maker"
        ></meta>

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:url" content="https://www.24code.in" />
      </Head>
      <div
        className={`min-h-[400px] dark:bg-black prose dark:prose-invert p-3 text-md lg:text-lg mx-auto`}
      >
        <div className="flex">
          <div className="flex flex-col justify-center">
            <h1 className="mt-3 lg:mt-10 text-5xl mb-0">{title}</h1>
            <p className="text-md my-3 opacity-50">{date}</p>
          </div>
        </div>
        <hr className="m-0 mb-5" />
        <MDXRemote {...mdxSource} />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join("posts"));

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join("posts", slug + ".md"),
    "utf-8"
  );

  const { data: frontmatter, content } = matter(markdownWithMeta);
  const mdxSource = await serialize(content);

  return {
    props: {
      frontmatter,
      slug,
      content,
      mdxSource,
    },
  };
}
