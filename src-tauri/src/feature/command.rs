use crate::common::Response;
use crate::feature::db::init_connection;
use crate::feature::fso::FsoInfo;
use serde::Deserialize;
use std::collections::HashMap;
use tauri::command;

use crate::feature::category::Category;
use crate::feature::dao::{category_dao, fso_dao};
use tokio::task;

#[command]
pub async fn process_and_insert_all(fso_list: Vec<FsoInfo>) -> Response<Vec<i64>> {
  let result = task::spawn_blocking(move || -> Result<Vec<i64>, rusqlite::Error> {
    let mut conn = init_connection()?;
    let tx = conn.transaction()?;

    let mut inserted_fso_ids = Vec::new();
    let mut category_map: HashMap<String, i64> = HashMap::new();

    for fso in fso_list {
      let mut category_id_option = None;

      if let Some(created_at) = fso.created_at.as_ref() {
        if let Some(category_name) = created_at.get(0..7) {
          if let Some(id) = category_map.get(category_name) {
            category_id_option = Some(*id);
          } else {
            let category = category_dao::insert_category(&tx, category_name, true)?;
            category_map.insert(category_name.to_string(), category.id);
            category_id_option = Some(category.id);
          }
        }
      }

      let fso_id = fso_dao::insert_fso(&tx, &fso, category_id_option.as_ref(), None)?;
      inserted_fso_ids.push(fso_id);
    }

    tx.commit()?;
    Ok(inserted_fso_ids)
  })
  .await;
  match result {
    Ok(Ok(ids)) => Response::ok(ids),
    Ok(Err(e)) => {
      log::error!("데이터베이스 작업 실패: {}", e);
      Response::fail(e.to_string())
    }
    Err(e) => {
      log::error!("스레드 실패: {}", e);
      Response::fail(e.to_string())
    }
  }
}

#[derive(Debug, Deserialize)]
pub struct CategoryInput {
  pub name: String,
  pub is_default: bool,
}

#[tauri::command]
pub async fn insert_categories(categories: Vec<CategoryInput>) -> Response<Vec<Category>> {
  match task::spawn_blocking(move || -> Result<Vec<Category>, rusqlite::Error> {
    let mut conn = init_connection()?;
    let tx = conn.transaction()?; // 트랜잭션 시작

    let mut inserted = Vec::with_capacity(categories.len());

    for category in categories {
      log::info!("inserting category name {}", category.name);
      log::info!("inserting category is default {}", category.is_default);
      let cat = category_dao::insert_category(&tx, &category.name, category.is_default)?;
      inserted.push(cat);
    }

    tx.commit()?;
    log::info!("inserted categories successfully");
    Ok(inserted)
  })
  .await
  {
    Ok(Ok(inserted)) => {
      log::info!("모든 카테고리 삽입 성공");
      Response::ok(inserted)
    }
    Ok(Err(e)) => {
      log::error!("데이터베이스 작업 실패: {}", e);
      Response::fail(format!("생성 실패: {}", e))
    }
    Err(e) => {
      log::error!("스레드 실패: {}", e);
      Response::fail(format!("스레드 실패: {}", e))
    }
  }
}

#[tauri::command]
pub async fn get_categories() -> Response<Vec<Category>> {
  match task::spawn_blocking(move || {
    let conn = init_connection()?;
    category_dao::list_categories_with_tags(&conn)
  })
  .await
  {
    Ok(Ok(categories)) => Response::ok(categories),
    Ok(Err(e)) => Response::fail(format!("카테고리 조회 실패: {}", e)),
    Err(e) => Response::fail(format!("스레드 실패: {}", e)),
  }
}

/// fso CRUD
/// fso list를 받아 DB에 fso를 넣음과 동시에 category_ids, tag_ids를 연결시킵니다.
///
/// category_ids, tag_ids 둘 중 하나만 입력하거나, fso 만을 입력할 수 있게
/// param을 Option으로 설정하였으며, 이를 통해 유동성있는 insert를 가능하게 합니다.
#[tauri::command]
pub async fn insert_fso_async(
  fso_info_list: Vec<FsoInfo>,
  category_id: Option<i64>, // Vec<i64>로 수정
  tag_id: Option<i64>,      // Vec<i64>로 수정
) -> Response<Vec<i64>> {
  // `category_ids`와 `tag_ids`를 `Vec<i64>`로 받아서 `move` 클로저로 옮길 수 있게 합니다.
  match task::spawn_blocking(move || -> Result<Vec<i64>, rusqlite::Error> {
    let mut conn = init_connection()?;
    let tx = conn.transaction()?; // 트랜잭션 시작

    let mut inserted = Vec::with_capacity(fso_info_list.len());

    for fso in fso_info_list {
      log::info!("inserting fso name {}", fso.name);
      let cat = fso_dao::insert_fso(&tx, &fso, category_id.as_ref(), tag_id.as_ref())?;
      inserted.push(cat);
    }

    tx.commit()?;
    log::info!("inserted fso_list successfully");
    Ok(inserted)
  })
  .await
  {
    Ok(Ok(inserted)) => {
      log::info!("모든 FSO 삽입 성공");
      Response::ok(inserted)
    }
    Ok(Err(e)) => {
      log::error!("데이터베이스 작업 실패: {}", e);
      Response::fail(format!("생성 실패: {}", e))
    }
    Err(e) => {
      log::error!("스레드 실패: {}", e);
      Response::fail(format!("스레드 실패: {}", e))
    }
  }
}

#[command]
pub async fn delete_fso_async(fso_id: i64) -> Response<()> {
  match task::spawn_blocking(move || {
    let conn = init_connection()?;
    fso_dao::delete_fso(&conn, fso_id)
  })
  .await
  {
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
  match task::spawn_blocking(move || {
    let conn = init_connection()?;
    fso_dao::update_fso(&conn, fso_id, &update_info, &category_ids, &tag_ids)
  })
  .await
  {
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
  })
  .await
  {
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
  tag_ids: Vec<i64>,
) -> Response<Vec<FsoInfo>> {
  let result = task::spawn_blocking(move || {
    let conn = init_connection()?;
    fso_dao::get_fsos_by_categories_and_tags(&conn, &category_ids, &tag_ids)
  })
  .await;

  match result {
    Ok(Ok(fsos)) => Response::ok(fsos),
    Ok(Err(e)) => {
      log::error!("FSO 병합 조회 실패: {}", e);
      Response::fail(format!("FSO 병합 조회 실패: {}", e))
    }
    Err(e) => {
      log::error!("스레드 실패: {:?}", e);
      Response::fail(format!("스레드 실패: {}", e))
    }
  }
}
