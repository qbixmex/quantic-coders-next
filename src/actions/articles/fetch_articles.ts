"use server";

import { Article, Category, Robots } from "@/interfaces";
import { prisma } from "@/lib";

export type ArticlesPublic = {
  id?: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
  publishedAt: Date | null;
  author: { name: string };
  robots: Robots;
  createdAt?: Date;
  updatedAt?: Date;
};

type ResponseFetchArticlesPublic = {
  ok: boolean;
  articles: ArticlesPublic[];
  message: string;
};

export type ArticlesForList = {
  id: string;
  title: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  },
  publishedAt: Date;
};

type ResponseFetchArticles = {
  ok: boolean;
  articles: ArticlesForList[];
  message: string;
};

type ArticleDB = {

};

type ResponseFetchArticle = {
  ok: boolean;
  article: Article | null;
  message: string;
};

type Metadata = {
  title: string;
  description: string;
  robots: string;
  author: string;
};

type ResponseFetchArticleMetadata = {
  ok: boolean;
  metadata: Metadata | null;
  message: string;
};

type Params = {
  isPublished: boolean;
};

export const getArticlesPublic = async (params: Params = {
  isPublished: true,
}): Promise<ResponseFetchArticlesPublic> =>
{
  try {
    const articles = await prisma.article.findMany({
      include: {
        category: true,
        author: {
          select: {
            name: true,
          }
        },
      }
    }) as ArticlesPublic[];

    return {
      ok: true,
      articles,
      message: "Articles fetched successfully 👍",
    };
  } catch(error) {
    console.error(error);
    return {
      ok: false,
      articles: [],
      message: "Something went wrong !, check logs for details",
    };
  }
};

export const getArticles = async (params: Params = {
  isPublished: true,
}) :Promise<ResponseFetchArticles> =>
{
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          }
        },
        author: {
          select: {
            name: true,
          }
        },
      },
    }) as ArticlesForList[];

    return {
      ok: true,
      articles,
      message: "Articles fetched successfully 👍",
    };
  } catch(error) {
    console.error(error);
    return {
      ok: false,
      articles: [],
      message: "Something went wrong !, check logs for details",
    };
  }
};

export const getArticleById = async (id: string): Promise<ResponseFetchArticle> => {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          }
        },
      }
    }) as Article | null;
  
    if (!article) {
      return {
        ok: false,
        article: null,
        message: "Article not found with id: " + id,
      };
    }

    return {
      ok: true,
      article: null,
      message: "Article fetched successfully 👍",
    };
  } catch(error) {
    console.error(error);
    return {
      ok: false,
      article: null,
      message: "Something went wrong !, check logs for details",
    };
  }
};

export const getArticleBySlug = async (slug: string): Promise<ResponseFetchArticle> => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      }
    }) as Article | null;

    if (!article) {
      return {
        ok: false,
        article: null,
        message: "Article not found with slug: " + slug,
      };
    }

    return {
      ok: true,
      article,
      message: "Article fetched successfully 👍",
    };
  } catch(error) {
    console.error(error);
    return {
      ok: false,
      article: null,
      message: "Something went wrong !, check logs for details",
    };
  }
};

export const getArticleMetadataBySlug = async (slug: string): Promise<ResponseFetchArticleMetadata> => {
  try {
    const metadata = await prisma.article.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true,
        robots: true,
        author: true,
      }
    }) as Metadata | null;
  
    if (!metadata) {
      return {
        ok: false,
        metadata: null,
        message: "Article not found with slug: " + slug,
      };
    }

    return {
      ok: true,
      metadata,
      message: "Article fetched successfully 👍",
    };
  } catch(error) {
    console.error(error);
    return {
      ok: false,
      metadata: null,
      message: "Something went wrong !, check logs for details",
    };
  }
};