export type Page =
  | { name: "movie-list" }
  | { name: "movie-detail"; movieId: number }
  | { name: "search" }
  | { name: "login" }
  | { name: "signup" }
  | { name: "my-page" };

export interface User {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
}
