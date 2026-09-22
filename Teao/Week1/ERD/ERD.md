# UMC 맛집 미션 서비스 ERD

```mermaid
erDiagram
    MEMBER {
        bigint member_id PK
        varchar email UK
        varchar nickname
        varchar gender
        date birth_date
        varchar address
        datetime created_at
    }

    SOCIAL_ACCOUNT {
        bigint social_account_id PK
        bigint member_id FK
        varchar provider
        varchar provider_user_id
    }

    REGION {
        bigint region_id PK
        varchar name UK
        int completion_goal
        int completion_reward_point
    }

    FOOD_CATEGORY {
        bigint food_category_id PK
        varchar name UK
    }

    MEMBER_FOOD_PREFERENCE {
        bigint member_id PK, FK
        bigint food_category_id PK, FK
    }

    STORE {
        bigint store_id PK
        bigint region_id FK
        bigint food_category_id FK
        varchar name
        varchar address
    }

    MISSION {
        bigint mission_id PK
        bigint store_id FK
        varchar title
        varchar requirement_text
        int reward_point
        datetime deadline_at
    }

    MEMBER_MISSION {
        bigint member_mission_id PK
        bigint member_id FK
        bigint mission_id FK
        varchar status
        datetime accepted_at
        datetime completed_at
    }

    MEMBER ||--o{ SOCIAL_ACCOUNT : "소셜 계정으로 로그인"
    MEMBER ||--o{ MEMBER_FOOD_PREFERENCE : "선호 음식 선택"
    FOOD_CATEGORY ||--o{ MEMBER_FOOD_PREFERENCE : "선호 대상으로 선택"
    REGION ||--o{ STORE : "가게를 포함"
    FOOD_CATEGORY ||--o{ STORE : "가게를 분류"
    STORE ||--o{ MISSION : "미션을 제공"
    MEMBER ||--o{ MEMBER_MISSION : "미션을 수행"
    MISSION ||--o{ MEMBER_MISSION : "수행 내역을 가짐"
```

## 핵심 제약

- `SOCIAL_ACCOUNT(provider, provider_user_id)`는 유일해야 합니다.
- `MEMBER_MISSION(member_id, mission_id)`는 유일해야 합니다.
- `MEMBER_MISSION.status`는 `IN_PROGRESS` 또는 `COMPLETED`를 사용합니다.
- 회원은 선호 음식 카테고리를 최대 3개까지 선택합니다.
- 지역별 기본값은 `completion_goal = 10`, `completion_reward_point = 1000`입니다.
- 지도·검색, 포인트 내역, 알림 설정, 점포 관리, 리뷰 데이터는 이번 ERD에서 제외합니다.
