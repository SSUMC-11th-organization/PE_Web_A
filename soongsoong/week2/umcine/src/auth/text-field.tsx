// 로그인, 회원가입, 내 정보 수정에서 같이 쓰는 입력 검사 규칙이에요.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NICKNAME_PATTERN = /^.{2,12}$/;
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const EMAIL_ERROR = "올바른 이메일 형식으로 입력해 주세요.";
export const NICKNAME_ERROR = "닉네임은 2~12자로 입력해 주세요.";

interface TextFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  iconSrc?: string;
  autoComplete?: string;
  readOnly?: boolean;
  hint?: string;
  error?: string;
  action?: { label: string; onClick: () => void };
}

export default function TextField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  iconSrc,
  autoComplete,
  readOnly = false,
  hint,
  error,
  action,
}: TextFieldProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="text-field">
      <label className="text-field-label" htmlFor={id}>
        {label}
      </label>
      <div className={error ? "text-field-box text-field-box--error" : "text-field-box"}>
        {iconSrc && <img className="text-field-icon" src={iconSrc} alt="" width={24} height={24} />}
        <input
          id={id}
          className="text-field-input"
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {action && (
          <button className="text-field-action" type="button" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={error ? "text-field-message text-field-message--error" : "text-field-message"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
