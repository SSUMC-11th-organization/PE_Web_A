CREATE TABLE member (
    member_id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NULL,
    birth_date DATE NULL,
    address VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (member_id),
    UNIQUE KEY uk_member_email (email)
);

CREATE TABLE social_account (
    social_account_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (social_account_id),
    UNIQUE KEY uk_social_account_provider_user (provider, provider_user_id),
    CONSTRAINT fk_social_account_member
        FOREIGN KEY (member_id) REFERENCES member (member_id)
);

CREATE TABLE region (
    region_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    completion_goal INT NOT NULL DEFAULT 10,
    completion_reward_point INT NOT NULL DEFAULT 1000,
    PRIMARY KEY (region_id),
    UNIQUE KEY uk_region_name (name)
);

CREATE TABLE food_category (
    food_category_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (food_category_id),
    UNIQUE KEY uk_food_category_name (name)
);

CREATE TABLE member_food_preference (
    member_id BIGINT NOT NULL,
    food_category_id BIGINT NOT NULL,
    PRIMARY KEY (member_id, food_category_id),
    CONSTRAINT fk_preference_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_preference_food_category
        FOREIGN KEY (food_category_id) REFERENCES food_category (food_category_id)
);

CREATE TABLE store (
    store_id BIGINT NOT NULL AUTO_INCREMENT,
    region_id BIGINT NOT NULL,
    food_category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    PRIMARY KEY (store_id),
    CONSTRAINT fk_store_region
        FOREIGN KEY (region_id) REFERENCES region (region_id),
    CONSTRAINT fk_store_food_category
        FOREIGN KEY (food_category_id) REFERENCES food_category (food_category_id)
);

CREATE TABLE mission (
    mission_id BIGINT NOT NULL AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    requirement_text VARCHAR(255) NOT NULL,
    reward_point INT NOT NULL,
    deadline_at DATETIME NOT NULL,
    PRIMARY KEY (mission_id),
    CONSTRAINT fk_mission_store
        FOREIGN KEY (store_id) REFERENCES store (store_id)
);

CREATE TABLE member_mission (
    member_mission_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    mission_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    accepted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    PRIMARY KEY (member_mission_id),
    UNIQUE KEY uk_member_mission (member_id, mission_id),
    CONSTRAINT fk_member_mission_member
        FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT fk_member_mission_mission
        FOREIGN KEY (mission_id) REFERENCES mission (mission_id)
);
