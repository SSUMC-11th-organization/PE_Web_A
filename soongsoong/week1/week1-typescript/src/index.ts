
/*
//미니실습 : 컴파일 오류와 런타임 오류 구분하기
function introduceStudent(studentName: string, currentLevel: number) {
  return studentName + " 님은 현재 " + currentLevel + "레벨이에요.";
}
// introduceStudent("광수", "1");
introduceStudent("광수", 1);

// error log
// src/index.ts:11:24 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
// 11 introduceStudent("광수", "1");


// 미니 실습 : 값의 종류와 추론 확인하기 
const nickName = "숭숭";
const week = 1;
const isCompleted = false;

const studentNames = ["광수", "지수", "현우"];
// studentNames.push(22); 
const studentNames2 = ["광수", "지수", "현우"];

console.log(studentNames[0] === "광수"); //True
console.log(studentNames === studentNames2); //False

// error 발생이유
// String 배열에 number를 넣으려고 해서 발생
// Argument of type 'number' is not assignable to parameter of type 'string'.


// 미니 실습: 오류를 고쳐 회원 카드 만들기
type StudyMember = {
  name: string;
  level: number;
  isLeader: boolean;
};

const member: StudyMember = {
  name: "광수",
  level: 1,
    isLeader: true,
};

function createMemberCard(studyMember: StudyMember) {
  return studyMember.name + " 님, " + studyMember.level + "레벨";
}

console.log(createMemberCard(member));

// 미니실습 : 회원 역할에 따라 문구 바꾸기
type MemberRole = "leader" | "member";
function isLeader(isLeader: MemberRole) {
    if (isLeader === "leader") {
        return "스터디를 이끌어요.";
    } else {
        return "스터디에 참여해요.";
    }
}
// console.log(isLeader("leaders")); // error 발생

// 값이 없는 경우와 기본값 비교하기
type StudyMember2 = {
  name: string;
  githubId?: string;
};

const members: StudyMember2[] = [
  { name: "광수", githubId: "gwangsoo" },
  { name: "지수" },
];

const studyHour: number | undefined = 0;
console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0

let selectedMember: StudyMember2 | null = null;
const foundMember = members.find((member) => member.name === "현우");
const displayGithubId = foundMember?.githubId ?? "등록되지 않음";

function formatStudyWeek(studyWeek: number | unknown) {
    if (typeof studyWeek === "number"){
        return "현재 " + studyWeek + "주차에요.";
    } else if (studyWeek === "String") {
        return "입력한 주차: " + studyWeek;
    } else {
        return "주차를 확인할 수 없어요.";
    }
}

type Member = {
    name: string;
    level: number;
    memberRole: "leader" | "member";
}

function createBox<T extends Member>(member: T) {
  return { 
    name: member.name + " 님, " + member.level + "레벨, " + member.memberRole 
  };
}

type WeeklyGoal = {
  title: string;
  targetCount: number;
};

const weeklyGoal: WeeklyGoal = {
  title: "TypeScript 예제 연습",
  targetCount: 3,
};

function printGoal(goal: WeeklyGoal): string {
  const message = goal.title + " (목표: " + goal.targetCount + "회)";
  console.log(message);
  return message;
}

?? : null 이나 undefined인 경우에만 기본값을 반환
|| : falsy한 값이면 기본값을 반환 (false, 0, ""(빈 문자열), null, undefined, NaN)
*/



/* Mission 스터디 회원 관리 프로그램 완성하기 */

// 회원 정보 타입 정의
type StudyMember = {
  id: string;
  name: string;
  role: "leader" | "member";
  githubId?: string;
};

const member1: StudyMember = {
  id: "1",
  name: "지향",
  role: "leader",
  githubId: "choi-jihyang"
};

const member2: StudyMember = {
  id: "2",
  name: "지수",
  role: "member"
};

// GitHub 아이디가 없는 회원과 존재하지 않는 회원도 오류 없이 처리
function getMemberInfo(memberId: string): string {
    const members: StudyMember[] = [member1, member2];
    const foundMember = members.find((member) => member.id === memberId);
    if (!foundMember) {
        return "회원을 찾을 수 없습니다.";
    }
    const githubId = foundMember.githubId ?? "없음";
    return "회원 ID: " + foundMember.id + ", 이름: " + foundMember.name + ", 역할: " + foundMember.role + ", GitHub ID: " + githubId;
}

// 출력
console.log(getMemberInfo("1"));
console.log(getMemberInfo("2"));
console.log(getMemberInfo("999"));


