use crate::feature::fso::FsoInfo;
use crate::feature::tools::{map_row_to_fso, remove_duplicates, to_sql_params};
use rusqlite::{params_from_iter, Connection, Result};

/// FSO 정보를 데이터베이스에 삽입하고, 관련된 카테고리 및 태그 관계도 함께 설정합니다.
pub fn insert_fso(
  conn: &Connection,
  fso: &FsoInfo,
  category_id: Option<&i64>, // Option<&[i64]>로 수정
  tag_id: Option<&i64>,      // Option<&[i64]>로 수정
) -> Result<i64> {
  conn.execute(
    "INSERT INTO fso (
            name, path, is_folder, size, created_at, modified_at,
            extension, readonly
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
    rusqlite::params![
      fso.name,
      fso.path.to_string_lossy(),
      fso.is_folder,
      fso.size,
      fso.created_at,
      fso.modified_at,
      fso.extension,
      fso.readonly,
    ],
  )?;

  let fso_id = conn.last_insert_rowid();

  // category_id가 Some일 때만 실행
  if let Some(c_id) = category_id {
    conn.execute(
      "INSERT OR IGNORE INTO fso_category (fso_id, category_id) VALUES (?1, ?2)",
      rusqlite::params![fso_id, c_id],
    )?;
  }

  // tag_id가 Some일 때만 실행
  if let Some(t_id) = tag_id {
    conn.execute(
      "INSERT OR IGNORE INTO fso_tag (fso_id, tag_id) VALUES (?1, ?2)",
      rusqlite::params![fso_id, t_id],
    )?;
  }

  Ok(fso_id)
}

/// 주어진 카테고리 ID 목록에 해당하는 FSO 목록을 반환합니다.
pub fn get_fsos_by_category_ids(conn: &Connection, category_ids: &[i64]) -> Result<Vec<FsoInfo>> {
  if category_ids.is_empty() {
    return Ok(vec![]);
  }

  let placeholders = repeat_vars(category_ids.len());

  let sql = format!(
    "
        SELECT DISTINCT f.*
        FROM fso f
        JOIN fso_category fc ON f.id = fc.fso_id
        WHERE fc.category_id IN ({})
        ",
    placeholders
  );

  let mut stmt = conn.prepare(&sql)?;
  let rows = stmt.query_map(
    params_from_iter(to_sql_params(category_ids)),
    map_row_to_fso,
  )?;

  Ok(rows.collect::<Result<Vec<_>>>()?)
}

/// 주어진 태그 ID 목록에 해당하는 FSO 목록을 반환합니다.
pub fn get_fsos_by_tag_ids(conn: &Connection, tag_ids: &[i64]) -> Result<Vec<FsoInfo>> {
  if tag_ids.is_empty() {
    return Ok(vec![]);
  }

  let placeholders = repeat_vars(tag_ids.len());

  let sql = format!(
    "
        SELECT DISTINCT f.*
        FROM fso f
        JOIN fso_tag ft ON f.id = ft.fso_id
        WHERE ft.tag_id IN ({})
        ",
    placeholders
  );

  let mut stmt = conn.prepare(&sql)?;
  let rows = stmt.query_map(params_from_iter(to_sql_params(tag_ids)), map_row_to_fso)?;

  Ok(rows.collect::<Result<Vec<_>>>()?)
}

/// 카테고리와 태그 ID 리스트를 조합하여 FSO를 검색합니다.
/// 성능을 위해 DB에서는 중복된 데이터를 포함해 가져온 후(UNION ALL)
/// remove_duplicates 를 통해 rust에서 중복을 제거 후 리턴합니다.
pub fn get_fsos_by_categories_and_tags(
  conn: &Connection,
  category_ids: &[i64],
  tag_ids: &[i64],
) -> Result<Vec<FsoInfo>> {
  let mut query_parts = vec![];
  let mut params: Vec<rusqlite::types::Value> = vec![];

  if !category_ids.is_empty() {
    let placeholders = repeat_vars(category_ids.len());
    query_parts.push(format!(
      "SELECT f.* FROM fso f
             JOIN fso_category fc ON f.id = fc.fso_id
             WHERE fc.category_id IN ({})",
      placeholders
    ));
    params.extend(category_ids.iter().map(|&id| id.into()));
  }

  if !tag_ids.is_empty() {
    let placeholders = repeat_vars(tag_ids.len());
    query_parts.push(format!(
      "SELECT f.* FROM fso f
             JOIN fso_tag ft ON f.id = ft.fso_id
             WHERE ft.tag_id IN ({})",
      placeholders
    ));
    params.extend(tag_ids.iter().map(|&id| id.into()));
  }

  // UNION ALL을 사용하여 중복 포함 쿼리 실행
  let query = query_parts.join(" UNION ALL");

  let mut stmt = conn.prepare(&query)?;
  let rows = stmt.query_map(params_from_iter(params), map_row_to_fso)?;

  // 중복 제거 후 반환
  let fsos = rows.collect::<Result<Vec<_>>>()?;
  Ok(remove_duplicates(fsos))
}

fn repeat_vars(n: usize) -> String {
  std::iter::repeat("?")
    .take(n)
    .collect::<Vec<_>>()
    .join(", ")
}

pub fn delete_fso(conn: &Connection, fso_id: i64) -> Result<()> {
  conn.execute("DELETE FROM fso WHERE id = ?1", [fso_id])?;
  Ok(())
}

/// 기존 FSO를 업데이트하고, 해당 FSO의 카테고리 및 태그 관계도 새로 설정합니다.
pub fn update_fso(
  conn: &Connection,
  fso_id: i64,
  updated: &FsoInfo,
  category_ids: &[i64],
  tag_ids: &[i64],
) -> Result<()> {
  conn.execute(
    "UPDATE fso SET
            name = ?1, path = ?2, is_folder = ?3, size = ?4,
            created_at = ?5, modified_at = ?6,
            extension = ?7, readonly = ?8
        WHERE id = ?9",
    rusqlite::params![
      updated.name,
      updated.path.to_string_lossy(),
      updated.is_folder,
      updated.size,
      updated.created_at,
      updated.modified_at,
      updated.extension,
      updated.readonly,
      fso_id
    ],
  )?;

  // 관계 테이블 초기화
  conn.execute("DELETE FROM fso_category WHERE fso_id = ?1", [fso_id])?;
  conn.execute("DELETE FROM fso_tag WHERE fso_id = ?1", [fso_id])?;

  // 다시 삽입
  for category_id in category_ids {
    conn.execute(
      "INSERT OR IGNORE INTO fso_category (fso_id, category_id) VALUES (?1, ?2)",
      rusqlite::params![fso_id, category_id],
    )?;
  }

  for tag_id in tag_ids {
    conn.execute(
      "INSERT OR IGNORE INTO fso_tag (fso_id, tag_id) VALUES (?1, ?2)",
      rusqlite::params![fso_id, tag_id],
    )?;
  }

  Ok(())
}
