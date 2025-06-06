use crate::common::{Response, ResponseStatus};
use crate::feature::file::{get_file_info, FileInfo};

#[cfg(target_os = "macos")]
use objc2::MainThreadMarker;
#[cfg(target_os = "macos")]
use objc2_app_kit::{NSApplication, NSApplicationActivationPolicy, NSModalResponseOK, NSOpenPanel};

#[tauri::command]
#[cfg(target_os = "macos")]
pub fn dialog_open() -> Response<Vec<FileInfo>> {
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
      let urls = panel.URLs();

      let file_infos: Vec<FileInfo> = urls
        .into_iter()
        .filter_map(|url| url.path())
        .filter_map(|ns_string| {
          let rust_string = ns_string.to_string();
          let path = std::path::Path::new(&rust_string);

          get_file_info(path)
        })
        .collect();

      return Response::<Vec<FileInfo>> {
        status: ResponseStatus::Success,
        message: Some(String::from("dialog_open :: success")),
        data: Some(file_infos),
      };
    } else {
      return Response {
        status: ResponseStatus::Canceled,
        message: Some(String::from("dialog_open :: canceled")),
        data: None,
      };
    }
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
