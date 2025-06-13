use rusqlite::{Connection, Result};

pub fn create_tables(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS files (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            path        TEXT NOT NULL UNIQUE,
            filename    TEXT NOT NULL,
            ext         TEXT,
            size        INTEGER,
            created_at  TEXT,
            updated_at  TEXT,
            category    TEXT
        );

        CREATE TABLE IF NOT EXISTS tags (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS file_tags (
            file_id INTEGER,
            tag_id  INTEGER,
            PRIMARY KEY (file_id, tag_id),
            FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE,
            FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS folders (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            path        TEXT NOT NULL UNIQUE,
            created_at  TEXT NOT NULL
        );
        "
    )?;
    Ok(())
}
