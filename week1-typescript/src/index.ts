interface Member {
  id: number;
  name: string;
  role: string;
  githubId?: string;
}

const members: Member[] = [
  { id: 1, name: "박태", role: "스터디장", githubId: "tjdwns4570" },
  { id: 2, name: "김태욱", role: "팀원" },
];

function introduceMember(id: number): string {
  const member = members.find((m) => m.id === id);

  if (!member) {
    return `ID ${id}에 해당하는 회원을 찾을 수 없어요.`;
  }

  const githubInfo = member.githubId
    ? ` GitHub 아이디는 @${member.githubId}예요.`
    : " GitHub 아이디는 등록되어 있지 않아요.";

  return `${member.name} 님은 ${member.role}이에요.${githubInfo}`;
}

[1, 2, 999].forEach((id) => {
  console.log(introduceMember(id));
});
