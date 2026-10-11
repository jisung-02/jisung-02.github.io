export const projects = [
  {
    name: 'agentworkflow',
    period: '2026.09',
    description: 'YAML 상태 전이와 SQLite 실행 이력을 사용하는 로컬 워크플로 엔진. 실행·중단·재개와 사람의 응답 대기를 다룹니다.',
    stack: 'Python · SQLite · YAML',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/jisung-02/agentworkflow' }],
  },
  {
    name: 'SIP Mutation Fuzzer',
    period: '2025 — 2026',
    description: 'VoLTE/IMS 환경에서 SIP 메시지를 변형해 단말의 취약점을 탐지하는 퍼징 시스템',
    stack: 'Python · SIP/IMS · Open5GS · srsRAN · Kamailio',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/jisung-02/sip-mutation-fuzzer' }],
  },
  {
    name: 'RCP — Return Cloud Platform',
    period: '2025.12 — 현재',
    description: '동아리 구성원을 위한 OpenStack 기반 사설 클라우드 플랫폼',
    stack: 'Go · Gin · ent · OpenStack · systemd · GitHub Actions',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/KHU-RETURN/rcp-server' }],
  },
  {
    name: 'NUVO',
    period: '2025',
    description: '전화 상황을 연습하는 AI 통화 트레이닝 서비스',
    stack: 'Python · gRPC · LangGraph · Kotlin/Spring · Elixir · STT/TTS',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/orgs/ArtisticSW-2025/repositories' }],
  },
  {
    name: 'Aether',
    period: '2025',
    description: 'Gleam으로 작성한 서버 프레임워크와 학습용 네트워킹 스택',
    stack: 'Gleam · Erlang/BEAM · TCP/UDP · HTTP',
    links: [{ label: 'GitHub ↗', href: 'https://github.com/jisung-02/aether' }],
  },
  {
    name: '경희대학교 NLP Lab 홈페이지',
    period: '2026',
    description: '연구실 구성원·논문·소식을 소개하고, 관리자 화면에서 콘텐츠를 편집할 수 있는 웹사이트입니다. 웹 지식이 없는 AI 연구자들이 쉽게 유지보수할 수 있도록 Python 기반 스택과 간결한 구성을 채택했습니다.',
    stack: 'Python · FastAPI · Jinja2 · SQLModel · SQLite',
    links: [
      { label: '홈페이지 ↗', href: 'https://nlp.khu.ac.kr/' },
      { label: 'GitHub ↗', href: 'https://github.com/jisung-02/nlp-lab' },
    ],
  },
  {
    name: '사랑에 은퇴란 없다',
    period: '2024.10 — 2024.11',
    description: '경희대학교 시각디자인학과 졸업프로젝트로, 체레미마카와 함께한 중장년층 사랑 인식 개선 캠페인의 인터랙티브 전시입니다. 삐삐 숫자 메시지를 입력하고 해석하는 웹 체험을 구현했습니다.',
    stack: 'React · Redux · JavaScript',
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/jisung-02/LNR' },
      { label: '체레미마카 소개 글 ↗', href: 'https://cheremimaka.com/article/blog/8/36923/' },
    ],
  },
];

export const skills = [
  { label: '주로 사용', items: 'Go · Python · Django/DRF · Linux · Docker' },
  { label: '프로젝트', items: 'FastAPI · Spring · TypeScript · OpenStack · GitHub Actions' },
  { label: '데이터', items: 'PostgreSQL · Redis · MongoDB · Elasticsearch' },
  { label: '네트워크', items: 'TCP · WebSocket · gRPC · SIP/IMS' },
  { label: '연구·실험', items: 'Open5GS · srsRAN · Kamailio · Elixir · Gleam · WebAssembly' },
];
