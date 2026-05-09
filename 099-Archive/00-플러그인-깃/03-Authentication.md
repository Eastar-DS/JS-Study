인증
macOS
HTTPS
자격 증명을 저장하기 위해 macOS 키체인을 사용하려면 다음을 실행하세요.

git config --global credential.helper osxkeychain
터미널에서 헬퍼를 설정한 뒤 인증 작업(clone/pull/push) 하나를 수행해야 합니다. 그 후에는 Obsidian에서 문제없이 clone/pull/push를 할 수 있어야 합니다.

SSH
ssh-agent에 SSH 키를 추가하는 것처럼 ssh를 올바르게 설정해야 한다는 점을 기억하세요. GitHub는 새 SSH 키를 생성하는 방법과 SSH 키를 ssh-agent에 추가하는 방법에 대한 훌륭한 문서를 제공합니다.

Windows
HTTPS
Git 2.29 이상을 사용하고 있으며 Git Credential Manager를 자격 증명 헬퍼로 사용하고 있는지 확인하세요.
터미널에서 다음 스니펫을 실행해 이를 확인할 수 있습니다. 가능하면 볼트/저장소가 위치한 디렉터리에서 실행하세요. `manager`가 출력되어야 합니다.

git config credential.helper
이 명령이 `manager`를 출력하지 않으면 `git config set credential.helper manager`를 실행하세요.
push/pull/clone 같은 인증 명령을 아무거나 실행하면 로그인할 수 있는 팝업 창이 나타나야 합니다.

또는 해당 설정을 비워두고 Obsidian에서 표시되는 모달을 통해 사용자 이름과 비밀번호를 항상 수동으로 제공할 수도 있습니다. 사용 가능한 모든 자격 증명 헬퍼는 여기에 나열되어 있습니다.

SSH
ssh-agent에 SSH 키를 추가하는 것처럼 ssh를 올바르게 설정해야 한다는 점을 기억하세요. GitHub는 새 SSH 키를 생성하는 방법과 SSH 키를 ssh-agent에 추가하는 방법에 대한 훌륭한 문서를 제공합니다.

Linux
HTTPS
저장
사용자 이름과 비밀번호를 매번 다시 입력하지 않고 영구적으로 안전하게 저장하려면 Git의 Credential Helper를 사용할 수 있습니다. libsecret은 비밀번호를 안전한 위치에 저장합니다. GNOME에서는 GNOME Keyring이, KDE에서는 KDE Wallet이 이를 지원합니다.
libsecret을 자격 증명 헬퍼로 설정하려면 볼트/저장소의 디렉터리에서 터미널에 다음을 실행하세요. `--global` 플래그를 추가하여 기기의 다른 모든 저장소에도 이 설정을 적용할 수도 있습니다.

git config credential.helper libsecret
터미널에서 헬퍼를 설정한 뒤 인증 작업(clone/pull/push) 하나를 수행해야 합니다. 그 후에는 Obsidian에서 문제없이 clone/pull/push를 할 수 있어야 합니다.

`git: 'credential-libsecret' is not a git command` 메시지가 표시되는 경우, libsecret이 시스템에 설치되어 있지 않은 것입니다. 직접 설치해야 할 수 있습니다.
다음은 Ubuntu 예시입니다.

sudo apt install libsecret-1-0 libsecret-1-dev make gcc

sudo make --directory=/usr/share/doc/git/contrib/credential/libsecret

# 참고: 이 명령은 전역 설정을 변경합니다. 원하지 않는 경우 `--global`을 생략하고 기존 git 저장소에서 실행할 수 있습니다.
git config --global credential.helper \
   /usr/share/doc/git/contrib/credential/libsecret/git-credential-libsecret

SSH_PASS 도구
Git이 어떤 터미널에도 연결되어 있지 않아 터미널에서 사용자 이름/비밀번호를 입력할 수 없을 때, Git은 사용자가 해당 값을 입력할 수 있는 인터페이스를 제공하기 위해 GIT_ASKPASS/SSH_ASKPASS 환경 변수에 의존합니다.

네이티브 SSH_ASKPASS
이를 영구적으로 저장하고 싶지 않은 경우 ksshaskpass(KDE 시스템에는 사전 설치됨)를 설치하고 비밀번호를 묻는 바이너리로 설정할 수 있습니다.

Obsidian에서 ksshaskpass를 SSH_ASKPASS 도구로 사용하려면 플러그인 설정의 "Advanced" 섹션에 있는 "Additional Environment Variables"에 다음 줄을 추가하세요.

SSH_ASKPASS=ksshaskpass
이제 인증이 필요한 Git 작업을 사용할 때 사용자 이름/비밀번호를 입력하는 새 창이 나타나야 합니다.

Obsidian에 통합된 SSH_PASS
다른 프로그램이 설정되어 있지 않으면, 플러그인은 이제 SSH_ASKPASS 환경 변수를 위한 통합 스크립트를 자동으로 제공합니다. 이 스크립트는 Git이 사용자 이름이나 비밀번호를 요청할 때마다 Obsidian에서 모달을 엽니다.

SSH
위의 SSH_PASS 도구 중 하나를 설치하여 패스프레이즈를 입력할 수 있게 하면, 패스프레이즈가 있는 ssh를 사용할 수 있습니다. ssh-agent에 SSH 키를 추가하는 것처럼 ssh를 올바르게 설정해야 한다는 점을 기억하세요. GitHub는 새 SSH 키를 생성하는 방법과 SSH 키를 ssh-agent에 추가하는 방법에 대한 훌륭한 문서를 제공합니다.
