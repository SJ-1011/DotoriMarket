import Image from 'next/image';

export default function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 my-6">
      <Image src="/main-dotori.png" alt="도토리" width={800} height={300} className="w-6 h-6" />
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}
