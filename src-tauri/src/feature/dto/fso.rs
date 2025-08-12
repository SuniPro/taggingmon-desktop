use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use crate::feature::category::Category;
use crate::feature::tag::Tag;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct FsoWithLinks {
    pub id: i64, // DB에서 조회된 FSO는 ID가 항상 존재하므로 Optional이 아닌 i64로 설정
    pub name: String,
    pub path: PathBuf,
    pub is_folder: bool,
    pub size: Option<u64>,
    pub created_at: Option<String>,
    pub modified_at: Option<String>,
    pub extension: Option<String>,
    pub readonly: bool,

    // FSO와 직접 연결된 카테고리들
    pub categories: Option<Vec<Category>>,
    // FSO와 직접 연결된 태그들
    pub tags: Option<Vec<Tag>>,
}