import Image from 'next/image';

export default function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex justify-center my-6 font-custom">
      <div className="inline-flex items-center gap-2 px-1 py-1 border-b-2 border-dashed border-primary">
        <Image src="/main-dotori.png" alt="도토리" width={800} height={300} className="w-6 h-6" />

        {/* 타이틀 */}
        <h2 className="text-lg sm:text-2xl font-bold text-primary">{title}</h2>

        <Image src="/main-dotori.png" alt="도토리" width={800} height={300} className="w-6 h-6" />
      </div>
    </div>
  );
}
