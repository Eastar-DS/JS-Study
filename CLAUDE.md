# CLAUDE.md

이 레포에서 Claude Code가 작업할 때 따라야 할 규칙.

## 이 레포의 정체

- 프론트엔드/CS 학습 노트 모음 (이스타의 개인 학습 vault)
- **Obsidian Vault** + Git 동시 사용 (`.obsidian/` 존재)
- 진입점: [[000-Index/MAIN.md]]

## 폴더 구조

| 폴더 | 역할 |
|---|---|
| `000-Index/` | 통합 MOC. vault 진입점, 횡단 큐레이션 |
| `099-Archive/` | 아카이브 (옛 통합 일지 등) |
| `100-JavaScript/` | JS 언어/런타임 |
| `200-TypeScript/` | TS |
| `300-React/` | React |
| `400-CS/` | 네트워크, 브라우저, 자료구조 등 |

## 명명 규칙

- **카테고리 폴더**: `<백단위>-<이름>` (예: `100-JavaScript`)
- **세부영역 폴더**: `<카테고리 첫자리><일련번호>-<주제>` (예: `101-이벤트루프`, `402-브라우저-렌더링`)
- **노트 파일**: `<순서>-<주제>.md` (예: `01-스레드.md`) 또는 prefix 없음
- 공백 대신 하이픈, 한글 우선 (영문 용어는 그대로)

## 노트 작성 규칙

- **위키링크** `[[파일명]]` 사용 (옵시디언 친화). 마크다운 링크는 외부 URL에만
- frontmatter는 **강제하지 않음**. 필요할 때만 추가
- 학습 노트 구성: "왜 필요한가 → 동작 → 예시" 순서
  - 자세한 학습 안내 스타일은 `.claude/rules/teaching-style.md` 참조 (PiFSR 5원칙: Problem-Driven, i+1, Feedback Loop, Structural Thinking, Resourceful)
- 코드 블록엔 언어 명시 (` ```js `, ` ```ts ` 등)

## 학습 일지 (log.md)

- 각 카테고리에 `log.md`. 시간 역순(최신이 위)으로 세션 기록
- 옛 통합 일지는 `099-Archive/study-log.md`. 더 이상 추가하지 않음

## 신규 추가 절차

| 추가 대상 | 함께 업데이트할 곳 |
|---|---|
| 노트 1개 | 해당 폴더 README의 링크 목록 |
| 세부영역 폴더 | 카테고리 README + 필요시 `000-Index/MAIN.md` |
| 카테고리 | `000-Index/MAIN.md` + 루트 `README.md` |

## 절대 하지 말 것

- 사용자 명시 요청 없이 `git commit` / `git push`
- 노트에 frontmatter 강제 삽입
- 위키링크 `[[]]` 를 마크다운 링크로 임의 변환
- 옛 노트 파일명에 prefix 강제 (이미 있는 노트는 그대로 둠)
- `.obsidian/` 내부 설정 파일 임의 수정

## 학습 스킬 (study / understand / makestudylog)

- 모두 `.claude/rules/teaching-style.md`의 PiFSR 5원칙을 따른다
- 학습자는 "이스타"로 고정
- 한 번에 하나의 개념만, 정답 코드는 먼저 주지 않음 (Output First — 학습자가 먼저 시도)
- **study**: 학습 진행 중 만든 개념 노트는 `{카테고리}/{세부영역}/<노트>.md`로 저장 (카테고리는 1회 확인)
- **understand**: 사전 이해도 진단 → study로 자연스럽게 연결
- **makestudylog**: 카테고리 선택 후 `{카테고리}/log.md`에 학습 로그 append. AI 피드백은 항상 1개만 생성 (Anders Ericsson 멘탈 모델)
- 외부 자료(책·영상·사람) 안내는 하지 않는다 (AI 단독 학습)

## 파일 인코딩 / 명명 주의

- 파일명에 한글 사용 OK (이미 다수)
- 띄어쓰기 대신 하이픈
- 괄호 `()` 사용 자제 (CLI/위키링크에서 이스케이프 필요)
