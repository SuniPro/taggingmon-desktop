use serde::Serialize;
use ts_rs::TS;

#[derive(Debug, Serialize, TS)]
#[ts(export)]
pub enum ResponseStatus {
  Success,
  Canceled,
  Failed,
}

#[derive(Debug, Serialize, TS)]
#[ts(export)]
pub struct Response<T> {
  pub status: ResponseStatus,
  pub message: Option<String>,
  pub data: Option<T>,
}
