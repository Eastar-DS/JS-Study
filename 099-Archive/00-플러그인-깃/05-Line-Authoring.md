# **라인 작성자 표시(Line Authoring)**

# **빠른 사용자 가이드**

모든 기능을 빠르게 보여줍니다. 이 기능은 [git-blame](https://git-scm.com/docs/git-blame)을 기반으로 합니다.

ℹ️ 라인 작성자 보기는 Live-Preview와 Source 모드에서만 작동하며, Reading 모드에서는 작동하지 않습니다.

ℹ️ 현재는 데스크톱의 Obsidian만 지원됩니다.

ℹ️ 최근 릴리스된 Obsidian v1.0은 완전히 지원됩니다. 하지만 이 문서의 이미지와 GIF는 아직 업데이트되지 않았습니다.

## **활성화**

![line-author-activate.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-activate.png)

Command Palette의 `Git: Toggle line author information`을 통해서도 활성화할 수 있습니다.

## **기본 라인 작성자 정보**

![line-author-default.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-default.png)

작성자의 이니셜과 작성 날짜를 `YYYY-MM-DD` 형식으로 보여줍니다.

`*`는 작성자(author)와 커미터(committer), 또는 그들의 타임스탬프가 다르다는 것을 나타냅니다. 예를 들어 rebase 때문에 그럴 수 있습니다.

## **커밋 해시와 전체 이름**

![line-author-commit-hash-full-name.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-commit-hash-full-name.png)

설정을 통해

![line-author-commit-hash-full-name-config.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-commit-hash-full-name-config.png)

## **자연어 날짜**

![line-author-natural-language-dates.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-natural-language-dates.png)

## **사용자 지정 날짜 형식**

![line-author-custom-dates.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-custom-dates.png)

설정을 통해

![line-author-custom-dates-config.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-custom-dates-config.png)

## **로컬/작성자/UTC 시간대의 커밋 시간**

**UTC+0000/Z**

시작하기에 가장 단순한 옵션은 시간을 `UTC+00:00/Z` 시간대로 표시하는 것입니다.

이는 사용자의 로컬 시간대와 작성자의 시간대 모두와 독립적입니다.

로컬 시간과 혼동하지 않도록 접미사 `Z`와 함께 표시됩니다.

![line-author-tz-utc0000.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-tz-utc0000.png)

거터(gutter)에 표시되는 이 시간은 모든 사용자에게 동일합니다.

**내 로컬(기본값)**

기본적으로 시간은 사용자의 로컬 시간대로 표시됩니다. 즉, `커밋이 만들어졌을 때 내 벽시계는 몇 시를 가리키고 있었는가?`를 보여줍니다. 이는 사용자의 로컬 시간대에 따라 달라집니다. 예를 들어 다음은 `UTC+01:00` 시간대에 있는 사용자의 보기입니다.

![line-author-tz-viewer-plus0100.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-tz-viewer-plus0100.png)

표시된 시간이 위의 `UTC+0000` 시간보다 `1h` 빠르다는 점에 유의하세요.

**작성자의 로컬**

또는 작성자의 시간대와 명시적인 `UTC` 오프셋으로 표시할 수 있습니다. 즉, `커밋이 만들어졌을 때 작성자의 벽시계는 몇 시였고, 명시적인 UTC 오프셋은 무엇이었는가?`를 보여줍니다.

이는 사용자의 로컬 시간대와 독립적이며 모든 사용자에게 같은 시간이 표시됩니다.

![line-author-tz-author-local.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-tz-author-local.png)

**설정**

![line-author-tz-config.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-tz-config.png)

## **나이 기반 거터 색상**

라인 거터 색상은 커밋의 나이를 기준으로 합니다. 다크/라이트 모드에 자동으로 맞춰집니다.

![line-author-dark-light.gif](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-dark-light.gif)

붉은 계열은 더 최신을 의미하고, 푸른 계열은 더 오래됨을 의미합니다. 특정 최대 색상

나이(설정 가능; 기본값 `1 year`) 이상인 모든 커밋은 같은 가장 강한 푸른 계열 색상을 받습니다.

색상은 설정 가능하며, 기본값은 접근성을 고려해 선택되었습니다.

![line-author-color-config.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-color-config.png)

## **테마에 따라 텍스트 색상 CSS 조정**

기본적으로 거터 텍스트 색상은 `var(--text-muted)`를 사용하며,

이는 사용 중인 테마에서 정의한 값입니다. 하지만 이를 다른 CSS

색상이나 변수로 변경할 수 있습니다.

![line-author-text-color.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-text-color.png)

예시:

| `var(--text-muted)` | `var(--text-normal)` |

|----------------------------------------------|-----------------------------------------------|

|

![line-author-text-color-muted.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-text-color-muted.png)

|

![line-author-text-color-normal.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-text-color-normal.png)

|

## **커밋 해시 복사**

![line-author-copy-commit-hash.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-copy-commit-hash.png)

## **거터 빠른 설정**

![line-author-quick-configure-gutter.gif](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-quick-configure-gutter.gif)

## **새 줄/커밋되지 않은 줄과 파일은 `+++`를 표시**

![line-author-untracked.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-untracked.png)

## **같은 커밋 / 모든 커밋 내에서 잘라내기-복사-붙여넣기된 줄 추적**

기본적으로 각 줄은 해당 줄이 변경된 마지막 커밋을 보여줍니다.

이는 줄을 잘라내기-복사-붙여넣기하면 새 커밋이 표시된다는 뜻입니다.

비록 해당 줄이 원래 그 커밋에서 작성된 것이 아니더라도 그렇습니다.

![line-author-follow-no-follow.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-follow-no-follow.png)

하지만 예를 들어 following이 `all commits`로 설정되어 있다면 결과는 다음과 같습니다.

![line-author-follow-all-commits.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-follow-all-commits.png)

설정:

![line-author-follow-config.png](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-follow-config.png)

## **부드럽고 방해되지 않는 비동기 보기 업데이트**

라인 작성자 정보를 계산하는 데 시간이 걸리기 때문에(`git blame` 셸 호출 때문)

결과가 지연되어 나타납니다. 방해를 최소화하고 사용자 경험을 개선하기 위해,

보기는 부드럽고 방해되지 않는 방식으로 업데이트됩니다.

파일을 열 때는 그동안 플레이스홀더가 표시됩니다.

![line-author-soft-unintrusive-ux.gif](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-soft-unintrusive-ux.gif)

편집 중에도 파일이 저장되고 라인 작성자 정보가 계산될 때까지 플레이스홀더가 표시됩니다.

![line-author-soft-unintrusive-ux-editing.gif](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-soft-unintrusive-ux-editing.gif)

## **여러 줄 블록 지원**

여러 줄을 결합된 블록으로 렌더링하는 Markdown도 지원됩니다.

이 경우 모든 줄 중 가장 최신인 줄이 거터에 표시됩니다.

![line-author-multi-line-newest.gif](https://publish-01.obsidian.md/access/ba74dc4504dbb42a703d7de2bf2c5113/assets/line-author-multi-line-newest.gif)

## **공백과 줄바꿈 무시**

이는 설정에서 활성화할 수 있습니다.

[제목 없음](https://www.notion.so/da3e67ef6b7b4f76bce9a934e3cb7e3a?pvs=21)

공백을 무시하면 들여쓰기된

줄이 변경 사항으로 표시되지 않는다는 점에 유의하세요. 추가된 것은 공백뿐이기 때문입니다.

## **서브모듈 지원**

라인 작성자 정보는 서브모듈에서 완전히 지원됩니다.
