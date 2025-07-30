'use client';

import { createReplyNotification } from '@/data/actions/addNotification';
import { testReply } from '@/data/actions/post';
import { useLoginStore } from '@/stores/loginStore';
import { getPost } from '@/utils/getPosts';
import { getUserById } from '@/utils/getUsers';

export default function Replytest() {
  const user = useLoginStore(state => state.user);

  const replySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 제출한 데이터에서 아이디가 reply인 것만 가져오기 (content로 보낼거임)
    const formData = new FormData(event.currentTarget);
    const reply = formData.get('reply') as string;

    // 댓글 작성자 정보가 존재할때 실행
    if (user) {
      const handleSubmit = async () => {
        // 서버에 댓글 내용, 댓글 작성자 토큰, 글 번호 보냄
        // 56을 포스트 id로 하면 될거같습니다.
        const res = await testReply(reply, user.token.accessToken, 56);

        // 응답
        console.log(res);

        // 글 작성자 정보입니다. 5를 작성자 아이디로 넣으시면 될거 같습니다.
        // post.user.id?
        const targetUser = await getUserById(5);

        // 글 정보입니다. 56을 post id로 바꿔주세요.
        const post = await getPost(56);

        // 전부 요청이 성공할 때 실행
        if (post.ok && targetUser.ok) {
          // 서버로 알림을 생성해서 보냅니다.
          // post.item에는 현재 포스트 정보를, targetUser.item에는 글 작성자 정보를, user에는 댓글 작성자 정보를 넣어주세요.
          const noti = await createReplyNotification(post.item, targetUser.item, user);

          // 응답 출력
          if (noti.ok) {
            console.log(noti);
          }
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
