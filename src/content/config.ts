import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    h1: z.string().optional(),
    category: z.enum(['common-rail', 'gasoline', 'tnvd', 'brands', 'diagnostics', 'commercial']),
    icon: z.string().default('Wrench'),
    image: z.string(),
    featured: z.boolean().default(false),
    priceFrom: z.string(),
    executionTime: z.string(),
    relatedServices: z.array(z.string()).default([]),
  }),
});

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    h1: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('СТО МАСервис'),
    authorRole: z.string().default('Специалист по топливной аппаратуре'),
    authorExperience: z.string().default('14 лет опыта'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    relatedService: z.string(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
  }),
});

export const collections = {
  services: servicesCollection,
  articles: articlesCollection,
};
