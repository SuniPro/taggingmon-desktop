use serde::Serialize;
use std::path::PathBuf;
use ts_rs::TS;

#[derive(Debug, Serialize, TS)]
#[ts(export)]
pub struct FsoInfo {
    pub id: Option<i64>, // DB ID
    pub name: String,
    pub path: PathBuf,
    pub is_folder: bool,
    pub size: Option<u64>,
    pub created_at: Option<String>,
    pub modified_at: Option<String>,
    pub extension: Option<String>,
    pub readonly: bool,
}
