use chrono::{DateTime, Local};
use std::fs;
use std::path::Path;

use crate::feature::file::FileInfo;

pub fn get_file_info(path: &Path) -> Option<FileInfo> {
  let metadata = fs::metadata(path).ok()?;
  let file_name = path.file_name()?.to_string_lossy().to_string();
  let extension = path.extension().map(|e| e.to_string_lossy().to_string());
  let size = if metadata.is_file() {
    Some(metadata.len())
  } else {
    None
  };

  Some(FileInfo {
    id: None,  // 새로 생성되므로 없음
    path: path.to_path_buf(),
    name: file_name,
    extension,
    is_dir: metadata.is_dir(),
    size,
    created_at: metadata
        .created()
        .ok()
        .map(|t| DateTime::<Local>::from(t).to_string()),
    modified_at: metadata
        .modified()
        .ok()
        .map(|t| DateTime::<Local>::from(t).to_string()),
    readonly: metadata.permissions().readonly(),
    category: None,
    tags: None,
  })
}
