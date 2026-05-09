# **설치**

**중요**

플러그인 자체는 데스크톱 플랫폼에 독립적이지만, Obsidian이나 Git을 잘못 설치하면 플러그인이 제대로 작동하지 않을 수 있습니다.

## **플러그인 설치**

**Obsidian 내부에서 설치**

"Settings" -> "Community plugins" -> "Browse"로 이동한 뒤, "Git"을 검색하고 설치한 다음 활성화하세요.

**수동 설치**

1. [최신 릴리스](https://github.com/Vinzent03/obsidian-git/releases/latest)에서 `obsidian-git-<latest-version>.zip`을 다운로드합니다.
2. zip 파일을 `<vault>/.obsidian/plugins/obsidian-git`에 풉니다.
3. Obsidian을 다시 시작합니다.
4. 설정으로 이동해 제한 모드를 비활성화합니다.
5. `Git`을 활성화합니다.

# **Windows**

[GitHub Desktop](https://github.com/apps/desktop)을 설치하는 것만으로는 **충분하지 않습니다**! 일반 Git도 설치해야 합니다.

## **Git 설치**

**정보**

Git 2.29 이상을 사용하고 있는지 확인하세요.

공식 [웹사이트](https://git-scm.com/download/win)에서 모든 기본 설정으로 Git을 설치하세요.

`3rd-party software` 접근이 활성화되어 있는지 확인하세요.

![third-party-windows-git.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/third-party-windows-git.png)

Git Credential Manager를 활성화하세요. 기존 설치에서 다음을 실행하여 확인할 수 있습니다. `manager`가 출력되어야 합니다.

`git config credential.helper`

![credential-manager-windows-git.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/credential-manager-windows-git.png)

# **Linux**

## **Obsidian 설치**

알려진 **지원되는** Obsidian 설치 방법:

- AppImage

알려진 **완전히 지원되지 않는** 패키지 관리자

- Snap (Snap은 Obsidian을 일종의 샌드박스에 넣기 때문에 Obsidian이 Git에 접근할 수 없습니다)
- [Flatpak](https://flathub.org/apps/details/md.obsidian.Obsidian)은 Git에 접근할 수 있지만 모든 시스템 파일에 접근할 수는 없으므로 권장하지 않습니다.

예전에 **Flatpak**으로 Obsidian을 설치했고 작동하지 않는다면, 다음 스니펫을 실행하세요.

`$ flatpak update md.obsidian.Obsidian
$ flatpak override --reset md.obsidian.Obsidian
$ flatpak run md.obsidian.Obsidian`

[이 스니펫의 출처](https://github.com/flathub/md.obsidian.Obsidian/issues/5#issuecomment-736974662)

# **MacOS**

## **Git 설치**

Mac 컴퓨터에 `git`을 설치하려면 [공식 Git 문서](https://git-scm.com/install/mac)에 설명된 적절한 방법을 따르세요.

## **키체인(Keychain)**

자격 증명을 저장하기 위해 macOS 키체인을 사용하려면 다음을 실행하세요.

`git config --global credential.helper osxkeychain`

**정보**

터미널에서 헬퍼를 설정한 뒤 **인증이 필요한 작업 하나**(clone, pull 또는 push 중 하나)를 완료해야 합니다. 완료한 뒤에는 문제없이 Obsidian을 동기화할 수 있어야 합니다.
