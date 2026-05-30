import { PortfolioData } from './types';

export const defaultPortfolioData: PortfolioData = {
  hero: {
    tag: "SYS.INIT // STUDENT PROFILE",
    title: "Building Robots,\nSolving Problems",
    highlight: "로봇을 만들고 코딩하며 문제를 해결한 과정을 소개합니다.",
    description: "저는 로봇을 만들고 코딩하며 문제를 해결하는 것을 좋아합니다. 센서와 모터를 활용해 로봇이 스스로 움직이도록 만드는 과정에 관심이 있습니다. 실패한 로봇을 다시 수정하고 테스트하면서 더 나은 해결 방법을 찾는 과정을 배우고 있습니다.",
    descriptionPara2: "앞으로 다양한 로봇 프로젝트에 도전하며 창의적인 문제 해결 능력을 키우고 싶습니다.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4DSULRVEFkJkBajmYQp475_tdV-tRhj2V7TLh46u3r0EnxdY0LZNdHepMXvyTAVnfFMeyW27Cg90RD1Xeuutl2OacGghp4lnuqZobS1dWXrlfi7Q2VvkEYgY_D-ceXyr8P5424eWjIlcoRoNBXtXaIbbGPPIEu8-SsLTq_I8Xck9hreuJY3Sq4_DisniXPDSC-g5d5smxhd1sKAlA1cdLJXah-HNMXHByXdtMz5Pxt0VmqB6qHIsA1TicYz8SlRkYWISJJwHKsDw"
  },
  experiences: [
    {
      id: "exp1",
      title: "2025 Robot Challenge: SUMO",
      description: "SUMO 종목에 참가했다",
      sortOrder: 0
    },
    {
      id: "exp2",
      title: "2025 RoboCup Korea Open: CoSpace Rescue U12",
      description: "코스페이스 종목 참가, 리더로 활약, 팀명: K.F.C.sirius",
      sortOrder: 1
    },
    {
      id: "exp3",
      title: "2025 RoboCup Singapore Open: CoSpace Rescue U12",
      description: "코스페이스 종목 참가, 리더로 활약, 팀명: K.F.C.sirius",
      sortOrder: 2
    },
    {
      id: "exp4",
      title: "2026 RoboCup Korea Open: CoSpace Rescue U12",
      description: "코스페이스 종목 참가, 리더로 활약, 팀명: K.F.C.sirius",
      sortOrder: 3
    }
  ],
  skills: [
    { id: "skill1", name: "C CODING", iconName: "code", sortOrder: 0 },
    { id: "skill2", name: "MICRO PYTHON CODING", iconName: "terminal", sortOrder: 1 },
    { id: "skill3", name: "BLOCK CODING", iconName: "view_in_ar", sortOrder: 2 },
    { id: "skill4", name: "ROBOT BUILDING", iconName: "build", sortOrder: 3 },
    { id: "skill5", name: "PROBLEM SOLVING", iconName: "psychology", sortOrder: 4 },
    { id: "skill6", name: "TEAMWORK", iconName: "group", sortOrder: 5 },
    { id: "skill7", name: "PPT PRESENTATION", iconName: "co_present", sortOrder: 6 },
    { id: "skill8", name: "INSTRUCTION MAKING", iconName: "menu_book", sortOrder: 7 }
  ],
  awards: [
    {
      id: "award1",
      title: "2026 RoboCup Korea Open (CoSpace U12) : Super team 1st Place",
      category: "AWARD",
      sortOrder: 0
    }
  ],
  projects: [
    {
      id: "proj1",
      code: "SN-001",
      title: "Line Tracing Robot",
      description: "컬러 센서를 사용해 검은 선을 따라가는 로봇 프로젝트입니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDyVixFDKi0qYvEKJYfIaW0mi9QUpKk6hvVDmqIOrNhbotBqrWMgxtAvpuxvFBfIQrPy9krXQek6UK4skLJ0hjCwmiWfg2onUj9CzAEQ_KPZ2uDyL-aCChKAdhIpPASV-TmtSdYf5clZ8ElGepCqBFmLMEvqacQMS3pqvcGEasblKBlSZeOoY4JqSfha_kfoMezHgh0Ka2ddnNt9bGjaiIvgISFr7ZHgi4JiafrJxop_8FYWE0YkSajVSG9PiCmi_fUh4PmUN05HM",
      technologies: ["Color Sensor", "Motor Control", "Block Coding"],
      sortOrder: 0
    },
    {
      id: "proj2",
      code: "SN-002",
      title: "Sumo Robot",
      description: "상대 로봇을 감지하고 밀어내는 로봇 프로젝트입니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-UxH5eWEXoGavn-nEu8jeAqOZRreh0H9RcWI4Q2jrjcSHDx4ktGZyRjM13jKj5O0Z2Tnv1GaERsgeEDXV2sLIy-sjkve6P8v8Jl1rqX68zm4PkoLEluU51WsEG_d2BlMBMcc6RNh9V29hBO7byje2yRJNIomq0kb1hMXXgPmEZfYLL_Pn6hFYJiKGeQ2uKBTFg91KTR9VMNniYk7YPEeeE74v5eN6XTizq7CVikcVPBmJKykYWwbzmMr834jpoF1wQDMDIwnjOjw",
      technologies: ["Ultrasonic Sensor", "Motor Power", "Robot Design"],
      sortOrder: 1
    },
    {
      id: "proj3",
      code: "SN-003",
      title: "Mission Robot",
      description: "정해진 미션을 수행하기 위해 구조와 코드를 설계한 프로젝트입니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYHpVIytxsnAEL9SJg07EJj3ewxJxbAuD2p9sm7_RPmNgP9PSGVIMgGkHvys18CNNVFwe4CdumkPs9HrGy_YhgCVc0Md-ICP2FjGgS0vlUD8cERba2brRaIPwkkk2Tr2TKmOhSSc6hLIvIl2c-JmEcr9AlBIYUmDVX0tei6jWjAL92BDDPkYS_474xMzqF00I4hqm2yPHoeS1g1n0hharXTlt1pMR2z1NX_XQyWSIVSAdV6D-L11u7ggrKSBJlIdUV2hJfkGdD6I0",
      technologies: ["Mission Strategy", "Sensor Control", "Debugging"],
      sortOrder: 2
    },
    {
      id: "proj4",
      code: "APP-001",
      title: "Robot Portfolio Web App",
      description: "나의 로봇 프로젝트를 소개하기 위해 만든 웹앱입니다.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4DSULRVEFkJkBajmYQp475_tdV-tRhj2V7TLh46u3r0EnxdY0LZNdHepMXvyTAVnfFMeyW27Cg90RD1Xeuutl2OacGghp4lnuqZobS1dWXrlfi7Q2VvkEYgY_D-ceXyr8P5424eWjIlcoRoNBXtXaIbbGPPIEu8-SsLTq_I8Xck9hreuJY3Sq4_DisniXPDSC-g5d5smxhd1sKAlA1cdLJXah-HNMXHByXdtMz5Pxt0VmqB6qHIsA1TicYz8SlRkYWISJJwHKsDw",
      technologies: ["Web Design", "AI Tool", "Portfolio Design"],
      sortOrder: 3
    }
  ]
};
