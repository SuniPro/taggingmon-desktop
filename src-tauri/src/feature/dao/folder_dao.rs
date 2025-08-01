use chrono::Utc;
use rusqlite::{Connection, Result};
use crate::feature::folder::Folder;

pub fn insert_folder(conn: &Connection, path: &str) -> Result<i64> {
    let now = Utc::now().to_rfc3339();
    conn.execute(
        "INSERT OR IGNORE INTO folders (path, created_at) VALUES (?1, ?2)",
        &[path, &now],
    )?;
    Ok(conn.last_insert_rowid())
}

pub fn list_all_folders(conn: &Connection) -> Result<Vec<Folder>> {
    let mut stmt = conn.prepare("SELECT id, path, created_at FROM folders")?;
    let rows = stmt.query_map([], |row| {
        Ok(Folder {
            id: row.get(0)?,
            path: row.get(1)?,
            created_at: row.get(2)?,
        })
    })?;

    Ok(rows.filter_map(Result::ok).collect())
}

pub fn delete_folder_record(conn: &Connection, path: &str) -> Result<()> {
    conn.execute(
        "DELETE FROM folders WHERE path = ?1",
        &[path],
    )?;
    Ok(())
}
