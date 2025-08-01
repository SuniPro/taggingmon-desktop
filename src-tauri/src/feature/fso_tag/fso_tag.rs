use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct FsoTag {
    pub fso_id: i64,
    pub tag_id: i64,
}