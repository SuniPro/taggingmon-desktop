use std::collections::HashMap;
use log::info;
use rusqlite::{Connection, Result, params, Row};
use crate::feature::category::Category;
use crate::feature::tag::Tag;

pub fn insert_category(conn: &Connection, name: &str, is_default: bool) -> Result<(Category)> {
    info!("카테고리 삽입 요청 - 이름: {}, 기본값: {}", name, is_default);

    // 1. 같은 이름을 가진 카테고리가 이미 존재하는지 확인
    let mut stmt = conn.prepare("SELECT id, name, is_default FROM category WHERE name = ?1")?;
    let mut rows = stmt.query(params![name])?;

    if let Some(row) = rows.next()? {
        // 이미 존재하는 경우, 해당 카테고리 정보를 반환
        info!("카테고리 조회 성공 (이미 존재) - 이름: {}", name);
        return Ok(map_row_to_category(&row)?);
    }

    // 2. 존재하지 않는 경우, 새로운 카테고리 삽입
    info!("새로운 카테고리 삽입 - 이름: {}", name);
    conn.execute(
        "INSERT INTO category (name, is_default) VALUES (?1, ?2)",
        params![name, is_default],
    )?;

    let id = conn.last_insert_rowid();

    info!("카테고리 삽입 성공 - ID: {}, 이름: {}", id, name);
    Ok(Category {
        id,
        name: name.to_string(),
        is_default,
        tags: None,
    })
}

fn map_row_to_category(row: &Row) -> Result<Category> {
    Ok(Category {
        id: row.get(0)?,
        name: row.get(1)?,
        is_default: row.get(2)?,
        tags: None,
    })
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
            is_default: row.get::<_, bool>("is_default").unwrap_or(false),
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
