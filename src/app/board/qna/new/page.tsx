import RegistForm from './RegistForm';

export default async function NewQnaPage() {
  const boardType = await 'qna';

  return (
    <main className="flex-1 min-w-[320px] p-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">게시글 등록</h2>
      </div>
      <section className="mb-8 p-4">
        <RegistForm boardType={boardType} />
      </section>
    </main>
  );
}
