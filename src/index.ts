type Member = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: Member[] = [
  { id: 1, name: "광수", role: "리더", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "멤버" },
];

function getMemberInfo(id: number): string {
  const member = members.find((m) => m.id === id);

  if (!member) {
    return `ID ${id}에 해당하는 회원을 찾을 수 없어요.`;
  }

  const githubText = member.githubId ?? "등록되지 않음";
  return `${member.name}(${member.role}) - GitHub: ${githubText}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));
