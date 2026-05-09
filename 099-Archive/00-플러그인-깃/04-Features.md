# **기능**

## **소스 제어 보기(Source Control View)**

"Open source control view" 명령을 사용해 엽니다. `git status`를 실행했을 때처럼 현재의 모든 변경 사항을 나열합니다. 다음 기능을 제공합니다.

- 개별 파일 스테이징/스테이징 해제(Stage/Unstage)
- 특정 파일의 모든 변경 사항 폐기
- 변경된 파일의 diff 보기 열기
- 모든 파일 스테이징/스테이징 해제
- Push/Pull
- Commit 또는 [commit-and-sync](https://publish.obsidian.md/git-doc/Start+here#commit-and-sync)
- 상단의 버튼을 사용해 목록 보기와 트리 보기 사이 전환

## **히스토리 보기(History View)**

"Open history view" 명령을 사용해 엽니다. `git log`처럼 동작하여 최근 커밋 목록을 보여줍니다. 각 커밋 항목을 펼쳐 해당 커밋에서 변경된 파일을 볼 수 있습니다. 파일을 클릭하면 diff도 볼 수 있습니다.

## **라인 작성자 표시(Line Authoring)**

각 줄이 마지막으로 수정된 시점을 봅니다: [Line Authoring](https://publish.obsidian.md/git-doc/Line+Authoring). 기술적으로는 `git-blame`으로 알려져 있습니다.

## **자동 commit-and-sync**

용어 설명은 [commit-and-sync](https://publish.obsidian.md/git-doc/Start+here#commit-and-sync)를 보세요. 자동 commit-and-sync의 목표는 이 플러그인이 작업 저장을 처리해주므로, 사용자가 저장을 신경 쓰지 않고 노트 작성에 집중할 수 있게 하는 것입니다.

자동 commit-and-sync를 트리거하는 방법은 여러 가지가 있습니다. 기본값은 X분마다 commit-and-sync를 실행하는 기본 간격입니다. 이를 위해 "Auto commit-and-sync interval" 설정을 사용하세요. 이 간격은 Obsidian 세션을 가로질러 동작하므로, Obsidian을 짧은 시간만 열어도 commit-and-sync 실행이 막히지 않습니다. 예를 들어 15분 간격을 설정했다면 Obsidian을 15분 동안 계속 열어둘 필요가 없습니다. 간격이 끝나기 전에 Obsidian을 닫으면, 다음에 Obsidian을 시작할 때 commit-and-sync가 자동으로 실행됩니다.

또 다른 방법은 "Auto commit-and-sync after stopping file edits"를 활성화하는 것입니다. 이는 마지막 변경 후 X분을 기다린 다음 commit-and-sync를 수행합니다. 타이핑하는 동안 커밋으로 방해받고 싶지 않을 때 유용합니다.

마지막 모드는 "Auto commit-and-sync after latest commit" 설정입니다. 이 설정은 마지막 commit-and-sync 타임스탬프를 최신 커밋으로 설정합니다. 기본적으로 플러그인은 자체적으로 마지막에 실행한 commit-and-sync와만 비교합니다. 따라서 수동으로 커밋한 뒤 commit-and-sync 타이머를 재설정하고 싶다면 이 설정을 활성화하세요.

## **커밋 메시지**

플러그인은 날짜 형식 지정에 [momentjs](https://momentjs.com/)를 사용하므로, 날짜 플레이스홀더를 구성하는 방법은 해당 문서를 읽어보세요.

## **서브모듈 지원(Submodules Support)**

버전 1.10.0부터 서브모듈이 지원됩니다. 새 서브모듈을 추가/클론하는 것은 아직 지원되지 않지만(나중에 추가될 수 있음), 알려진 "Commit-and-sync"와 "Pull" 명령에서 기존 서브모듈을 업데이트하는 것은 지원됩니다. 이는 재귀적으로도 작동합니다. "Commit-and-sync"는 모든 서브모듈의 모든 변경 사항을 추가, 커밋, push(켜져 있는 경우)하게 됩니다. 이 기능은 설정에서 켜야 합니다.

추가 **요구 사항**:

- 체크아웃된 브랜치(`git submodule update --init`을 실행했을 때처럼 단순 커밋이 아닌 상태)
- `git push`가 작동하도록 추적 브랜치가 설정되어 있음
- 해당 브랜치와 `git diff`가 작동하도록 추적 브랜치를 fetch해야 함
