# **일반적인 문제**

## **xcrun: error: invalid developer path**

이는 macOS에서만 발생하는 오류입니다. 하지만 쉽게 고칠 수 있습니다. 터미널에서 다음 스니펫을 실행하세요. `xcode-select --install` 예시는 #64를 참고하세요.

## **Error: spansSync git ENOENT/ Cannot run Git command**

플러그인이 Git 실행 파일을 찾지 못할 때 발생합니다. 플러그인은 PATH에서 Git 실행 파일을 가져옵니다. 사용하는 플랫폼에 모든 것이 올바르게 설치되었는지 확인하려면 [설치](https://publish.obsidian.md/git-doc/Installation)로 이동하세요.

모든 것이 올바르게 설정되었다고 생각하는데도 오류가 계속 발생하면 다음을 시도하세요.

Git이 어디에 설치되어 있는지 알고 있다면 설정의 "Custom Git binary path"에서 경로를 지정할 수 있습니다. Git이 어디에 설치되어 있는지 모른다면 터미널에서 다음을 실행해 찾아볼 수 있습니다.

**Windows**

터미널에서 `where git`을 실행하세요. Git 실행 파일의 경로를 반환해야 합니다. 실패하면 Git이 올바르게 설치되지 않은 것입니다.

**Linux/MacOS**

터미널에서 `which git`을 실행하세요. Git 실행 파일의 경로를 반환해야 합니다. 실패하면 Git이 올바르게 설치되지 않은 것입니다.

## **오류 없이 pull/push가 무한히 계속됨**

대부분 인증 문제로 인해 발생합니다. [인증](https://publish.obsidian.md/git-doc/Authentication)으로 이동하세요.

## **Bad owner or permissions on /home/<user>/.ssh/config**

터미널에서 `chmod 600 ~/.ssh/config`를 실행하세요.

## **`.gitignore`의 파일이 무시되지 않음**

플러그인은 네이티브 git 설치를 사용하므로, `.gitignore` 파일이 올바르게 작성되어 있고 git이 올바르게 사용된다면 모든 것이 작동해야 한다고 확신할 수 있습니다.

한 번 커밋되었거나 스테이징된 파일은 `.gitignore`를 변경해도 도움이 되지 않는다는 점이 중요합니다. 해당 파일을 올바르게 무시하려면 저장소에서 파일을 수동으로 삭제해야 합니다.

1. 터미널에서 `git rm --cached <file>`을 실행하세요. 파일은 파일 시스템에 남아 있습니다. 저장소에서만 삭제됩니다.
2. 해당 파일은 `git status`에서 삭제된 것으로 나열되어야 합니다.
3. 삭제를 커밋합니다.
4. 이제 해당 파일에 대한 모든 변경 사항이 올바르게 무시됩니다.

## **gpg를 실행할 수 없음**

`Error: error: cannot run gpg: No such file or directory
error: gpg failed to sign the data
fatal: failed to write commit object`

이를 해결하는 방법은 [다른 도구와의 연동 > GPG Signing](https://publish.obsidian.md/git-doc/Integration+with+other+tools#GPG%20Signing)을 보세요.

## **This repository is configured for Git LFS but 'git-lfs' was not found on your path.**

이를 해결하는 방법은 [다른 도구와의 연동 > Git Large File Storage](https://publish.obsidian.md/git-doc/Integration+with+other+tools#Git%20Large%20File%20Storage)를 보세요.
