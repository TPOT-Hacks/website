import fs from 'fs';
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

export function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(contentDirectory, 'blog');
  const files = fs.readdirSync(blogDir);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(blogDir, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const html = marked(content);
      
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        date: data.date,
        author: data.author,
        excerpt: data.excerpt,
        content: html,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getHackPosts(): HackPost[] {
  const hacksDir = path.join(contentDirectory, 'hacks');
  const files = fs.readdirSync(hacksDir);
  
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(hacksDir, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const html = marked(content);
      
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        date: data.date,
        status: data.status,
        description: data.description,
        content: html,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, 'blog', `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const html = marked(content);
    
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

export function getHackPost(slug: string): HackPost | null {
  try {
    const fullPath = path.join(contentDirectory, 'hacks', `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const html = marked(content);
    
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