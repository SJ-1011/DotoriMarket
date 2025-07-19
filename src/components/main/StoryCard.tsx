interface StoryCardProps {
  story: {
    id: number;
    title: string;
    summary: string;
  };
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="font-bold">{story.title}</h3>
      <p>{story.summary}</p>
    </div>
  );
}
