import dayjs from 'dayjs';

function getTime(day = 0, second = 0) {
  return dayjs().add(day, 'days').add(second, 'seconds').format('YYYY.MM.DD HH:mm:ss');
}

export const initData = async (clientId, nextSeq) => {
  return {
    // 회원
    user: [
      {
        _id: await nextSeq('user'),
        email: 'admin@market.com',
        password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
        name: '무지',
        phone: '01011112222',
        address: '서울시 강남구 역삼동 123',
        type: 'admin',
        loginType: 'email',
        image: `files/${clientId}/user-muzi.png`,
        createdAt: getTime(-100, -60 * 60 * 3),
        updatedAt: getTime(-100, -60 * 60 * 3),
        extra: {
          birthday: '03-23',
        },
      },
      {
        _id: await nextSeq('user'),
        email: 's1@market.com',
        password: '$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2',
        name: '네오',
        phone: '01022223333',
        address: '서울시 강남구 삼성동 456',
        type: 'seller',
        loginType: 'email',
        image: `files/${clientId}/user-neo.png`,
        createdAt: getTime(-50),
        updatedAt: getTime(-30, -60 * 60 * 3),
        extra: {
          birthday: '11-23',
        },
      },
    ],

    // 상품
    product: [
      {
        _id: await nextSeq('product'),
        seller_id: 2,
        price: 22800,
        shippingFees: 0,
        show: true,
        active: true,
        name: '부가티',
        quantity: 320,
        buyQuantity: 310,
        mainImages: [
          {
            path: `files/${clientId}/sample-bugatti.png`,
            name: 'sample-bugatti.png',
            originalname: '부가티.png',
          },
        ],
        content: `
          <div class="product-detail">
            <p>캥거루 스턴트 독 로봇완구 상세 설명</p>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2),
        updatedAt: getTime(-40, -60 * 15),
        extra: {
          isNew: true,
          isBest: true,
          category: ['PC03', 'PC0301'],
          sort: 5,
        },
      },
      {
        _id: await nextSeq('product'),
        seller_id: 333,
        price: 17260,
        shippingFees: 2500,
        show: true,
        active: true,
        name: '부가티',
        quantity: 200,
        buyQuantity: 198,
        mainImages: [
          {
            path: `files/${clientId}/sample-bugatti.png`,
            name: 'sample-bugatti.png',
            originalname: '부가티.png',
          },
        ],
        content: `
          <div class="product-detail">
            <p>헬로카봇 스톰다이버 상세 설명</p>
          </div>`,
        createdAt: getTime(-38, -60 * 60 * 6),
        updatedAt: getTime(-33, -60 * 55),
        extra: {
          isNew: false,
          isBest: true,
          category: ['PC01', 'PC0103'],
          sort: 4,
        },
      },
    ],

    // 주문
    order: [],

    // 후기
    review: [],

    // 장바구니
    cart: [],

    // 즐겨찾기/북마크
    bookmark: [
      {
        _id: await nextSeq('bookmark'),
        user_id: 2,
        user: {
          _id: 2,
          name: '무지',
          image: `/files/${clientId}/user-jayg.webp`,
        },
        type: 'post',
        target_id: 3,
        memo: '첫째 크리스마스 선물.',
        createdAt: getTime(-3, -60 * 60 * 2),
      },
    ],

    // QnA, 공지사항 등의 게시판
    //community가 자유게시판, notice가 공지게시판, qna 문의게시판
    post: [
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 2,
          name: '네오',
          image: `files/${clientId}/user-neo.png`,
        },
        title: '회원 가입했어요.',
        content: '잘 부탁드려요.',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
        product: {
          image: null,
        },
      },
      {
        _id: await nextSeq('post'),
        type: 'notice',
        views: 23,
        user: {
          _id: 1,
          name: '무지',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '공지글 테스트',
        content: '공지글 컨텐츠 테스트',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'qna',
        views: 23,
        user: {
          _id: 2,
          name: '네오',
          image: `files/${clientId}/user-neo.png`,
        },
        title: '회원 가입했어요.',
        content: '잘 부탁드려요.',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
        replies: [
          {
            _id: await nextSeq('reply'),
            user: {
              _id: 2,
              name: '네오',
              image: 'user-neo.png',
            },
            content: '크기는 상품 상세정보에 나와 있습니다.',
            like: 5,
            createdAt: getTime(-2, -60 * 60 * 20),
            updatedAt: getTime(-2, -60 * 60 * 2),
          },
          {
            _id: await nextSeq('reply'),
            user: {
              _id: 4,
              name: '제이지',
              image: 'user-jayg.webp',
            },
            content: '어디있나 모르겠어요.',
            like: 7,
            createdAt: getTime(-2, -60 * 60 * 10),
            updatedAt: getTime(-2, -60 * 60 * 1),
          },
          {
            _id: await nextSeq('reply'),
            user: {
              _id: 2,
              name: '네오',
              image: 'user-neo.png',
            },
            content: '높이 60cm 입니다.',
            like: 3,
            createdAt: getTime(-2, -60 * 60 * 9),
            updatedAt: getTime(-1, -60 * 60 * 20),
          },
        ],
      },
      {
        _id: await nextSeq('post'),
        type: 'notice',
        views: 23,
        user: {
          _id: 1,
          name: '어피치',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '2025년 여름 세일 안내',
        content: '2025년 여름 세일 안내\n2025년 여름 세일 안내\n2025년 여름 세일 안내\n2025년 여름 세일 안내\n2025년 여름 세일 안내\n',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'notice',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '공지공지',
        content: '공지사항',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '공지공지',
        content: '공지사항',
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '게시글 테스트1 제목',
        content: '게시글 테스트1 내용',
        // image: `files/${clientId}/sample-bugatti.png`,
        // product: {
        //   image: `files/${clientId}/sample-bugatti.png`,
        //   name: '샘플 이미지',
        // },
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '게시글 테스트2 제목',
        content: '게시글 테스트2 내용',
        product: {
          image: `files/${clientId}/sample-bugatti.png`,
          name: '샘플 이미지',
        },
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
      {
        _id: await nextSeq('post'),
        type: 'community',
        views: 23,
        user: {
          _id: 1,
          name: '프로도',
          image: `files/${clientId}/user-muzi.png`,
        },
        title: '게시글 테스트3 제목',
        content: '게시글 테스트3 내용',
        product: {
          image: `files/${clientId}/sample-bugatti.png`,
          name: '샘플 이미지',
        },
        createdAt: getTime(-1, -60 * 60 * 14),
        updatedAt: getTime(-1, -60 * 60 * 2),
      },
    ],

    // 코드
    code: [],

    // 설정
    config: [],
  };
};
