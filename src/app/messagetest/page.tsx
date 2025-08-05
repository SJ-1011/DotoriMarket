'use client';

import { createMessage } from '@/data/actions/addNotification';
import { useLoginStore } from '@/stores/loginStore';
import { getUserById } from '@/utils/getUsers';

export default function MessageTest() {
  const user = useLoginStore(state => state.user);

  const replySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 제출한 데이터에서 아이디가 reply인 것만 가져오기 (content로 보낼거임)
    const formData = new FormData(event.currentTarget);
    const reply = formData.get('reply') as string;

    // 댓글 작성자 정보가 존재할때 실행
    if (user) {
      const handleSubmit = async () => {
        const target = await getUserById(13);

        if (target.ok) {
          await createMessage(reply, target.item, user);
        }
      };
      handleSubmit();
    }
  };
  return (
    <form onSubmit={replySubmit}>
      <input type="hidden" name="accessToken" value={user?.token?.accessToken ?? ''} />

      <input id="reply" name="reply" type="text" className="border w-full h-[300px]" />
      <button type="submit">등록</button>
    </form>
  );
}
