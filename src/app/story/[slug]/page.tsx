import { notFound } from 'next/navigation';

const storyData = {
  conan: {
    title: '명탐정 코난',
    content: '진실은 언제나 하나! 코난의 이야기입니다.',
  },
  chiikawa: {
    title: '치이카와',
    content: '작고 귀여운 치이카와의 소소한 모험!',
  },
  atashinchi: {
    title: '아따맘마',
    content: '유쾌하고 정겨운 우리 가족 이야기, 아따맘마!',
  },
} as const;

type StoryData = typeof storyData;
type StorySlug = keyof StoryData;

export default function StoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // 타입 안전하게 처리
  if (!Object.prototype.hasOwnProperty.call(storyData, slug)) {
    return notFound();
  }

  const story = storyData[slug as StorySlug];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
      <p>{story.content}</p>
    </main>
  );
}
