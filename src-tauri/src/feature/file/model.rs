use chrono::{DateTime, Local};
use serde::Serialize;
use std::path::PathBuf;

#[derive(Debug, Serialize)]
pub struct FileInfo {
  pub name: String,
  pub path: PathBuf,
  pub is_dir: bool,
  pub size: Option<u64>,
  pub created_at: Option<DateTime<Local>>,
  pub modified_at: Option<DateTime<Local>>,
  pub extension: Option<String>,
  pub readonly: bool,
}
