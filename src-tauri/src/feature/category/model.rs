use serde::{Deserialize, Serialize};
use ts_rs::TS;
use crate::feature::tag::Tag;

/** Tag를 그룹화 하는 객체입니다.
    자녀요소로 Tag를 가지고 있으며.
    카테고리를 호출 시 모든 태그를 함께 호출합니다.
*/
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub is_default: bool,
    pub tags: Option<Vec<Tag>>,
}
