type id = number;
type name = string;
type role = "user" | "admin"
type githubId = string;

interface User {
  id : id;
  name : name;
  role : role;
  githubId? : githubId;
}

const users: User[] = [
  {
    id: 1,
    name: "김철수",
    role: "admin",
    githubId: "chulsoo-kim",
  },
  {
    id: 2,
    name: "이영희",
    role: "user",
    // githubId 없어도 OK (optional이라서)
  },
];

for (const id of [1,2,999]) {
  let flag = false;
  for(const u of users) {
    if(u.id === id) {
      const usersGithubId = u.githubId || "존재하지 않음"
      console.log(u.name +"의 github id: " + usersGithubId);
      flag = true;
      break;
    }
  }
  if(!flag) {
    console.log("id가 " + id+ "인 user는 존재하지 않음.");
  }
}