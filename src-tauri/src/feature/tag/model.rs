use serde::{Deserialize, Serialize};
use ts_rs::TS;

/** taggingmon 에서 명명한 
   fso(file system object)라는 요소에 
   태그를 붙일 수 있습니다.

    각 fso는 태그를 갖고 있으며, 생성, 수정일자, 
    확장자를 기반으로 한 태그들은 is auto generated가 true 입니다.
*/
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Tag {
    pub id: i64,
    pub category_id: i64,
    pub name: String,
    pub is_auto_generated: String,
}
