-- =============================================================
-- 확장 과제 - 1주차 ERD(미션 수행 서비스) 기반 조회 요구사항
--
-- 1주차 ERD 관계
--   member 1:1 social_account
--   member N:M food_category (member_food_preference)
--   region 1:N store / food_category 1:N store
--   store 1:N mission
--   member N:M mission (member_mission)
--   member_mission 1:0..1 review
--   review 1:N review_photo
--   member N:M region (member_region, 지역별 진행률)
--
-- 이 파일은 확장 과제용이며 library_week1 과 별도의 스키마를 사용한다.
-- 실행 순서: 1. 테이블 생성 -> 2. 더미 데이터 -> 3. 조회 쿼리
-- =============================================================

-- -------------------------------------------------------------
-- 1. 테이블 생성 (DDL)
-- -------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS umc_mission_week1
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE umc_mission_week1;

CREATE TABLE IF NOT EXISTS member (
    member_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)  NOT NULL,
    gender      VARCHAR(10)  NULL,
    birth_date  DATE         NULL,
    address     VARCHAR(255) NULL,
    nickname    VARCHAR(50)  NOT NULL,
    email       VARCHAR(255) NOT NULL,
    total_point INT UNSIGNED NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id),
    UNIQUE KEY uk_member_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS social_account (
    social_account_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id         BIGINT UNSIGNED NOT NULL,
    provider          VARCHAR(20)  NOT NULL,
    social_uid        VARCHAR(100) NOT NULL,
    PRIMARY KEY (social_account_id),
    -- 소셜 로그인만 지원하므로 회원 한 명당 계정 한 개 (1:1)
    UNIQUE KEY uk_social_member (member_id),
    UNIQUE KEY uk_social_provider_uid (provider, social_uid),
    CONSTRAINT fk_social_member FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS food_category (
    food_category_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name             VARCHAR(50) NOT NULL,
    PRIMARY KEY (food_category_id),
    UNIQUE KEY uk_food_category_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS member_food_preference (
    member_id        BIGINT UNSIGNED NOT NULL,
    food_category_id BIGINT UNSIGNED NOT NULL,
    -- 다대다를 연결 테이블로 풀었으므로 두 FK를 묶어 복합 PK로 둔다
    PRIMARY KEY (member_id, food_category_id),
    CONSTRAINT fk_mfp_member FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_mfp_category FOREIGN KEY (food_category_id) REFERENCES food_category (food_category_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS region (
    region_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name      VARCHAR(50) NOT NULL,
    PRIMARY KEY (region_id),
    UNIQUE KEY uk_region_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS store (
    store_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    region_id        BIGINT UNSIGNED NOT NULL,
    food_category_id BIGINT UNSIGNED NOT NULL,
    name             VARCHAR(100) NOT NULL,
    address          VARCHAR(255) NOT NULL,
    rating           FLOAT NOT NULL DEFAULT 0,
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (store_id),
    CONSTRAINT fk_store_region FOREIGN KEY (region_id) REFERENCES region (region_id),
    CONSTRAINT fk_store_category FOREIGN KEY (food_category_id) REFERENCES food_category (food_category_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mission (
    mission_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    store_id       BIGINT UNSIGNED NOT NULL,
    title          VARCHAR(100)  NOT NULL,
    condition_desc VARCHAR(255)  NULL,
    min_amount     INT UNSIGNED  NOT NULL DEFAULT 0,
    reward_point   INT UNSIGNED  NOT NULL DEFAULT 0,
    is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
    PRIMARY KEY (mission_id),
    CONSTRAINT fk_mission_store FOREIGN KEY (store_id) REFERENCES store (store_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS member_mission (
    member_mission_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id         BIGINT UNSIGNED NOT NULL,
    mission_id        BIGINT UNSIGNED NOT NULL,
    status            VARCHAR(20) NOT NULL DEFAULT '도전가능',
    auth_code         VARCHAR(20) NULL,
    challenged_at     DATETIME NULL,
    completed_at      DATETIME NULL,
    PRIMARY KEY (member_mission_id),
    UNIQUE KEY uk_member_mission (member_id, mission_id),
    CONSTRAINT fk_mm_member FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_mm_mission FOREIGN KEY (mission_id) REFERENCES mission (mission_id),
    INDEX idx_mm_member_status (member_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS review (
    review_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_mission_id BIGINT UNSIGNED NOT NULL,
    rating            INT UNSIGNED NOT NULL,
    content           VARCHAR(1000) NULL,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (review_id),
    -- 완료된 수행 건마다 리뷰는 최대 1개이므로 UNIQUE 로 1:0..1 을 보장한다
    UNIQUE KEY uk_review_member_mission (member_mission_id),
    CONSTRAINT fk_review_member_mission FOREIGN KEY (member_mission_id) REFERENCES member_mission (member_mission_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS review_photo (
    review_photo_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    review_id       BIGINT UNSIGNED NOT NULL,
    photo_url       VARCHAR(500) NOT NULL,
    PRIMARY KEY (review_photo_id),
    CONSTRAINT fk_review_photo_review FOREIGN KEY (review_id) REFERENCES review (review_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS member_region (
    member_id             BIGINT UNSIGNED NOT NULL,
    region_id             BIGINT UNSIGNED NOT NULL,
    cleared_mission_count INT UNSIGNED NOT NULL DEFAULT 0,
    bonus_granted_at      DATETIME NULL,
    PRIMARY KEY (member_id, region_id),
    CONSTRAINT fk_mr_member FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_mr_region FOREIGN KEY (region_id) REFERENCES region (region_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- 2. 더미 데이터
-- -------------------------------------------------------------
INSERT INTO member (member_id, name, gender, birth_date, address, nickname, email, total_point) VALUES
    (1, '장동현', '남', '2002-03-14', '서울시 성북구 안암동', '짱똥', 'jjangddong@example.com', 1200),
    (2, '김태욱', '남', '2001-11-02', '서울시 성북구 안암동', '테오', 'teao@example.com', 300)
ON DUPLICATE KEY UPDATE nickname = VALUES(nickname);

INSERT INTO social_account (social_account_id, member_id, provider, social_uid) VALUES
    (1, 1, 'KAKAO', 'kakao-1001'),
    (2, 2, 'GOOGLE', 'google-2002')
ON DUPLICATE KEY UPDATE social_uid = VALUES(social_uid);

INSERT INTO food_category (food_category_id, name) VALUES
    (1, '한식'), (2, '일식'), (3, '중식')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT IGNORE INTO member_food_preference (member_id, food_category_id) VALUES
    (1, 1), (1, 2), (2, 3);

INSERT INTO region (region_id, name) VALUES
    (1, '안암동'), (2, '성수동')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO store (store_id, region_id, food_category_id, name, address, rating) VALUES
    (1, 1, 1, '안암 국밥', '서울시 성북구 안암로 1', 4.5),
    (2, 1, 2, '안암 스시', '서울시 성북구 안암로 12', 4.2),
    (3, 2, 3, '성수 마라탕', '서울시 성동구 성수일로 3', 3.9)
ON DUPLICATE KEY UPDATE name = VALUES(name), rating = VALUES(rating);

INSERT INTO mission (mission_id, store_id, title, condition_desc, min_amount, reward_point, is_active) VALUES
    (1, 1, '국밥 1만원 미션', '1만원 이상 결제하고 리뷰 남기기', 10000, 500, TRUE),
    (2, 1, '점심 시간 방문 미션', '평일 점심에 방문하기', 8000, 300, TRUE),
    (3, 2, '스시 오마카세 미션', '2만원 이상 결제하기', 20000, 1000, TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO member_mission (member_mission_id, member_id, mission_id, status, auth_code, challenged_at, completed_at) VALUES
    (1, 1, 1, '완료',   'A1B2C3', '2026-09-10 12:00:00', '2026-09-10 13:10:00'),
    (2, 1, 2, '진행중', 'D4E5F6', '2026-09-25 11:30:00', NULL),
    (3, 2, 1, '완료',   'G7H8I9', '2026-09-20 18:00:00', '2026-09-20 19:00:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO review (review_id, member_mission_id, rating, content, created_at) VALUES
    (1, 1, 5, '국물이 진하고 양이 많아요. 미션도 쉽게 달성했습니다.', '2026-09-10 13:30:00'),
    (2, 3, 4, '재방문 의사 있습니다. 포인트도 바로 들어왔어요.', '2026-09-20 19:20:00')
ON DUPLICATE KEY UPDATE content = VALUES(content);

INSERT INTO review_photo (review_photo_id, review_id, photo_url) VALUES
    (1, 1, 'https://example.com/photos/1.jpg'),
    (2, 1, 'https://example.com/photos/2.jpg'),
    (3, 2, 'https://example.com/photos/3.jpg')
ON DUPLICATE KEY UPDATE photo_url = VALUES(photo_url);

INSERT INTO member_region (member_id, region_id, cleared_mission_count, bonus_granted_at) VALUES
    (1, 1, 7, NULL),
    (2, 1, 3, NULL)
ON DUPLICATE KEY UPDATE cleared_mission_count = VALUES(cleared_mission_count);

-- -------------------------------------------------------------
-- 3. 확장 조회 쿼리
-- 요구사항: "가게 상세 화면에서 그 가게에 달린 리뷰를 최신순으로 10개 보여 준다."
-- 결과 컬럼: 작성자 닉네임, 별점, 내용, 작성일
--
-- 기준 테이블: review. 화면에 보여 줄 대상이 리뷰이므로 review 를 FROM 에 둔다.
-- JOIN한 이유: 1주차 ERD에서 리뷰는 회원이나 가게에 직접 연결되어 있지 않고
--   완료된 member_mission 한 건에만 연결된다. 따라서
--     작성자를 찾으려면 review -> member_mission -> member
--     대상 가게를 찾으려면 review -> member_mission -> mission -> store
--   두 경로를 모두 타야 한다. 중간 테이블을 건너뛰면 연결할 수 있는 FK가 없다.
-- WHERE 조건: 선택한 가게(store_id = 1)의 리뷰만 남긴다.
-- 정렬·범위: 최신순이므로 created_at 내림차순, 같은 시각이면 review_id 내림차순으로
--   순서를 고정하고 목록이므로 LIMIT 10 OFFSET 0 을 붙인다.
-- -------------------------------------------------------------
SELECT
    m.nickname   AS `작성자`,
    r.rating     AS `별점`,
    r.content    AS `내용`,
    r.created_at AS `작성일`
FROM review AS r
JOIN member_mission AS mm
    ON r.member_mission_id = mm.member_mission_id
JOIN member AS m
    ON mm.member_id = m.member_id
JOIN mission AS ms
    ON mm.mission_id = ms.mission_id
JOIN store AS s
    ON ms.store_id = s.store_id
WHERE s.store_id = 1
ORDER BY r.created_at DESC, r.review_id DESC
LIMIT 10 OFFSET 0;

-- -------------------------------------------------------------
-- 추가. "내가 진행 중인 미션을 도전한 순서대로 보여 준다."
-- 기준 테이블: member_mission. 조회 대상이 수행 이력이다.
-- JOIN한 이유: 미션 제목과 포인트는 mission 에, 가게 이름은 store 에 있다.
--   member_mission -> mission -> store 순서로 관계를 따라간다.
-- WHERE 조건: 로그인한 회원(member_id = 1)이고 status 가 '진행중' 인 건만.
--   아직 완료하지 않았으므로 completed_at IS NULL 조건으로도 확인할 수 있다.
-- 정렬·범위: 도전한 지 오래된 순서가 먼저 보이도록 challenged_at 오름차순, LIMIT 10.
-- -------------------------------------------------------------
SELECT
    ms.title         AS `미션`,
    s.name           AS `가게`,
    ms.reward_point  AS `보상포인트`,
    mm.auth_code     AS `인증번호`,
    mm.challenged_at AS `도전일`
FROM member_mission AS mm
JOIN mission AS ms
    ON mm.mission_id = ms.mission_id
JOIN store AS s
    ON ms.store_id = s.store_id
WHERE mm.member_id = 1
  AND mm.status = '진행중'
  AND mm.completed_at IS NULL
ORDER BY mm.challenged_at ASC
LIMIT 10;
