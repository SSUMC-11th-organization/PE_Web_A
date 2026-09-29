import { useState, type FormEvent } from "react";
import type { Page, User } from "../types/app";
import TextField, { EMAIL_ERROR, EMAIL_PATTERN } from "./text-field";
import "./auth.css";

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (user: User) => void;
}

export default function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const errors = {
    email: EMAIL_PATTERN.test(email) ? undefined : EMAIL_ERROR,
    password: password !== "" ? undefined : "비밀번호를 입력해 주세요.",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);

    if (errors.email || errors.password) {
      return;
    }

    // TODO: 백엔드 API가 준비되면 로그인 요청을 보내요. 지금은 형식만 맞으면 로그인돼요.
    onLogin({
      nickname: email.split("@")[0],
      email,
      profileImageUrl: null,
    });
  }

  return (
    <main className="auth">
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <h1 className="auth-title">로그인</h1>

        <TextField
          id="login-email"
          label="이메일"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={setEmail}
          iconSrc="/icons/mail.svg"
          autoComplete="email"
          error={email !== "" || isSubmitted ? errors.email : undefined}
        />
        <TextField
          id="login-password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={setPassword}
          iconSrc="/icons/lock.svg"
          autoComplete="current-password"
          error={isSubmitted ? errors.password : undefined}
        />

        <button className="auth-submit" type="submit">
          로그인
        </button>

        <p className="auth-switch">
          처음이신가요?{" "}
          <button type="button" onClick={() => onNavigate({ name: "signup" })}>
            회원가입
          </button>
        </p>
      </form>
    </main>
  );
}
