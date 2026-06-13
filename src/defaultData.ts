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
    { 
      id: "skill1", 
      name: "C CODING", 
      iconName: "code", 
      description: "C 언어를 이용해 마이크로컨트롤러 제어 및 임베디드 코딩을 수행합니다. 고속 모터 구동 및 아날로그 센서 캘리브레션, 하드웨어 인터럽트 제어를 안정적으로 처리합니다.",
      sortOrder: 0 
    },
    { 
      id: "skill2", 
      name: "MICRO PYTHON CODING", 
      iconName: "terminal", 
      description: "RP2040, WebREPL 기반 환경에서 자율주행 봇 계측 제어 및 실시간 상태 정보를 피득하기 위해 통신 소켓 및 고도 센서 주파수 제어로 알고리즘을 설계합니다.",
      sortOrder: 1 
    },
    { 
      id: "skill3", 
      name: "BLOCK CODING", 
      iconName: "view_in_ar", 
      description: "엔트리, Scratch, EV3 자이로 컨트롤러 등 블록 기반 하이브리드 소프트웨어 설계에서 다중 이벤트 병렬 루프 제어 흐름과 제동 알고리즘을 안정적으로 구동합니다.",
      sortOrder: 2 
    },
    { 
      id: "skill4", 
      name: "ROBOT BUILDING", 
      iconName: "build", 
      description: "알루미늄 모듈러 프레임, 기어 어셈블리, 감속 장치 및 서보 마찰 계수를 종합 고려하여 역학적으로 견고하고 유격을 최소화한 로봇 하드웨어를 직접 기획, 조립합니다.",
      sortOrder: 3 
    },
    { 
      id: "skill5", 
      name: "PROBLEM SOLVING", 
      iconName: "psychology", 
      description: "현장 대회 환경별로 급변하는 불균일 광량(컬러센서 이탈) 및 전압 감쇠 하락 현상을 단계별 임계 상태 도해법과 고강도 필터링 알고리즘 수정 작업으로 극복합니다.",
      sortOrder: 4 
    },
    { 
      id: "skill6", 
      name: "TEAMWORK", 
      iconName: "group", 
      description: "다수의 국제/국내 월드컵 대회의 Sirius팀 리더 역량을 발휘하여 업무 할당 및 셋업 체크리스트 기획, 기수 간 교습을 통해 성과 시너지를 극대화합니다.",
      sortOrder: 5 
    },
    { 
      id: "skill7", 
      name: "PPT PRESENTATION", 
      iconName: "co_present", 
      description: "메커니즘 핵심 설계안과 센서 분해 성능 지표를 가파르게 이해시키는 3D 다이어그램, 순서도 중심의 프리젠테이션 자료를 구성하여 뛰어난 피칭 능력을 발휘합니다.",
      sortOrder: 6 
    },
    { 
      id: "skill8", 
      name: "INSTRUCTION MAKING", 
      iconName: "menu_book", 
      description: "신규 구동 플랫폼 조립 및 미션 훈련 시, 팀원 누구나 한눈에 쉽게 체득할 수 있도록 포트 주소 매핑 및 자인어 보정 매뉴얼, 비상 복구 체크리스트를 체계화합니다.",
      sortOrder: 7 
    }
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
