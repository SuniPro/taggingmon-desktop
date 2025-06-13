use rusqlite::{params, Connection, Result};
use crate::feature::file::FileInfo;

pub fn insert_file(conn: &Connection, info: &FileInfo) -> Result<i64> {
    conn.execute(
        "INSERT INTO files (path, filename, ext, size, created_at, updated_at, category)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            info.path.to_string_lossy(),
            info.name,
            info.extension.clone().unwrap_or_default(),
            info.size.unwrap_or(0),
            info.created_at.clone().unwrap_or_default(),
            info.modified_at.clone().unwrap_or_default(),
            info.category.clone().unwrap_or_default(),
        ],
    )?;
    Ok(conn.last_insert_rowid())
}

pub fn delete_file_record(conn: &Connection, path: &str) -> Result<()> {
    conn.execute("DELETE FROM files WHERE path = ?1", params![path])?;
    Ok(())
}

pub fn list_all_files(conn: &Connection) -> Result<Vec<FileInfo>> {
    let mut stmt = conn.prepare(
        "SELECT id, path, filename, ext, size, created_at, updated_at, category FROM files"
    )?;
    let rows = stmt.query_map([], |row| {
        Ok(FileInfo {
            id: Some(row.get(0)?),
            path: std::path::PathBuf::from(row.get::<_, String>(1)?),
            name: row.get(2)?,
            extension: Some(row.get(3)?),
            size: Some(row.get(4)?),
            created_at: Some(row.get(5)?),
            modified_at: Some(row.get(6)?),
            category: Some(row.get(7)?),
            is_dir: false,
            readonly: false,
            tags: None, // 태그는 JOIN 필요
        })
    })?;

    rows.collect()
}
