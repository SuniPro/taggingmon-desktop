use std::collections::HashSet;
use crate::feature::fso::FsoInfo;

/// DB에서 FSO를 가져왔을 때, 동일한 ID를 가진 FSO 항목들을 제거합니다.
/// ID가 없는 (id == None) 항목은 모두 유지됩니다.
pub fn remove_duplicates(fsos: Vec<FsoInfo>) -> Vec<FsoInfo> {
    let mut seen = HashSet::new();
    fsos
        .into_iter()
        .filter(|fso| {
            // id가 Some일 경우에만 중복 검사
            match fso.id {
                Some(id) => seen.insert(id), // insert는 중복이면 false
                None => true,               // None인 경우는 무조건 포함
            }
        })
        .collect()
}
