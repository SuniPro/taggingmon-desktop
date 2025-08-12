use rusqlite::types::Value;
use crate::feature::category::Category;
use crate::feature::fso::FsoInfo;
use crate::feature::tag::Tag;

/// i64 배열을 rusqlite Value 배열로 변환해줍니다.
/// 주로 params_from_iter(...)에 사용됩니다.
pub fn to_sql_params(ids: &[i64]) -> impl Iterator<Item = Value> + '_ {
    ids.iter().map(|&id| Value::Integer(id))
}

pub fn map_row_to_fso(row: &rusqlite::Row) -> rusqlite::Result<FsoInfo> {
    Ok(FsoInfo {
        id: row.get(0)?,
        name: row.get(1)?,
        path: row.get::<_, String>(2)?.into(),
        is_folder: row.get(3)?,
        size: row.get(4)?,
        created_at: row.get(5)?,
        modified_at: row.get(6)?,
        extension: row.get(7)?,
        readonly: row.get(8)?,
    })
}

// 수정된 map_row_to_category 함수
pub fn map_row_to_category(row: &rusqlite::Row) -> rusqlite::Result<Category> {
    Ok(Category {
        id: row.get(1)?,  // 인덱스를 1부터 시작하여 카테고리 ID를 가져옵니다.
        name: row.get(2)?,
        is_default: row.get(3)?,
        tags: None,
    })
}

pub fn map_row_to_tag(row: &rusqlite::Row) -> rusqlite::Result<Tag> {
    Ok(Tag {
        id: row.get(1)?,
        category_id: row.get(2)?,
        name: row.get(3)?,
        is_auto_generated: row.get(4)?,
    })
}