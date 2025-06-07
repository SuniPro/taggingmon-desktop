# PBL

## Menu

### MacOS

- 기본적으로 단일메뉴는 지원안되며, 서브메뉴로 구성해야 됨
- `src-tauri/tauri.conf.json`에서 `productName`이 MacOS 앱 메뉴의 첫 번째 타이틀로 고정됨

---

## Rust -> 타입스크립트

- ~~tslink: 4,042 - 5mon - fn ok~~
  -> 불필요 오류 발생, 커스텀 리턴 안댐
- ~~typescript-type-def : 90,739 - 8mon -fn X~~
- ~~ts-bind : 1,452 - 10mon - fn X~~
- [x] ts-rs : 315,752 - 1hour - fn X - 대안 - 반수동으로 사용
- ~~tsify 또는 wasm-bindgen - fn ok - .wasm 기반이라 빌드 안댐, 구조 변경은 과함~~

wasm-bindgen 또는 tsify => 타우리 프로젝트에서는 사용 불가

- `wasm-bindgen-cli` 또는 `wasm-pack` CLI 를 통해 생성하며 (install로 전역 설치 필요)
- 모두 .wasm 기반으로 추출하기 때문에 wasm로 빌드가 되어야함
- `cargo build --release --target wasm32-unknown-unknown` 후 `wasm-bindgen [options] ./target/wasm32-unknown-unknown/release/crate.wasm`
- 또는 `wasm-pack build --target bundler` - 내부적으로 wasm32빌드를 함께 진행해줌
