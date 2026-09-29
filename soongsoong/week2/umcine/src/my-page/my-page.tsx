import { useRef, useState, type ChangeEvent } from "react";
import type { Movie } from "../types/movie";
import type { User } from "../types/app";
import MovieGrid from "../movie-list/movie-grid";
import Pagination from "../movie-list/pagination";
import TextField, { NICKNAME_ERROR, NICKNAME_PATTERN } from "../auth/text-field";
import "../auth/auth.css";
import "./my-page.css";

interface MyPageProps {
  user: User;
  bookmarkedMovies: Movie[];
  onSelectMovie: (movieId: number) => void;
  onSaveUser: (user: User) => void;
  onWithdraw: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function ProfileAvatar({ imageUrl }: { imageUrl: string | null }) {
  return (
    <span className="profile-avatar">
      {imageUrl ? (
        <img className="profile-avatar-image" src={imageUrl} alt="프로필 이미지" />
      ) : (
        <img className="profile-avatar-default" src="/icons/person.svg" alt="" />
      )}
    </span>
  );
}

export default function MyPage({
  user,
  bookmarkedMovies,
  onSelectMovie,
  onSaveUser,
  onWithdraw,
}: MyPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nicknameError = NICKNAME_PATTERN.test(nickname.trim()) ? undefined : NICKNAME_ERROR;

  function handleStartEdit() {
    setNickname(user.nickname);
    setProfileImageUrl(user.profileImageUrl);
    setImageError("");
    setIsEditing(true);
    window.scrollTo(0, 0);
  }

  function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 선택할 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("5MB 이하의 이미지만 선택할 수 있어요.");
      return;
    }
    // TODO: 백엔드 API가 준비되면 이미지를 업로드하고 받은 URL을 저장해요.
    setImageError("");
    setProfileImageUrl(URL.createObjectURL(file));
  }

  function handleCheckDuplicate() {
    // TODO: 백엔드 API가 준비되면 닉네임 중복 확인 요청을 보내요.
  }

  function handleSave() {
    if (nicknameError) {
      return;
    }
    // TODO: 백엔드 API가 준비되면 변경사항을 서버에 저장해요.
    onSaveUser({ ...user, nickname: nickname.trim(), profileImageUrl });
    setIsEditing(false);
    window.scrollTo(0, 0);
  }

  function handleWithdraw() {
    if (!window.confirm("정말 탈퇴할까요? 평점, 후기, 즐겨찾기는 복구할 수 없어요.")) {
      return;
    }
    // TODO: 백엔드 API가 준비되면 회원 탈퇴 요청을 보내요.
    onWithdraw();
  }

  if (isEditing) {
    return (
      <main className="my-page my-page--edit">
        <div className="my-page-heading">
          <div>
            <h1 className="my-page-title">내 정보 수정</h1>
            <p className="my-page-description">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button className="my-page-primary-button" type="button" onClick={handleSave}>
            변경사항 저장
          </button>
        </div>

        <div className="my-page-edit-body">
          <div className="my-page-edit-avatar">
            <div className="my-page-edit-avatar-image">
              <ProfileAvatar imageUrl={profileImageUrl} />
              <button
                className="my-page-edit-avatar-button"
                type="button"
                aria-label="프로필 이미지 변경"
                onClick={() => fileInputRef.current?.click()}
              >
                <img src="/icons/edit.svg" alt="" width={24} height={24} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleChangeImage}
              />
            </div>
            <p className="my-page-edit-avatar-label">프로필 이미지</p>
            <p className="my-page-edit-avatar-hint">선택 사항 · 최대 5MB</p>
            {imageError && <p className="my-page-edit-avatar-error">{imageError}</p>}
          </div>

          <div className="my-page-edit-fields">
            <TextField
              id="edit-nickname"
              label="닉네임"
              placeholder="2–12자"
              value={nickname}
              onChange={setNickname}
              autoComplete="nickname"
              error={nicknameError}
              action={{ label: "중복 확인", onClick: handleCheckDuplicate }}
            />
            <TextField
              id="edit-email"
              label="이메일"
              type="email"
              placeholder="name@example.com"
              value={user.email}
              onChange={() => {}}
              readOnly
            />
          </div>
        </div>

        <section className="withdraw">
          <div>
            <h2 className="withdraw-title">회원 탈퇴</h2>
            <p className="withdraw-description">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button className="withdraw-button" type="button" onClick={handleWithdraw}>
            회원 탈퇴
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="my-page">
      <div className="my-page-heading">
        <h1 className="my-page-title">내 정보</h1>
        <button className="my-page-primary-button" type="button" onClick={handleStartEdit}>
          정보 수정
        </button>
      </div>

      <section className="my-page-section">
        <h2 className="my-page-section-title">기본 정보</h2>
        <div className="my-page-profile">
          <ProfileAvatar imageUrl={user.profileImageUrl} />
          <dl className="my-page-profile-item">
            <dt>닉네임</dt>
            <dd>{user.nickname}</dd>
          </dl>
          <dl className="my-page-profile-item">
            <dt>이메일</dt>
            <dd>{user.email}</dd>
          </dl>
        </div>
      </section>

      <section className="my-page-section">
        <h2 className="my-page-section-title">내 즐겨찾기</h2>
        {bookmarkedMovies.length > 0 ? (
          <>
            <MovieGrid movies={bookmarkedMovies} onSelectMovie={onSelectMovie} />
            <Pagination currentPage={1} totalPages={1} />
          </>
        ) : (
          <p className="my-page-empty">아직 즐겨찾기한 영화가 없어요.</p>
        )}
      </section>
    </main>
  );
}
