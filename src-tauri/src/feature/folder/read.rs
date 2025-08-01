use crate::common::{Response, ResponseStatus};
use crate::feature::file::{get_file_info, FileInfo};

use std::fs;
use std::path::Path;

#[tauri::command]
pub fn read_folder(path: String) -> Response<Vec<FileInfo>> {
    let path = Path::new(&path);

    if !path.is_dir() {
        return Response {
            status: ResponseStatus::Failed,
            message: Some("입력된 경로가 디렉토리가 아닙니다.".into()),
            data: None,
        };
    }

    let mut results = Vec::new();

    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries.flatten() {
                let path = entry.path();
                if let Some(info) = get_file_info(&path) {
                    // 디렉터리를 제외하고 실제 파일들만 받는다.
                    // TODO : 추후 디렉터리도 포함해야하면, 그 디렉터리 내부 파일들도 자동으로 태그가 붙여져야할 듯?
                    if !info.is_dir {
                        results.push(info);
                    }
                }
            }

            Response {
                status: ResponseStatus::Success,
                message: Some("디렉토리 읽기 성공".into()),
                data: Some(results),
            }
        }
        Err(e) => Response {
            status: ResponseStatus::Failed,
            message: Some(format!("디렉토리 읽기 실패: {}", e)),
            data: None,
        },
    }
}
