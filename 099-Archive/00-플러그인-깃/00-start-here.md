# **여기서 시작하기**

# **Git 플러그인 문서**

## **주제**

- [설치](https://publish.obsidian.md/git-doc/Installation)
- [시작하기](https://publish.obsidian.md/git-doc/Getting+Started)
- [인증](https://publish.obsidian.md/git-doc/Authentication)
- [다른 도구와의 연동](https://publish.obsidian.md/git-doc/Integration+with+other+tools)
- [기능](https://publish.obsidian.md/git-doc/Features)
- [팁과 요령](https://publish.obsidian.md/git-doc/Tips-and-Tricks)
- [일반적인 문제](https://publish.obsidian.md/git-doc/Common+issues)
- [라인 작성자 표시](https://publish.obsidian.md/git-doc/Line+Authoring)

**Linux에서 Obsidian 설치**

Linux에서 Obsidian을 설치할 때 Flatpak이나 Snap을 사용하지 마세요. 자세한 내용은 [여기](https://publish.obsidian.md/git-doc/Installation#Linux)에서 확인하세요.

## **모바일에서의 성능**

**경고**

기기와 사용 가능한 여유 RAM에 따라 Obsidian은 다음과 같은 문제가 생길 수 있습니다.

- clone/pull 중 충돌
- 버퍼 오버플로 오류 생성
- 무기한 실행

이는 모바일의 기반 git 구현이 효율적이지 않기 때문에 발생합니다. 저는 이 문제를 해결하는 방법을 모릅니다. 여러분에게 이런 상황이 해당된다면, 이 플러그인은 여러분에게 작동하지 않을 것임을 인정해야 합니다. 따라서 어떤 이슈에 댓글을 달거나 새 이슈를 만들어도 도움이 되지 않습니다. 죄송합니다.

## **Git이란 무엇인가요?**

Git은 버전 관리 시스템입니다. 노트의 변경 사항을 추적하고 이전 버전으로 되돌릴 수 있게 해줍니다. 또한 같은 파일에서 다른 사람들과 협업할 수 있게 해줍니다. Git에 대한 자세한 내용은 [여기](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)에서 읽을 수 있습니다.

**Git/GitHub는 동기화 서비스가 아닙니다!**

Git은 변경 사항을 클라우드나 다른 사람에게 실시간으로 공유하기 위한 것이 아닙니다. 즉, 같은 노트에서 누군가와 실시간으로 작업하는 데 사용해서는 안 됩니다. 하지만 비동기 협업에는 완벽합니다.

여러 변경 사항을 커밋(commit)으로 묶어 히스토리를 만듭니다. 그런 다음 이것들을 되돌리거나 체크아웃할 수 있습니다. Version History Diff 플러그인을 통해 노트 버전 간의 차이를 볼 수 있습니다.

Git 자체는 로컬 저장소만 관리합니다. 온라인 원격 저장소와 함께 사용할 때 정말 유용해집니다. 원격 저장소로 커밋을 push하거나 원격 저장소에서 pull하여 볼트를 공유하거나 백업할 수 있습니다. 가장 인기 있는 제공자는 [GitHub](https://github.com/)입니다.

Git은 주로 개발자가 사용하므로 때로는 명령줄이 필요합니다. Obsidian-Git은 항상 명령줄을 사용하거나 Obsidian을 떠나지 않고도 Obsidian 안에서 Git을 사용할 수 있게 해주는 Obsidian 플러그인입니다.

## **용어와 개념**

**백업(Backup) - 더 이상 사용되지 않음**

단순화를 위해 "Backup"이라는 용어는 모든 것을 스테이징(staging) -> 커밋(committing) -> pull -> push 하는 것을 의미합니다.

**동기화(Sync)**

동기화는 원격 저장소에서 변경 사항을 pull하고 원격 저장소로 변경 사항을 push하는 과정입니다. 이는 로컬 저장소를 예를 들어 GitHub의 원격 저장소와 최신 상태로 유지하기 위해 수행됩니다.

**커밋 후 동기화(Commit-and-sync)**

Commit-and-sync는 모든 것을 스테이징(staging) -> 커밋(committing) -> pull -> push 하는 과정입니다. 이상적으로는 로컬 저장소와 원격 저장소를 동기화 상태로 유지하기 위해 정기적으로 수행하는 하나의 작업입니다. 플러그인 설정에서 X분마다 자동으로 실행되도록 설정하는 것을 권장합니다. 플러그인 설정의 "Commit-and-sync" 섹션에서 pull 또는 push 부분을 비활성화할 수도 있습니다. 이렇게 하면 "commit-and-sync" 작업이 "commit and pull", "commit and push" 또는 단순 commit 작업으로 축소됩니다.
