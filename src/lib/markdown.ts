import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
}

export interface HackPost {
  slug: string;
  title: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed';
  description: string;
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(contentDirectory, 'blog');
  const files = await fs.readdir(blogDir);
  
  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const fullPath = path.join(blogDir, file);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const html = await marked(content, { async: true });
        
        return {
          slug: file.replace(/\.md$/, ''),
          title: data.title,
          date: data.date,
          author: data.author,
          excerpt: data.excerpt,
          content: html,
        };
      })
  );
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getHackPosts(): Promise<HackPost[]> {
  const hacksDir = path.join(contentDirectory, 'hacks');
  const files = await fs.readdir(hacksDir);
  
  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const fullPath = path.join(hacksDir, file);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const html = await marked(content, { async: true });
        
        return {
          slug: file.replace(/\.md$/, ''),
          title: data.title,
          date: data.date,
          status: data.status,
          description: data.description,
          content: html,
        };
      })
  );
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, 'blog', `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const html = await marked(content, { async: true });
    
    return {
      slug,
      title: data.title,
      date: data.date,
      author: data.author,
      excerpt: data.excerpt,
      content: html,
    };
  } catch {
    return null;
  }
}

export async function getHackPost(slug: string): Promise<HackPost | null> {
  try {
    const fullPath = path.join(contentDirectory, 'hacks', `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const html = await marked(content, { async: true });
    
    return {
      slug,
      title: data.title,
      date: data.date,
      status: data.status,
      description: data.description,
      content: html,
    };
  } catch {
    return null;
  }
} 