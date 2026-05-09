# **다른 도구와의 연동**

설치 가능한 다른 도구와의 연동에서 발생하는 대부분의 문제는 해당 도구의 설치 경로가 `PATH` 환경 변수에 추가되어 있지 않기 때문입니다. `PATH` 환경 변수에는 실행 프로그램을 찾을 디렉터리들이 들어 있습니다. 터미널에서는 도구 실행에 문제가 없을 수 있습니다. `.bashrc`, `.zshrc`에서 `PATH`를 수정했기 때문입니다. 하지만 이 파일들은 셸에만 적용되고 Obsidian 같은 데스크톱 애플리케이션에는 적용되지 않습니다. 그래서 일부 설치 디렉터리가 `PATH`에 빠져 있고, 플러그인이 이를 찾지 못합니다.

# **Git Large File Storage**

Git Large File Storage는 지원되지만, 플러그인이 `git-lfs` 실행 파일을 찾으려면 약간의 설정이 필요할 수 있습니다.

## **MacOS**

1. `brew install git-lfs`를 사용해 [git-lfs](https://git-lfs.com/)를 설치했는지 확인하세요.
    - 이렇게 하면 `git-lfs`가 `/opt/homebrew/bin/`에 설치되는데, Obsidian을 사용할 때 이 경로가 `PATH` 환경 변수에 없을 가능성이 큽니다.
2. Obsidian에서 `/opt/homebrew/bin/`을 사용할 수 있게 하려면 "Advanced" 아래의 "Additional PATH environment variables paths" 설정에 `/opt/homebrew/bin/`을 추가하세요.
3. Obsidian을 다시 시작하세요.

## **Linux**

1. [git-lfs](https://git-lfs.com/)가 설치되어 있는지 확인하세요.
    - `git-lfs`가 설치되는 위치는 패키지 관리자와 배포판에 따라 다릅니다. 일반적으로는 이를 `PATH`에 수동으로 추가할 필요가 없지만, 플러그인이 `git-lfs`를 찾지 못한다면 다음 단계를 따르세요.
2. 설치 경로를 얻기 위해 터미널에서 `which git-lfs`를 실행하세요. `/git-lfs` 형태의 무언가가 출력되어야 합니다.
3. 이전 단계의 `<some-path>` 부분을 "Advanced" 아래의 "Additional PATH environment variables paths" 설정에 추가하세요.
4. Obsidian을 다시 시작하세요.

## **Windows**

git-lfs는 Git for Windows와 함께 설치되며 Git을 사용할 수 있다면 git-lfs도 사용할 수 있어야 하므로, 플러그인을 위해 변경할 것은 없습니다.

# **GPG 서명(GPG Signing)**

GitHub는 Obsidian에서도 작동할 훌륭한 [GPG 문서](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)를 제공합니다.

다만 다음과 같은 문제가 발생할 수 있습니다.

`Error: error: cannot run gpg: No such file or directory
error: gpg failed to sign the data
fatal: failed to write commit object`

이는 `PATH`에 `gpg` 바이너리가 없다는 뜻입니다. 셸에 대해서만 제대로 설정했을 수 있습니다. 하지만 Obsidian은 다른 방식으로 시작되므로, 이러한 PATH 수정 사항이 Obsidian에는 영향을 주지 않습니다. `gpg` 설치의 바이너리 경로를 얻으려면 Linux와 Mac-OS에서는 `which gpg`, Windows에서는 `where gpg`를 실행하세요. 일반적인 위치는 `/usr/local/bin/gpg`일 수 있습니다.

- 플러그인 설치에만 gpg 바이너리를 제공하려면 해당 경로를 "Additional PATH environment variables" 플러그인 설정에 추가할 수 있습니다.
- 또는 모든 git 저장소에 대해 gpg 바이너리를 전역으로 설정하려면 `git config --global gpg.program <your previous output>`을 통해 Git config에 설정할 수 있습니다.

문제가 발생하고 문서 개선이 필요하다면 이슈를 만들어 주세요.
