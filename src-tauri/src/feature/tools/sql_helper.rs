use rusqlite::types::Value;
use crate::feature::fso::FsoInfo;

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
