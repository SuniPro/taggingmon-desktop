use crate::common::{Response, ResponseStatus};

#[cfg(target_os = "macos")]
use objc2::MainThreadMarker;
#[cfg(target_os = "macos")]
use objc2_app_kit::{NSApplication, NSApplicationActivationPolicy, NSModalResponseOK, NSOpenPanel};

#[tauri::command]
#[cfg(target_os = "macos")]
pub fn dialog_open() -> Response<String> {
  unsafe {
    let mtm = MainThreadMarker::new()
      .expect("Failed to get MainThreadMarker. This should only run on the main thread.");

    let app = NSApplication::sharedApplication(mtm);
    app.setActivationPolicy(NSApplicationActivationPolicy::Regular);

    let panel = NSOpenPanel::openPanel(mtm);

    panel.setCanChooseDirectories(true);
    panel.setCanChooseFiles(true);
    panel.setAllowsMultipleSelection(true);
    panel.setFloatingPanel(true);
    let response = panel.runModal();

    if response == NSModalResponseOK {
      println!("선택된 경로들:");
      let urls = panel.URLs();

      for url in urls.into_iter() {
        match url.path() {
          Some(n) => println!("값: {}", n),
          None => println!("에러"),
        }
      }
    } else {
      println!("선택이 취소되었습니다.");
    }
  }

  Response {
    status: ResponseStatus::Success,
    message: Some(String::from("test good man")),
    data: None,
  }
}

#[tauri::command]
#[cfg(target_os = "windows")]
pub fn dialog_open() {
  println!("@TODO: 윈도우")
}

#[tauri::command]
#[cfg(target_os = "linux")]
pub fn dialog_open() {
  println!("@TODO: 리눅스")
}
