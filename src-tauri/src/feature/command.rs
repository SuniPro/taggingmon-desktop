use tauri::command;
use std::path::PathBuf;
use crate::{
    feature::file::{get_file_info, delete_file},
    feature::dao::file_dao,
};
use crate::common::{Response};
use crate::feature::db::init_db;
use crate::feature::dao::folder_dao;


#[command]
pub fn add_file(path: String) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let info = get_file_info(&PathBuf::from(&path)).ok_or("파일 정보를 가져올 수 없습니다.")?;

    file_dao::insert_file(&conn, &info).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn delete_file_and_record(path: String) -> Result<(), String> {
    let conn = crate::feature::db::init_db().map_err(|e| e.to_string())?;

    // DB에서 삭제
    file_dao::delete_file_record(&conn, &path).map_err(|e| e.to_string())?;

    // 실제 파일 삭제
    let file_path = PathBuf::from(&path);
    delete_file(&file_path).map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
pub fn list_files() -> Result<Vec<crate::feature::file::FileInfo>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    file_dao::list_all_files(&conn).map_err(|e| e.to_string())
}

/** folder의 path를 수령받아 이를 db에 저장합니다.*/
#[tauri::command]
pub fn add_folder(path: String) -> Response<()> {
    match init_db() {
        Ok(conn) => match folder_dao::insert_folder(&conn, &path) {
            Ok(_) => Response::ok(()),
            Err(e) => Response::fail(format!("폴더 등록 실패: {}", e)),
        },
        Err(e) => Response::fail(format!("DB 연결 실패: {}", e)),
    }
}

/** SNB에 사용하는 폴더 리스트업 기능입니다.*/
#[tauri::command]
pub fn list_folders() -> Response<Vec<crate::feature::folder::Folder>> {
    match init_db() {
        Ok(conn) => match folder_dao::list_all_folders(&conn) {
            Ok(data) => Response::ok(data),
            Err(e) => Response::fail(format!("폴더 조회 실패: {}", e)),
        },
        Err(e) => Response::fail(format!("DB 연결 실패: {}", e)),
    }
}