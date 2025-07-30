//자유 게시판
// import ArrowIcon from '@/components/icon/ArrowIcon';
// import SearchIcon from '@/components/icon/SearchIcon';
import { Post } from '@/types/Post';
import { getPosts } from '@/utils/getPosts';
// import Link from 'next/link';
// import Image from 'next/image';
import CommunityWriteButton from './CommunityWriteButton';
// import FavoriteBorderIcon from '@/components/icon/FavoriteBorderIcon';
// import CommunityPostCard from './CommunityPostCard';
import CommunityBoardClientWrapper from './CommunityBoardClientWrapper';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
export const dynamic = 'force-dynamic';
export default async function CommunityBoardPage() {
  const res = await getPosts('community');
  const posts: Post[] = res.ok === 1 ? res.item : [];
  // console.log(posts);
  // product.image가 있는 게시글만 필터링
  const imagePosts = posts.filter(post => post.image);
  // console.log(imagePosts);
  // console.log(`${API_URL}/files/${CLIENT_ID}`);
  // imagePosts.map(post => console.log(`${API_URL}/files/${CLIENT_ID}/${post.product.image}`));
  return (
    <>
      <div className="bg-white px-8 pt-6 pb-12 min-h-[80vh]">
        {/* 좌측 '홈 > COMMUNITY' */}
        <div className="mb-3  text-xs sm:text-sm lg:text-base  text-gray-400">홈 &gt; COMMUNITY</div>

        {/* 제목 & 검색탭 */}
        <div className="flex items-start justify-between mb-6 relative">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[#A97452] pt-2">자유게시판</h1>

          {/* 우측: 검색 & 필터 */}
          <div className="flex flex-col items-end">
            {/* 🔹 줄: 드롭다운 + 검색창 */}
            <div className="flex items-center gap-2">
              {/* 🔽 드롭다운 */}
              {/* <div className="relative w-20 sm:w-24">
                <select name="searchField" defaultValue="title" className="appearance-none w-full h-8 lg:h-10 pl-3 pr-8 border border-[#A97452]  bg-white text-[#A97452] text-xs sm:text-sm lg:text-base rounded-full outline-none cursor-pointer">
                  <option value="title">제목</option>
                  <option value="user">작성자</option>
                </select> */}

              {/* 🔽 Custom ArrowIcon (오른쪽 위에 겹치도록 배치) */}
              {/* <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ArrowIcon svgProps={{ className: 'w-[10px] h-[6px] w-[12px] h-[8px] lg:w-[14px] lg:h-[9px]' }} />
                </div> */}
              {/* </div> */}

              {/* 🔍 검색 input */}
              {/* <div className="flex items-center gap-2 border border-[#A97452] rounded-3xl px-3 py-2 w-48 sm:w-60 lg:w-72 h-8 sm:h-8 lg:h-10 bg-white">
                <input type="text" placeholder="검색어를 입력하세요" className="flex-1 outline-none border-none bg-transparent text-xs sm:text-sm lg:text-base" />
                <button type="submit" className="ml-2">
                  <SearchIcon className="w-4 h-4 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-[#A97452]" />
                </button>
              </div> */}
            </div>
            <div className="flex justify-end mb-4">
              <CommunityWriteButton />
            </div>
            {/* 🔻 필터 아이콘 버튼
            <button type="button" className="mt-2 text-[#A97452] hover:bg-[#f8f0e9] p-2 rounded-full self-end" title="필터">
              <FilterIcon pathProps={{ fill: '#A97452' }} svgProps={{ className: 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10' }} />
            </button> */}
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-t-2 border-[#A97452] mb-1" />
        {/* 이미지 그리드와 페이지네이션 */}
        <div className="my-8">
          <h3 className="text-lg font-bold mb-4 text-[#A97452]"></h3>
          <CommunityBoardClientWrapper posts={imagePosts} apiUrl={API_URL!} clientId={CLIENT_ID!} />
        </div>
      </div>
    </>
  );
}
