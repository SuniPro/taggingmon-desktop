use rusqlite::{Connection, Result};
use std::path::PathBuf;

mod schema;
pub use schema::create_tables;

pub fn init_db() -> Result<Connection> {
    let db_path = get_db_path();
    let conn = Connection::open(db_path)?;
    create_tables(&conn)?;
    
    Ok(conn)
}

pub fn init_connection() -> Result<Connection> {
    let conn = Connection::open("app.db")?;
    conn.execute("PRAGMA foreign_keys = ON", [])?;
    Ok(conn)
}

fn get_db_path() -> PathBuf {
    let mut base_dir = dirs::data_local_dir().unwrap_or_else(|| std::env::current_dir().unwrap());

    // 앱 전용 하위 디렉토리 생성
    base_dir.push("taggingmon");
    std::fs::create_dir_all(&base_dir).ok();

    base_dir.join("file_meta.db")
}
