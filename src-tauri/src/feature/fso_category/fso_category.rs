use serde::{Serialize, Deserialize};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct FsoCategory {
    pub fso_id: i64,
    pub category_id: i64,
}