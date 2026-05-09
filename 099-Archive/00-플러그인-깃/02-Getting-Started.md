# **시작하기**

# **데스크톱**

[여기](https://publish.obsidian.md/git-doc/Getting+Started#For%20existing%20remote%20repository)에 설명된 것처럼 기존 원격 저장소를 클론하여 시작할 수도 있고, [여기](https://publish.obsidian.md/git-doc/Getting+Started#Create%20new%20local%20repository)에 설명된 것처럼 로컬에서 새 저장소를 초기화한 뒤 선택적으로 원격 저장소에 push하여 시작할 수도 있습니다.

## **새 로컬 저장소 만들기**

1. 운영 체제에 맞는 [설치](https://publish.obsidian.md/git-doc/Installation) 지침을 따릅니다.
2. `Initialize a new repo` 명령을 호출합니다.
3. 몇 개의 파일을 만들고 `Commit all changes with specific message` 명령을 호출하여 첫 커밋을 만듭니다.
4. GitHub 같은 원격 저장소로 push하도록 설정하고 싶다면:
    1. [인증](https://publish.obsidian.md/git-doc/Authentication)을 설정합니다.
    2. 원격 저장소가 비어 있는지 확인합니다. 그렇지 않다면 저장소를 삭제하고 대신 [다음 섹션](https://publish.obsidian.md/git-doc/Getting+Started#For%20existing%20remote%20repository)에 설명된 것처럼 원격 저장소를 클론하세요.
    3. `Push` 명령을 호출합니다. 원격 저장소의 이름과 URL을 묻는 메시지가 표시될 것입니다. 원격 이름에는 `origin`을 입력하고, 원격 git 서비스 어딘가에서 push할 URL을 복사해 넣으면 됩니다.

## **기존 원격 저장소가 있는 경우**

클론하려면 원격 URL을 사용해야 합니다. 이는 `https` 또는 `ssh` 두 프로토콜 중 하나일 수 있습니다. 이는 선택한 [인증](https://publish.obsidian.md/git-doc/Authentication) 방식에 따라 달라집니다.

`https`: `https://github.com/<username>/<repo>.git`

`ssh`: `git@github.com:<username>/<repo>.git`

1. 운영 체제에 맞는 [설치](https://publish.obsidian.md/git-doc/Installation) 지침을 따릅니다.
2. [인증](https://publish.obsidian.md/git-doc/Authentication)을 설정합니다.
3. Git은 새 폴더에만 원격 저장소를 클론할 수 있습니다. 따라서 두 가지 선택지가 있습니다.
    - "Clone an exising remote repository" 명령을 사용해 저장소를 볼트의 하위 폴더에 클론합니다. 그런 다음 다시 두 가지 선택지가 있습니다.
        - 새 폴더의 모든 파일(`.git` 포함!)을 볼트 루트로 옮깁니다.
        - 새 하위 폴더를 새 볼트로 엽니다. 플러그인을 다시 설치해야 할 수도 있습니다.
    - 볼트를 두고 싶은 위치에서 명령줄에 `git clone <your-remote-url>`을 실행합니다.
4. [.gitignore](https://publish.obsidian.md/git-doc/Tips-and-Tricks#Gitignore)를 가장 잘 설정하는 방법을 읽어보세요.

**iCloud와 Git**

볼트를 iCloud와 동기화하고 데스크톱 기기에서 Git을 사용하면 전체 `.git` 디렉터리도 모바일 기기로 동기화됩니다. 이로 인해 Obsidian 시작 시간이 느려질 수 있습니다.

- 한 가지 해결책은 git 저장소를 Obsidian 볼트 상위에 두는 것입니다. 즉, 볼트가 git 저장소의 하위 디렉터리가 되도록 하는 것입니다.
- 또 다른 해결책은 `.git` 디렉터리를 다른 위치로 옮기고 볼트 안에 다음 한 줄만 포함하는 `.git` 파일을 만드는 것입니다: `gitdir: <path-to-your-actual-git-direcotry>`

# **모바일**

모바일의 Git 구현은 **매우 불안정합니다**! 모바일에서 이 플러그인을 사용하는 것은 권장하지 않으며, 다른 동기화 서비스를 시도해보는 것을 권합니다.

그러한 대안 중 하나는 Android와 iOS 모두에서 사용할 수 있는 [GitSync](https://github.com/ViscousPot/GitSync)입니다. 이 플러그인과 관련은 없지만 모바일 사용자에게 더 나은 선택지일 수 있습니다. 설정 튜토리얼은 [여기](https://viscouspotenti.al/posts/gitsync-all-devices-tutorial)에서 찾을 수 있습니다.

iOS의 또 다른 대안은 [Working Copy](https://workingcopy.app/)입니다.

## **제한 사항**

Android나 iOS에서는 네이티브 Git을 사용할 수 없기 때문에, 저는 JavaScript로 Git을 다시 구현한 [isomorphic-git](https://isomorphic-git.org/)을 사용하고 있습니다.

- SSH 인증은 지원되지 않습니다([isomorphic-git issue](https://github.com/isomorphic-git/isomorphic-git/issues/231)).
- 메모리 제한 때문에 저장소 크기가 제한됩니다.
- Rebase 병합 전략은 지원되지 않습니다.
- 서브모듈은 지원되지 않습니다.

## **모바일에서의 성능**

**경고**

기기와 사용 가능한 여유 RAM에 따라 Obsidian은 다음과 같은 문제가 생길 수 있습니다.

- clone/pull 중 충돌
- 버퍼 오버플로 오류 생성
- 무기한 실행

이는 모바일의 기반 git 구현이 효율적이지 않기 때문에 발생합니다. 저는 이 문제를 해결하는 방법을 모릅니다. 여러분에게 이런 상황이 해당된다면, 이 플러그인은 여러분에게 작동하지 않을 것임을 인정해야 합니다. 따라서 어떤 이슈에 댓글을 달거나 새 이슈를 만들어도 도움이 되지 않습니다. 죄송합니다.

## **기존 원격 저장소로 시작하기**

**플러그인을 통한 클론**

이미 원격 git 저장소에 백업되어 있는 Obsidian 볼트를 모바일 기기에 설정하려면 이 지침을 따르세요.

이 지침은 [GitHub](https://github.com/)를 사용한다고 가정하지만, 다른 제공자에도 확장하여 적용할 수 있습니다.

1. 모든 기기에서 남아 있는 변경 사항이 원격 저장소에 push되고 조정되었는지 확인합니다.
2. Android 또는 iOS용 Obsidian을 설치합니다.
3. 새 볼트를 만듭니다(또는 Obsidian이 빈 디렉터리를 가리키게 합니다). iOS를 사용 중이라면 `Store in iCloud`를 선택하지 마세요.
4. 저장소가 GitHub에 호스팅되어 있다면 [인증은 개인 액세스 토큰으로 해야 합니다](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/). 해당 과정에 대한 자세한 지침은 [여기](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)에서 찾을 수 있습니다.
    - 필요한 최소 권한은 다음과 같습니다.
        - "Read access to metadata"
        - "Read and Write access to contents and commit status"
5. Obsidian 설정에서 커뮤니티 플러그인을 활성화합니다. 플러그인을 둘러보고 Git을 설치합니다.
6. Git을 활성화합니다(같은 화면에서).
7. Git 플러그인의 Options로 이동합니다(기본 설정 페이지 하단, Community Plugins 섹션 아래).
8. "Authentication/Commit Author" 섹션에서 git 서버의 사용자 이름과 비밀번호/개인 액세스 토큰을 입력합니다.
9. "Advanced" 아래의 어떤 설정도 건드리지 마세요.
10. 플러그인 설정을 나가고 명령 팔레트를 연 뒤, "Git: Clone existing remote repo"를 선택합니다.
11. 텍스트 필드에 저장소 URL을 입력하고 그 아래의 저장소 URL 버튼을 누릅니다. 저장소 URL은 브라우저의 URL이 아닙니다. `.git`을 붙여야 합니다. - `https://github.com/<username>/<repo>.git`
    - 예: `https://github.com/denolehov/obsidian-git.git`
12. 지침에 따라 저장소를 둘 폴더와 `.obsidian` 디렉터리가 이미 존재하는지 여부를 결정합니다.
13. 클론이 시작되어야 합니다. 팝업 알림(비활성화하지 않은 경우)이 진행 상황을 표시합니다. "Restart Obsidian"을 요청하는 팝업이 나타날 때까지 종료하지 마세요.

**iOS에서 Working Copy를 통한 클론**

저장소 크기와 기기에 따라 플러그인을 통한 클론 중 Obsidian이 충돌할 수 있습니다. 대안으로 초기 클론을 [Working Copy](https://workingcopy.app/)를 통해 수행할 수 있습니다. 이는 유료 앱이라는 점에 유의하세요. 일반적인 commit-and-sync는 그 후 플러그인을 통해 수행할 수 있습니다. 다음 가이드는 `.obsidian` 디렉터리를 커밋하지 않는다고 가정합니다.

1. 모든 기기에서 남아 있는 변경 사항이 원격 저장소에 push되고 조정되었는지 확인합니다.
2. Android 또는 iOS용 Obsidian을 설치합니다.
3. 새 볼트를 만듭니다(또는 Obsidian이 빈 디렉터리를 가리키게 합니다). iOS를 사용 중이라면 `Store in iCloud`를 선택하지 마세요.
4. 저장소가 GitHub에 호스팅되어 있다면 [인증은 개인 액세스 토큰으로 해야 합니다](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/). 해당 과정에 대한 자세한 지침은 [여기](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)에서 찾을 수 있습니다.
    - 필요한 최소 권한은 다음과 같습니다.
        - "Read access to metadata"
        - "Read and Write access to contents and commit status"
5. Obsidian을 위로 쓸어 올려 완전히 닫습니다. Working Copy 앱을 엽니다.
6. Working Copy를 사용해 저장소를 클론합니다. Working Copy 인터페이스를 통해 GitHub에 로그인하는 대신, 클론 URL을 직접 입력합니다. 그런 다음 사용자 이름을 입력하고, 비밀번호에는 개인 액세스 토큰을 입력합니다.
7. Files 앱을 엽니다.
8. Working Copy에서 저장소를 복사합니다. Obsidian에서 볼트를 삭제하고 그곳에 저장소를 붙여넣습니다(저장소는 볼트와 같은 이름입니다).
9. Obsidian을 엽니다.
10. 클론된 모든 파일이 보여야 합니다.
11. Git 플러그인을 설치하고 활성화합니다.
12. 플러그인 설정의 "Authentication/Commit Author" 섹션에 이름/이메일을 추가합니다.
13. 명령 팔레트를 사용해 "Pull" 명령을 호출합니다.

## **새 저장소로 시작하기**

[기존 저장소](https://publish.obsidian.md/git-doc/Getting+Started#existing-repo)와 비슷한 단계이지만, `Initialize a new repo` 명령을 사용한 뒤 `Edit remotes`를 사용해 추적할 원격 저장소를 추가합니다. 이 원격 저장소는 존재해야 하며 비어 있어야 합니다. 또한 [.gitignore](https://publish.obsidian.md/git-doc/Tips-and-Tricks#Gitignore)를 가장 잘 설정하는 방법도 반드시 읽어보세요.
