use std::fs;
use std::path::Path;

pub fn delete_file(path: &Path) -> std::io::Result<()> {
    if path.exists() && path.is_file() {
        fs::remove_file(path)?;
    }
    Ok(())
}