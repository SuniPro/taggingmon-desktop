use crate::common::Response;
use crate::feature::db::init_db;

mod common;
mod feature;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    init_db().expect("좆됨 db 실행안됨");  // ✅ 앱 시작 시 1회 테이블 초기화
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      feature::dialog::dialog_open,
      hello_world
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command(rename_all = "snake_case")]
fn hello_world(str_arg: &str) -> Response<String> {
  println!("hello_world :: {}", str_arg);

  Response {
    status: common::ResponseStatus::Success,
    message: Some(String::from("Message :: hello_world")),
    data: Some(String::from("Response :: hello_world :: ") + str_arg),
  }
}
