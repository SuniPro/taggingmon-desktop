use std::collections::HashMap;
use rusqlite::{Connection, Result, params};
use crate::feature::category::Category;
use crate::feature::tag::Tag;

pub fn insert_category(conn: &Connection, name: &str, is_default: bool) -> Result<()> {
    conn.execute(
        "INSERT INTO category (name, is_default) VALUES (?, ?)",
        params![name, is_default],
    )?;
    Ok(())
}

pub fn list_categories_with_tags(conn: &Connection) -> Result<Vec<Category>> {
    let mut stmt = conn.prepare(
        "
        SELECT 
            c.id as c_id, c.name as c_name, c.is_default,
            t.id as t_id, t.name as t_name, t.category_id, t.is_auto_generated
        FROM category c
        LEFT JOIN tag t ON c.id = t.category_id
        ORDER BY c.id
        "
    )?;

    let mut map: HashMap<i64, Category> = HashMap::new();

    let mut rows = stmt.query([])?;

    while let Some(row) = rows.next()? {
        let c_id: i64 = row.get("c_id")?;

        let category = map.entry(c_id).or_insert_with(|| Category {
            id: c_id,
            name: row.get("c_name").unwrap_or_default(),
            is_default: row.get::<_, bool>("is_default").unwrap_or(false).to_string(),
            tags: Some(Vec::new()),
        });

        // Tag가 있는 경우만 추가
        let tag_id: Option<i64> = row.get("t_id")?;
        if let Some(id) = tag_id {
            let tag = Tag {
                id,
                name: row.get("t_name")?,
                category_id: c_id,
                is_auto_generated: row.get::<_, bool>("is_auto_generated")?.to_string(),
            };
            category.tags.as_mut().unwrap().push(tag);
        }
    }

    Ok(map.into_values().collect())
}

pub fn update_category(conn: &Connection, id: i64, name: &str, is_default: bool) -> Result<()> {
    conn.execute(
        "UPDATE category SET name = ?, is_default = ? WHERE id = ?",
        params![name, is_default, id],
    )?;
    Ok(())
}

pub fn delete_category(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM category WHERE id = ?", params![id])?;
    Ok(())
}
