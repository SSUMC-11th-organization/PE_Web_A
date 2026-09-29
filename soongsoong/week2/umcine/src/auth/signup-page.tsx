import { useState, type FormEvent } from "react";
import type { Page } from "../types/app";
import TextField, {
  EMAIL_ERROR,
  EMAIL_PATTERN,
  NICKNAME_ERROR,
  NICKNAME_PATTERN,
  PASSWORD_PATTERN,
} from "./text-field";
import "./auth.css";

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errors = {
    email: EMAIL_PATTERN.test(email) ? undefined : EMAIL_ERROR,
    nickname: NICKNAME_PATTERN.test(nickname.trim()) ? undefined : NICKNAME_ERROR,
    password: PASSWORD_PATTERN.test(password)
      ? undefined
      : "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.",
    passwordConfirm:
      passwordConfirm !== "" && passwordConfirm === password
        ? undefined
        : "비밀번호가 일치하지 않아요.",
  };

  // 입력을 시작했거나 가입하기를 누른 뒤에만 오류를 보여줘요.
  function visibleError(value: string, error?: string) {
    return value !== "" || isSubmitted ? error : undefined;
  }

  function handleCheckDuplicate() {
    // TODO: 백엔드 API가 준비되면 중복 확인 요청을 보내요.
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);

    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      return;
    }
    // TODO: 백엔드 API가 준비되면 회원가입 요청을 보내요.
  }

  return (
    <main className="auth">
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <h1 className="auth-title">회원가입</h1>

        <TextField
          id="signup-email"
          label="이메일"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          error={visibleError(email, errors.email)}
          action={{ label: "중복 확인", onClick: handleCheckDuplicate }}
        />
        <TextField
          id="signup-nickname"
          label="닉네임"
          placeholder="2–12자"
          value={nickname}
          onChange={setNickname}
          autoComplete="nickname"
          error={visibleError(nickname, errors.nickname)}
          action={{ label: "중복 확인", onClick: handleCheckDuplicate }}
        />
        <TextField
          id="signup-password"
          label="비밀번호"
          type="password"
          placeholder="8자 이상"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          hint="영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요"
          error={visibleError(password, errors.password)}
        />
        <TextField
          id="signup-password-confirm"
          label="비밀번호 확인"
          type="password"
          placeholder="다시 입력"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          autoComplete="new-password"
          error={visibleError(passwordConfirm, errors.passwordConfirm)}
        />

        <button className="auth-submit" type="submit">
          가입하기
        </button>

        <p className="auth-switch">
          이미 계정이 있나요?{" "}
          <button type="button" onClick={() => onNavigate({ name: "login" })}>
            로그인
          </button>
        </p>
      </form>
    </main>
  );
}
