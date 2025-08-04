'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getUserById } from '@/utils/getUsers';
import { useLoginStore } from '@/stores/loginStore';
import { patchUserImage } from '@/data/actions/patchUserImage';
import { patchUserIntro } from '@/data/actions/patcUserIntro';
import { useUserStore } from '@/stores/userStore';
import Skeleton from '@/components/common/Skeleton';

export default function ResidentCard() {
  const userState = useUserStore(state => state.user);
  const [editing, setEditing] = useState(false);

  const fetchLoginUser = useLoginStore(state => state.fetchUser);

  const [user, setUser] = useState<null | {
    name: string;
    birthday: string;
    image: string;
    intro?: string;
  }>(null);
  const [introText, setIntroText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { user: loginUser } = useLoginStore();
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 이미지 로더
  const imageLoader = ({ src, width }: { src: string; width: number }) => {
    const isLg = width >= 1024;
    const targetImages = ['greencard', 'barcode'];
    const shouldApply2x = targetImages.some(name => src.includes(name));
    return isLg && shouldApply2x ? src.replace('.png', '@2x.png') : src;
  };

  // 유저 데이터 가져오기
  useEffect(() => {
    if (!loginUser?._id) return;
    const fetchUser = async () => {
      setIsLoading(true);
      const res = await getUserById(Number(loginUser._id));
      if (res.ok === 1 && res.item) {
        setUser({
          name: res.item.name,
          birthday: res.item.birthday ?? '생일을 작성해주세요',
          image: res.item.image?.path ? `${API_URL}/${res.item.image.path}` : '/mypage-profile.png',
          intro: res.item.extra?.intro || '',
        });
        setIntroText(res.item.extra?.intro || '');
      } else if (res.ok === 0) {
        console.error(res.message);
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [loginUser?._id]);

  // 프로필 변경
  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    if (!loginUser?._id || !loginUser.token?.accessToken) {
      console.error('유저 정보 또는 토큰이 없습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('attach', e.target.files[0]);

    // 파일 업로드
    const uploadRes = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: { 'Client-Id': process.env.NEXT_PUBLIC_CLIENT_ID || '' },
      body: formData,
    }).then(res => res.json());

    if (uploadRes.ok !== 1) {
      alert('이미지 업로드 실패');
      return;
    }

    const newImage = uploadRes.item[0];

    // 유저 이미지 업데이트
    const patchRes = await patchUserImage(loginUser._id, newImage, loginUser.token.accessToken);

    if (patchRes.ok === 1) {
      alert('프로필 이미지가 변경되었습니다!');

      console.log('프로필 이미지가 변경되었습니다!');
      setUser(prev => prev && { ...prev, image: `${API_URL}/${newImage.path}` });
      try {
        console.log(fetchLoginUser);
        await fetchLoginUser();
      } catch {
        console.log('스토어에 저장이 안댐');
      }
    } else {
      alert('이미지 변경 실패');
    }
  };

  const saveIntro = async () => {
    if (isSaving) return;
    setIsSaving(true);

    if (!loginUser?._id || !loginUser.token?.accessToken) return;
    const trimmedIntro = introText.trim();
    const patchRes = await patchUserIntro(loginUser._id, trimmedIntro, loginUser.token.accessToken);

    if (patchRes.ok === 1) {
      alert('한줄 소개가 변경되었습니다!');
      setUser(prev => prev && { ...prev, intro: trimmedIntro });
    } else {
      alert('한줄 소개 변경 실패');
    }
    setEditing(false);
    setIsSaving(false);
  };

  if (!user) return <Skeleton width="w-full" height="h-full" rounded="rounded-2xl" className="mb-2 w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[500px] lg:h-[275px] mx-auto" />;

  return (
    <>
      {isLoading && <Skeleton width="w-full" height="h-full" rounded="rounded-2xl" className="mb-2 w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[500px] lg:h-[275px] mx-auto" />}
      {!isLoading && (
        <div className="flex flex-col flex-nowrap text-xs sm:text-sm lg:text-base">
          <div className="relative rounded-xl flex flex-row flex-nowrap gap-8 px-8 items-center justify-center border-2 border-primary w-[350px] h-[192.5px] sm:w-[400px] sm:h-[220px] lg:w-[500px] lg:h-[275px] bg-cover bg-center" style={{ backgroundImage: 'url("/mypage-greencard.png")' }}>
            {/* MEMBERSHIP CARD 텍스트 */}
            <div className="absolute top-1 w-full text-center flex flex-row flex-nowrap items-center justify-center gap-2">
              <div className="flex-1 ml-10 border-t border-[#95aa81]"></div>
              <h2 className="text-[#95aa81]  tracking-wide">MEMBERSHIP CARD</h2>
              <div className="flex-1 mr-10 border-t border-[#95aa81]"></div>
            </div>

            {/* 프로필 버튼 */}
            <button type="button" onClick={() => document.getElementById('profile-upload')?.click()} className="overflow-hidden">
              <div className="w-full h-full cursor-pointer">
                {user.image !== '/mypage-profile.png' ? (
                  <div className="relative w-[7rem] h-[7rem]">
                    <Image loader={imageLoader} src={user.image} fill alt="User Profile" className="object-cover z-2 rounded-2xl border-4 border-secondary-green" />
                  </div>
                ) : (
                  <div className="relative w-[7rem] h-[7rem]">
                    <Image src="/mypage-profile.png" alt="Default Profile Background" fill className="object-cover" />
                  </div>
                )}
              </div>
              <input type="file" id="profile-upload" accept="image/*" className="hidden" onChange={handleProfileChange} />
            </button>

            {/* NAME & BIRTH */}
            <div className="flex flex-col flex-1 flex-nowrap gap-2 sm:gap-1">
              <div className="flex items-center border-b border-[#95aa81] ">
                <p className="text-[#95aa81] pr-2 ">NAME</p>
                <p className=" text-dark-gray font-test">{userState?.name ? userState.name : user.name}</p>
              </div>
              <div className="flex items-center border-b border-[#95aa81] ">
                <p className="text-[#95aa81] pr-2 ">BIRTH</p>
                <p className="text-dark-gray font-test">{userState?.birthday ? userState.birthday : user.birthday}</p>
              </div>
              <div className="flex items-center border-b border-[#95aa81] cursor-pointer group" onClick={() => setEditing(true)}>
                {editing ? (
                  <input
                    type="text"
                    value={introText}
                    onChange={e => setIntroText(e.target.value)}
                    onBlur={() => {
                      if (!isSaving) saveIntro();
                    }}
                    onKeyDown={async e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!isSaving) await saveIntro();
                      }
                    }}
                    className="text-dark-gray font-test w-full bg-transparent focus:outline-none placeholder-gray"
                    placeholder="한줄 소개를 작성해주세요"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center justify-between w-full font-test">
                    <p className={`  ${user.intro ? 'text-dark-gray' : 'text-gray'}`}>{user.intro || '한줄 소개를 작성해주세요'}</p>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">✏️</span>
                  </div>
                )}
              </div>
            </div>

            {/* 바코드 */}
            <div className="absolute bottom-0 right-10 w-30 h-5 lg:w-40 lg:h-7">
              <Image loader={imageLoader} src="/mypage-barcode.png" alt="Barcode" className="object-cover" fill />
            </div>

            {/* 작은 텍스트 */}
            <div className="absolute left-5 text-[#95aa81] text-[0.5rem] bottom-2 lg:lg:bottom-3">CONSOLE.10G</div>
          </div>
        </div>
      )}
    </>
  );
}
