use rusqlite::{Connection, Result, params};
use crate::feature::tag::Tag;

pub fn insert_tag(conn: &Connection, name: &str, category_id: Option<i64>, is_auto_generated: bool) -> Result<()> {
    conn.execute(
        "INSERT INTO tag (name, category_id, is_auto_generated) VALUES (?, ?, ?)",
        params![name, category_id, is_auto_generated],
    )?;
    Ok(())
}

pub fn list_tags(conn: &Connection) -> Result<Vec<Tag>> {
    let mut stmt = conn.prepare("SELECT id, name, category_id, is_auto_generated FROM tag")?;
    let tags = stmt
        .query_map([], |row| {
            Ok(Tag {
                id: row.get(0)?,
                name: row.get(1)?,
                category_id: row.get(2)?,
                is_auto_generated: row.get(3)?,
            })
        })?
        .collect::<Result<Vec<_>>>()?;
    Ok(tags)
}

pub fn update_tag(conn: &Connection, id: i64, name: &str, category_id: Option<i64>, is_auto_generated: bool) -> Result<()> {
    conn.execute(
        "UPDATE tag SET name = ?, category_id = ?, is_auto_generated = ? WHERE id = ?",
        params![name, category_id, is_auto_generated, id],
    )?;
    Ok(())
}

pub fn delete_tag(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM tag WHERE id = ?", params![id])?;
    Ok(())
}
