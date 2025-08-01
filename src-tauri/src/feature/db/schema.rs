use rusqlite::{Connection, Result};

pub fn create_tables(conn: &Connection) -> Result<()> {
  conn.execute_batch(
    "
        -- 1. FSO 테이블 (파일 또는 폴더)
        CREATE TABLE IF NOT EXISTS fso (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL UNIQUE,
            is_folder BOOLEAN NOT NULL,
            size INTEGER,
            created_at TEXT,
            modified_at TEXT,
            extension TEXT,
            readonly BOOLEAN NOT NULL DEFAULT 0
        );

        -- 2. 카테고리 테이블
        CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            is_default BOOLEAN NOT NULL DEFAULT 0
        );

        -- 3. 태그 테이블
        CREATE TABLE IF NOT EXISTS tag (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            category_id INTEGER,
            is_auto_generated BOOLEAN NOT NULL DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
        );

        -- 4. FSO - TAG 다대다 관계
        CREATE TABLE IF NOT EXISTS fso_tag (
            fso_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (fso_id, tag_id),
            FOREIGN KEY (fso_id) REFERENCES fso(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
        );

        -- 5. FSO - CATEGORY 직접 연결
        CREATE TABLE IF NOT EXISTS fso_category (
            fso_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            PRIMARY KEY (fso_id, category_id),
            FOREIGN KEY (fso_id) REFERENCES fso(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
        );

        -- 인덱스 생성 (성능 최적화)
        CREATE INDEX IF NOT EXISTS idx_fso_tag_tag_id ON fso_tag(tag_id);
        CREATE INDEX IF NOT EXISTS idx_fso_tag_fso_id ON fso_tag(fso_id);
        CREATE INDEX IF NOT EXISTS idx_fso_category_category_id ON fso_category(category_id);
        CREATE INDEX IF NOT EXISTS idx_tag_category_id ON tag(category_id);
        "
  )?;

  Ok(())
}
