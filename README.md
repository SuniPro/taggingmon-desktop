## Environments

- node: `22.14.0`
- pnpm: `9.13.2`

<br />

## How To Install

### [Rust 사전 설치](https://v2.tauri.app/start/prerequisites/#rust) 필요

- Linux and macOS: `curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`
- Windows: `나중에 할 때 추가...`

### Run

1. `pnpm i`
2. `pnpm tauri:dev`

> [!NOTE]
> 프론트 화면만 빌드 후, preview 할 시, [serve](https://www.npmjs.com/package/serve) 설치 필요

<br />

## Build

`pnpm tauri:build`

- `pnpm build`가 자동으로 사전 실행 됨
- 빌드 앱 경로: `src-tauri/target/release/bundle`

<br />

## 컨벤션(대충)

- 디렉토리 및 파일 명명: `케밥 케이스`
- 컴포넌트 명명: `카멜 케이스`
- React Router의 `Outlet`을 사용하는 경우, 무조건 `memo` 사용 할 것(재렌더링 방지)
  - 레이아웃
  - Leaf단의 페이지에서 사용되는 상위 컴포넌트
  - **`그냥 레이아웃과 페이지를 모두 무지성 memo하자, 그럼 신경 안써도 될 듯`**
