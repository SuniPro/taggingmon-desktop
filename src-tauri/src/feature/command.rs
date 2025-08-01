use tauri::command;
use std::path::PathBuf;
use crate::{
    feature::file::{get_file_info, delete_file},
};
use crate::common::{Response};
use crate::feature::db::{init_connection};
use crate::feature::fso::FsoInfo;

use tokio::task;
use crate::feature::dao::fso_dao;

#[command]
pub async fn delete_fso_async(fso_id: i64) -> Response<()> {
    match task::spawn_blocking(move || {
        let conn = init_connection()?;
        fso_dao::delete_fso(&conn, fso_id)
    }).await {
        Ok(Ok(_)) => Response::ok(()),
        Ok(Err(e)) => Response::fail(format!("삭제 실패: {}", e)),
        Err(e) => Response::fail(format!("스레드 실패: {}", e)),
    }
}

#[command]
pub async fn update_fso(
    fso_id: i64,
    update_info: FsoInfo,
    category_ids: Vec<i64>,
    tag_ids: Vec<i64>,
) -> Response<()> {
    match task::spawn_blocking(move || {let conn = init_connection()?;
        fso_dao::update_fso(&conn, fso_id, &update_info, &category_ids, &tag_ids)
    }).await {
        Ok(Ok(_)) => Response::ok(()),
        Ok(Err(e)) => Response::fail(format!("업데이트 실패: {}", e)),
        Err(e) => Response::fail(format!("스레드 실패: {}", e)),
    }
}

#[command]
pub async fn get_fsos_by_tag_ids_async(tag_ids: Vec<i64>) -> Response<Vec<FsoInfo>> {
    match task::spawn_blocking(move || {
        let conn = init_connection()?; // 비동기 아님, spawn_blocking 안이라 안전
        fso_dao::get_fsos_by_tag_ids(&conn, &tag_ids)
    })
        .await
    {
        Ok(Ok(fsos)) => Response::ok(fsos),
        Ok(Err(e)) => Response::fail(format!("FSO 조회 실패: {}", e)),
        Err(e) => Response::fail(format!("스레드 실패: {}", e)),
    }
}

#[command]
pub async fn get_fsos_by_category_ids_async(category_ids: Vec<i64>) -> Response<Vec<FsoInfo>> {
    match task::spawn_blocking(move || {
        let conn = init_connection()?;
        fso_dao::get_fsos_by_category_ids(&conn, &category_ids)
    }).await {
        Ok(Ok(fsos)) => Response::ok(fsos),
        Ok(Err(e)) => Response::fail(format!("FSO 조회 실패: {}", e)),
        Err(e) => Response::fail(format!("스레드 실패: {}", e)),
    }
}

/// 비동기 방식으로 category와 tag 기반 FSO 목록을 조회합니다.
/// 중복 제거는 get_fsos_by_categories_and_tags 내부에서 수행됩니다.
#[command]
pub async fn get_fsos_by_categories_and_tags_async(
    category_ids: Vec<i64>,
    tag_ids: Vec<i64>
) -> Response<Vec<FsoInfo>> {
    let result = task::spawn_blocking(move || {
        let conn = init_connection()?;
        fso_dao::get_fsos_by_categories_and_tags(&conn, &category_ids, &tag_ids)
    }).await;

    match result {
        Ok(Ok(fsos)) => Response::ok(fsos),
        Ok(Err(e)) => {
            log::error!("FSO 병합 조회 실패: {}", e);
            Response::fail(format!("FSO 병합 조회 실패: {}", e))
        },
        Err(e) => {
            log::error!("스레드 실패: {:?}", e);
            Response::fail(format!("스레드 실패: {}", e))
        },
    }
}



