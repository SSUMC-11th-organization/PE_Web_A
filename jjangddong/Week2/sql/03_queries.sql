-- =============================================================
-- 2주차 미션 - SQL로 데이터 다루기
-- 실행 순서: 01_schema.sql -> 02_seed.sql -> 03_queries.sql
-- 기준 ERD 관계
--   user 1:N rental / category 1:N book
--   book N:M tag (book_tag) / user N:M book (book_like) / user 1:N notification
-- =============================================================

USE library_week1;

-- -------------------------------------------------------------
-- 0. 접속 및 데이터 확인
-- -------------------------------------------------------------
SELECT VERSION();

SELECT
    (SELECT COUNT(*) FROM `user`)   AS user_count,
    (SELECT COUNT(*) FROM category) AS category_count,
    (SELECT COUNT(*) FROM book)     AS book_count,
    (SELECT COUNT(*) FROM rental)   AS rental_count;

-- -------------------------------------------------------------
-- 미션 1. 문학 카테고리의 대여 가능한 도서를 최신순으로 10권
-- 요구사항: "문학 카테고리에서 대여 가능한 도서를 최신순으로 10권 보여 준다."
-- 결과 컬럼: 책 제목, 설명, 카테고리 이름
--
-- 기준 테이블: book. 화면에 보여 줄 대상이 '도서'이므로 book을 FROM에 둔다.
-- JOIN한 이유: 카테고리 이름은 book에 없고 category 테이블에 있다.
--   book.category_id -> category.category_id (N:1) 관계를 따라 JOIN한다.
-- WHERE 조건: 카테고리 이름이 '문학'이고, 남은 재고가 있어야 대여 가능하다.
--   이 스키마에는 is_available 컬럼이 없어 available_copies > 0 으로 판단한다.
-- 정렬·범위: 최신순이므로 created_at 내림차순, 같은 시각이면 book_id 내림차순으로
--   순서를 고정하고 목록이므로 LIMIT 10을 붙인다.
-- -------------------------------------------------------------
SELECT
    b.title           AS `제목`,
    b.description     AS `설명`,
    c.name            AS `카테고리`
FROM book AS b
JOIN category AS c
    ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.available_copies > 0
ORDER BY b.created_at DESC, b.book_id DESC
LIMIT 10;

-- -------------------------------------------------------------
-- 미션 2. 특정 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로
-- 요구사항: "로그인한 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로 보여 준다."
-- 결과 컬럼: 책 제목, 대여일, 반납 예정일
--
-- 기준 테이블: rental. 조회 대상이 '대여 기록'이므로 rental을 FROM에 둔다.
-- JOIN한 이유: 책 제목은 rental에 없다.
--   rental.book_id -> book.book_id (N:1) 관계를 따라 JOIN한다.
-- WHERE 조건: 현재 로그인한 사용자(user_id = 1)로 범위를 좁히고,
--   아직 반납하지 않은 기록은 returned_at 이 NULL 이다.
--   NULL 은 값이 아니라 '값이 없음'이므로 = NULL 이 아니라 IS NULL 로 비교한다.
-- 정렬: 반납이 급한 순서가 먼저 보여야 하므로 due_at 오름차순.
-- -------------------------------------------------------------
SELECT
    b.title       AS `제목`,
    r.rented_at   AS `대여일`,
    r.due_at      AS `반납예정일`
FROM rental AS r
JOIN book AS b
    ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

-- -------------------------------------------------------------
-- 미션 3. 특정 책의 태그 목록과 특정 사용자의 좋아요 여부
-- 요구사항: "책 상세 화면에서 태그 목록과 현재 사용자의 좋아요 여부를 함께 확인한다."
-- 결과 컬럼: 책 제목, 태그 이름, 좋아요 여부
--
-- 기준 테이블: book. 상세 화면의 주인공이 책 한 권이다.
-- JOIN한 이유:
--   book N:M tag 관계는 중간 테이블 book_tag 를 거쳐야 한다.
--     book -> book_tag -> tag 두 단계로 JOIN 한다.
--   좋아요는 book_like 에 (user_id, book_id) 행이 있는지로 판단한다.
--     좋아요를 누르지 않아도 태그는 보여야 하므로 INNER JOIN 이 아니라 LEFT JOIN 을 쓴다.
--     이때 user_id 조건을 WHERE 에 쓰면 행이 사라져 LEFT JOIN 이 무의미해지므로
--     반드시 ON 절에 함께 적는다.
-- WHERE 조건: 선택한 book_id = 1.
-- 정렬: 태그 순서를 고정하기 위해 tag_id 오름차순.
-- -------------------------------------------------------------
SELECT
    b.title                             AS `제목`,
    t.name                              AS `태그`,
    IF(bl.user_id IS NULL, '아니오', '예') AS `좋아요여부`
FROM book AS b
JOIN book_tag AS bt
    ON b.book_id = bt.book_id
JOIN tag AS t
    ON bt.tag_id = t.tag_id
LEFT JOIN book_like AS bl
    ON bl.book_id = b.book_id
   AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id ASC;

-- -------------------------------------------------------------
-- 목록 조회와 LIMIT / OFFSET
-- ORDER BY 가 없으면 같은 쿼리도 순서가 달라질 수 있어 페이지가 겹치거나 빠진다.
-- 정렬 기준이 같은 값일 때를 대비해 PK(book_id)를 보조 정렬로 붙인다.
-- -------------------------------------------------------------
-- 1페이지
SELECT b.book_id, b.title, c.name AS `카테고리`
FROM book AS b
JOIN category AS c ON b.category_id = c.category_id
ORDER BY b.created_at DESC, b.book_id DESC
LIMIT 10 OFFSET 0;

-- 2페이지
SELECT b.book_id, b.title, c.name AS `카테고리`
FROM book AS b
JOIN category AS c ON b.category_id = c.category_id
ORDER BY b.created_at DESC, b.book_id DESC
LIMIT 10 OFFSET 10;

-- -------------------------------------------------------------
-- 추가 실습. 기준 ERD의 단일 테이블 조회
-- 요구사항: "사용자가 읽지 않은 알림을 최신순으로 10개 보여 준다."
-- (1주차 ERD 확장 과제는 04_extension.sql 에 따로 작성했다.)
-- 결과 컬럼: 알림 제목, 내용, 생성 시각
--
-- 기준 테이블: notification. user 1:N notification 관계에서
--   조회 대상이 알림이므로 notification 을 FROM 에 둔다.
-- JOIN: 화면에 사용자 정보를 함께 보여 줄 필요가 없다면 JOIN 하지 않는다.
--   필요한 컬럼이 모두 notification 안에 있으므로 단일 테이블 조회로 끝난다.
-- WHERE 조건: 현재 사용자(user_id = 1)이고 is_read = FALSE 인 알림만.
-- 정렬·범위: created_at 내림차순, notification_id 내림차순 보조 정렬, LIMIT 10.
-- -------------------------------------------------------------
SELECT
    n.title       AS `알림제목`,
    n.message     AS `내용`,
    n.created_at  AS `생성시각`
FROM notification AS n
WHERE n.user_id = 1
  AND n.is_read = FALSE
ORDER BY n.created_at DESC, n.notification_id DESC
LIMIT 10 OFFSET 0;
