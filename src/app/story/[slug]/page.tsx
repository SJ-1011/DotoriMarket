import { notFound } from 'next/navigation';
import StoryContent from './story-content';

import conan from '@/data/stories/conan';
import chiikawa from '@/data/stories/chiikawa';
import atashinchi from '@/data/stories/atashinchi';

const storyMap = {
  conan,
  chiikawa,
  atashinchi,
} as const;

type StorySlug = keyof typeof storyMap;

export async function generateStaticParams(): Promise<Array<{ slug: StorySlug }>> {
  return (Object.keys(storyMap) as StorySlug[]).map(slug => ({ slug }));
}

interface StoryPageProps {
  params: Promise<{
    slug: StorySlug;
  }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;

  if (!(slug in storyMap)) {
    return notFound();
  }

  return <StoryContent slug={slug} />;
}
