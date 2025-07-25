import type { Story } from '@/types/story';

const conan: Story = {
  id: 'conan',
  title: '🕵️ 명탐정 코난',
  subtitle: '"진실은 언제나 하나"를 담은 순간들',
  date: new Date('2025-07-17'),
  description: '코난이라는 작품은 단순한 추리 애니메이션을 넘어, 한 소년 탐정의 정의감, 비밀, 그리고 감정이 겹겹이 쌓인 이야기입니다.',
  coverImageUrl: '/story/conan-cover.png',
  contentBlocks: [
    {
      title: '작은 몸, 큰 진실 — "쿠도 신이치"라는 존재',
      content: `굿즈의 첫 출발점은 쿠도 신이치가 코난이 되는 순간이었습니다. 한 명의 고등학생이 의문의 조직에 의해 약을 먹고 어린아이가 된다는 설정은, 단순히 흥미로운 반전 그 이상이었습니다.\n그 안에는 '정체를 숨겨야만 하는 고독', '다시 돌아가기 위한 집념', 그리고 '사랑하는 사람을 지키기 위한 거리두기'라는 감정선이 깃들어 있었죠. 그래서 우리는 이 장면을 모티브로 한 굿즈에, 단순한 SD 캐릭터 디자인 대신 어른과 아이의 이중적인 존재감을 표현할 수 있는 일러스트를 적용했습니다.`,
      imageUrl: '/story/conan-1.png',
    },
    {
      title: '"잠자는 명탐정"이라는 아이러니',
      content: `굿다음은 빠질 수 없는 캐릭터, 모리 코고로. 겉으로는 항상 사건을 해결하는 것처럼 보이지만, 사실 그 모든 사건의 진실은 옆에 있는 작은 소년이 밝혀내죠.\n그래서 제작한 코난&코고로 패브릭 포스터에서는, 전면에는 포효하는 코고로가, 뒷면에는 입을 다문 채 리모컨 시계를 든 코난이 음영으로 들어가 있습니다.그 장면 하나만으로도 두 캐릭터의 관계성과 유머, 그리고 코난이 감내하는 ‘그늘’을 보여주고 싶었습니다.`,
      imageUrl: '/story/conan-2.png',
    },
    {
      title: '“진실은 언제나 하나!”',
      content: `이 상징적인 대사는 팬이라면 누구나 기억할 것입니다.하지만 그 문장이 울려 퍼지는 순간에는 언제나 무거운 진실이 뒤따릅니다. 사람들의 거짓말, 감춰진 동기, 그리고 그 안에 숨겨진 슬픔까지.\n그래서 우리는 코난의 대사를 단순한 슬로건이 아니라, 형태를 가진 메시지로 만들고 싶었습니다. 그 결과물이 바로, "진실은 언제나 하나!" 명대사 아크릴 스탠드입니다. 투명한 재질 안에 대사를 부각시키고, 배경엔 코난이 현미경으로 사건을 들여다보는 듯한 구도를 넣어, 진실을 파헤치는 의미를 담았습니다.`,
      imageUrl: '/story/conan-3.png',
    },
    {
      title: '그 모든 굿즈는 결국 ‘팬들을 위한 단서’',
      content: `명탐정 코난의 굿즈는 단지 예쁜 상품이 아닌, 팬들이 오랫동안 품어온 추억과 세계관의 한 조각입니다. 당신이 손에 쥐는 열쇠고리 하나, 일러스트 엽서 한 장에는 코난이라는 소년이 간직해온 수많은 진실과 감정이 담겨 있습니다.`,
      imageUrl: '/story/conan-4.png',
    },
  ],
  closing: '진실은 언제나 하나. 그리고 그 진실은, 당신의 책상 위에도 존재합니다.',
  mainCharacter: {
    name: '쿠도 신이치',
    description: '작아진 천재 고등학생 탐정, 숨겨진 정체로 사건을 해결한다.',
    imageUrl: '/story/conan-cha.png',
  },
};

export default conan;
