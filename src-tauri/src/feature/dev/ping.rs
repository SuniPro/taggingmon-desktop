use crate::common::{Response, ResponseStatus};

#[tauri::command]
pub fn ping_sqlite() -> Response<String> {
    match crate::feature::db::init_db() {
        Ok(conn) => {
            // SELECT 1 → query_row로 하나만 꺼냄
            let result = conn.query_row("SELECT 1", [], |row| {
                let val: i32 = row.get(0)?;
                Ok(val)
            });

            match result {
                Ok(val) => Response {
                    status: ResponseStatus::Success,
                    message: Some("SQLite 연결 성공 ✅".into()),
                    data: Some(format!("쿼리 결과: {}", val)),
                },
                Err(e) => Response {
                    status: ResponseStatus::Failed,
                    message: Some(format!("쿼리 실패: {}", e)),
                    data: None,
                },
            }
        }
        Err(e) => Response {
            status: ResponseStatus::Failed,
            message: Some(format!("DB 연결 실패: {}", e)),
            data: None,
        },
    }
}
