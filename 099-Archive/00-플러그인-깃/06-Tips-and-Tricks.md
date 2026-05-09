# **팁과 요령**

# **팁과 요령**

## **Gitignore**

저장소에서 캐시 파일을 제외하려면 볼트 루트에 `.gitignore` 파일을 만들고 아래 스니펫의 줄을 추가하세요.

파일을 모달에서 열어주는 `Edit .gitignore` 명령도 있습니다.

`# Obsidian 설정을 제외합니다(플러그인 및 단축키 설정 포함)
.obsidian/

# 플러그인 설정만 제외합니다. 일부 플러그인이 민감한 데이터를 노출하지 않도록 막는 데 유용할 수 있습니다
.obsidian/plugins

# 또는 워크스페이스 캐시만 제외합니다
.obsidian/workspace.json

# 모바일 기기 전용 워크스페이스 캐시를 제외합니다
.obsidian/workspace-mobile.json

# OS 설정과 캐시를 제외하려면 아래 줄을 추가합니다
.trash/
.DS_Store`

## **Obsidian Sync와 함께 사용**

git과 Obsidian Sync를 함께 사용하는 일반적인 사용 사례는 Obsidian Sync를 실제로 모든 기기 간 동기화에 사용하고, Git은 백업 및 버전 기록의 형태로 사용하는 것입니다.

**Git 플러그인을 한 기기에서만 사용**

활성화된 플러그인과 그 설정을 동기화하는 경우, `.git` 디렉터리가 없거나 해당 기기에서 자동 작업을 실행하고 싶지 않더라도 Git 플러그인이 활성화되어 실행됩니다. 이를 해결하려면 플러그인 설정의 "Advanced" 아래에서 "Disable on this device" 옵션을 활성화할 수 있습니다. 이 설정은 다른 기기로 동기화되지 않습니다.

**Git 플러그인을 사용하되, 파일을 pull하는 데는 사용하지 않기**

또 다른 사용 사례는 Obsidian Sync가 이미 파일을 업데이트했기 때문에 pull할 때 파일을 업데이트하고 싶지 않은 경우입니다. 그래도 commit/push/commit-and-sync는 계속 사용할 수 있습니다. 이를 위해 "Pull" 아래의 "Merge strategy"로 "Other sync service"를 사용하세요. 이렇게 하면 pull할 때 HEAD만 최신 커밋으로 업데이트하고, 파일은 전혀 변경하지 않습니다.
