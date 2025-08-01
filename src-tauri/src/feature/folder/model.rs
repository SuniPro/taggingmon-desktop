use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Folder {
    pub id: i64,
    pub path: String,
    pub created_at: String,
}
