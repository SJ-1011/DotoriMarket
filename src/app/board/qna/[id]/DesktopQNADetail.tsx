'use client';
import TriangleIcon from '@/components/icon/TriangleIcon';
import { useLoginStore } from '@/stores/loginStore';
import { Post, PostReply } from '@/types/Post';
import Image from 'next/image';
import Link from 'next/link';
interface DesktopProps {
  post: Post;
  posts: Post[];
  id: string;
  reply?: PostReply[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function DesktopQNADetail({ post, posts, id, reply }: DesktopProps) {
  const user = useLoginStore(state => state.user);
  const isAuthor = user?.token?.accessToken === post.accessToken;
  const asidePosts: (Post | null)[] = [null, null];

  // 하단에 있는 다음글/이전글
  for (let i = 0; i < posts.length; i++) {
    if (posts[i]._id == id) {
      if (i != 0) {
        asidePosts[0] = posts[i - 1];
      }
      if (i != posts.length - 1) {
        asidePosts[1] = posts[i + 1];
      }
      break;
    }
  }

  //문의 종류 배열
  const QNA_TYPES = [
    { type: '상품 문의', value: 'product' },
    { type: '배송 문의', value: 'delivery' },
    { type: '주문/결제', value: 'order' },
    { type: '반품/교환', value: 'return' },
    { type: '환불 문의', value: 'refund' },
    { type: '재입고 문의', value: 'restock' },
    { type: '기타 문의', value: 'etc' },
  ];

  return (
    <article className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
      <nav aria-label="브레드크럼">
        <ol className="text-xs lg:text-sm text-gray-400 flex flex-row flex-nowrap gap-2">
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>&gt;</li>
          <li>
            <Link href="/board/qna">문의게시판</Link>
          </li>
        </ol>
      </nav>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#A97452] py-2">문의사항</h2>
      <table className="border-t-2 border-primary w-full text-sm lg:text-base">
        <caption className="sr-only">도토리섬 문의사항 게시글 확인</caption>
        <colgroup>
          <col width="12%" />
          <col width="32%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="20%" />
        </colgroup>

        <tbody>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">제목</th>
            <td className="p-4" colSpan={5}>
              <h3>{post.title}</h3>
            </td>
          </tr>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">작성자</th>
            <td className="p-4">{post.user.name}</td>
            <th className="py-4 bg-secondary">답변 여부</th>
            <td className="p-4">{reply && reply.length > 0 ? '답변 완료' : '답변 대기'}</td>
            <th className="py-4 bg-secondary">날짜</th>
            <td className="p-4">{post.createdAt}</td>
          </tr>
          <tr className="border-b border-light-gray">
            <th className="py-4 bg-secondary">문의 종류</th>
            <td className="p-4">{QNA_TYPES.find(item => item.value === post.extra?.qnatype)?.type}</td>
            <th className="py-4 bg-secondary">상품명</th>
            <td className="p-4" colSpan={3}>
              {post.extra?.productName ? post.extra.productName : '.'}
            </td>
          </tr>
        </tbody>
      </table>

      <section className="p-8 whitespace-pre-line text-sm lg:text-base">
        <div className="mb-12 flex flex-col flex-nowrap gap-4">
          {post.extra?.productName && (
            <div className="flex flex-row flex-nowrap w-full p-8 border border-primary items-center gap-8">
              <Image src={`${API_URL}/${post.extra?.imagePath}`} alt={`${post.extra?.productName} 상품 이미지`} width={100} height={100} />
              <div className="flex flex-col flex-nowrap">
                <p className="text-base font-bold">문의 상품</p>
                <p>{post.extra?.productName}</p>
                <Link href={`/`} className="bg-primary text-white p-2 w-fit mt-4">
                  상품 보러가기
                </Link>
              </div>
            </div>
          )}
          {post.content}
        </div>
        {reply && reply.length > 0 && (
          <div className="bg-secondary text-left p-8 flex flex-col flex-nowrap">
            <span className="font-bold">{reply[0].user.name}</span>
            <p>{reply[0].content}</p>
          </div>
        )}
      </section>
      <aside>
        <ul className="flex flex-col flex-nowrap text-sm lg:text-base">
          <li className="flex flex-row flex-nowrap items-center gap-8 border-y border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'w-4 h-4' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[0] && <span>다음 글이 없습니다.</span>}
            {asidePosts[0] && <Link href={`/board/qna/${asidePosts[0]._id}`}>{asidePosts[0].title}</Link>}
          </li>
          <li className="flex flex-row flex-nowrap items-center gap-8 border-b border-light-gray p-4">
            <TriangleIcon svgProps={{ className: 'scale-y-[-1] w-4 h-4' }} polygonProps={{ fill: '#757575' }} />
            {!asidePosts[1] && <span>이전 글이 없습니다.</span>}
            {asidePosts[1] && <Link href={`/board/qna/${asidePosts[1]._id}`}>{asidePosts[1].title}</Link>}
          </li>
          <li className="self-end mt-8 flex gap-4">
            {isAuthor && (
              <Link href={`/board/qna/edit/${post._id}`} className="w-fit py-2 px-8 bg-primary-dark text-white  hover:bg-[#966343] transition-colors">
                수정하기
              </Link>
            )}
            <Link href="/board/qna" className="w-fit py-2 px-8 bg-primary-dark text-white hover:bg-[#966343] ">
              목록
            </Link>
          </li>
        </ul>
      </aside>
    </article>
  );
}
