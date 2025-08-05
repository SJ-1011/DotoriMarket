# 온라인 소품샵 도토리섬 🐿️

![도토리섬 메인 로고](/public/readmelogo.png)

## 프로젝트 개요 🐿️

도토리섬은 귀여운 도토리 캐릭터와 함께하는 키덜트 소품샵 콘셉트의 웹 서비스입니다.<br/>
사용자가 감성적인 피규어, 문구, 인형 등 다양한 소품을 즐겁게 쇼핑할 수 있도록 디자인되었습니다.

이 프로젝트는 프론트엔드 기술 역량을 향상시키고, 협업을 통해 실제 서비스 형태의 웹사이트를 구현하는 것을 목표로 하고 있습니다.

## 팀 console.10g 소개 🐿️

| PM (Project Manager)                                                               | PL (Project Leader)                                                                 | 데이터 엔지니어                                                                      | 디자이너 (UI/UX)                                                                        |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| <img src="https://avatars.githubusercontent.com/YouVin" width="180" height="180"/> | <img src="https://avatars.githubusercontent.com/SJ-1011" width="180" height="180"/> | <img src="https://avatars.githubusercontent.com/noognoog" width="180" height="180"/> | <img src="https://avatars.githubusercontent.com/yebin-jeong" width="180" height="180"/> |
| 황유빈                                                                             | 이선진                                                                              | 엄현욱                                                                               | 정예빈                                                                                  |
| 일정·기획·커뮤니케이션 총괄                                                        | 개발 리딩 · 기술 방향 설정 · 코드 품질 관리                                         | 데이터 설계 · 분석 · 성능 최적화                                                     | 사용자 경험과 비주얼 디자인 담당                                                        |
| [GitHub](https://github.com/yubin)                                                 | [GitHub](https://github.com/SJ-1011)                                                | [GitHub](https://github.com/noognoog)                                                | [GitHub](https://github.com/yebin-jeong)                                                |

## 기술 스택 🐿️

<div align="center">

| 구분            | 사용 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **프론트엔드**  | <div align="center">![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)</div> |
| **백엔드**      | <div align="center">![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)</div>                                                                                                                                                                                                                                     |
| **데이터**      | <div align="center">![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)</div>                                                                                                                                                                                                                                                                                                                                   |
| **배포 / 기타** | <div align="center">![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Koyeb](https://img.shields.io/badge/Koyeb-121212?style=for-the-badge&logo=koyeb&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)</div>                                                                                                                                            |

</div>

## 개발 일정 🐿️

<div align="center">

| 스프린트     | 기간        | 주요 목표                                 | 핵심 작업                                                                                                                                         |
| ------------ | ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sprint 1** | 7/7 ~ 7/17  | **디자인 설계 & 공통 컴포넌트 기반 구축** | - 피그마를 활용한 UI/UX 디자인 기초 설계<br>- 프로젝트 초기 세팅(Next.js, Zustand, TailwindCSS)<br>- 버튼, 입력창, 카드 등 **공통 컴포넌트 제작** |
| **Sprint 2** | 7/18 ~ 7/24 | **페이지 구조 구현 & API 연동 기초**      | - 상품 리스트 / 상세 / 장바구니 페이지 기본 UI 적용<br>- Zustand 상태관리 및 API 연동 시작<br>- 컴포넌트 재사용 패턴 확립                         |
| **Sprint 3** | 7/25 ~ 7/31 | **사용자 흐름 완성 & 폼 처리 로직 구현**  | - 결제 페이지 및 react-hook-form 기반 사용자 입력 처리<br>- 관리자 페이지 UI 및 데이터 연동<br>- Optimistic UI 패턴 적용 및 테스트                |
| **Sprint 4** | 8/1 ~ 8/8   | **최종 마감 (코드 리팩토링 & 배포)**      | - 반응형 UI 개선(모바일/데스크탑 완성도 향상)<br>- Cloudinary 기반 이미지 최적화<br>- 버그 수정, UI 디테일 보완, Vercel 최종 배포                 |

</div>

## 프로젝트 구조 🐿️

```
05_final-project/
├── src/
│   ├── app/
│   │   ├── (user)/
│   │   ├── admin/
│   │   ├── board/
│   │   ├── cart/
│   │   ├── category/
│   │   ├── mypage/
│   │   ├── order/
│   │   ├── products/
│   │   ├── search/
│   │   ├── story/
│   │   ├── unauthorized/
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── icon/
│   │   └── main/
│   ├── constants/
│   │   └── categories.ts
│   ├── data/
│   │   ├── actions/
│   │   └── stories/
│   ├── hooks/
│   │   ├── useCartSelection.ts
│   │   ├── useHasHydrated.tsx
│   │   ├── useQuantityHandlers.ts
│   │   ├── useRemainingStock.ts
│   │   └── useToggleBookmark.ts
│   ├── stores/
│   │   ├── cartBadgeStore.ts
│   │   ├── cartQuantityStore.ts
│   │   ├── loginStore.ts
│   │   ├── notificationStore.ts
│   │   └── userStore.ts
│   ├── styles/
│   ├── types/
│   └── utils/
├── public/
├── README.md
└── package.json
```
