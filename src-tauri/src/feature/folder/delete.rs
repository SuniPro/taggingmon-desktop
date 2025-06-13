use std::fs;
use std::path::Path;

use crate::common::{Response, ResponseStatus};

#[tauri::command]
pub fn delete_folder(path: String) -> Response<()> {
    let dir_path = Path::new(&path);

    if !dir_path.exists() {
        return Response {
            status: ResponseStatus::Failed,
            message: Some("해당 경로가 존재하지 않습니다.".into()),
            data: None,
        };
    }

    if !dir_path.is_dir() {
        return Response {
            status: ResponseStatus::Failed,
            message: Some("해당 경로는 디렉토리가 아닙니다.".into()),
            data: None,
        };
    }

    match fs::remove_dir_all(dir_path) {
        Ok(_) => Response {
            status: ResponseStatus::Success,
            message: Some("폴더 삭제 완료".into()),
            data: Some(()),
        },
        Err(e) => Response {
            status: ResponseStatus::Failed,
            message: Some(format!("폴더 삭제 실패: {}", e)),
            data: None,
        },
    }
}
