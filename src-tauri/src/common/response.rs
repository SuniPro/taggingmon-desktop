use serde::Serialize;

#[derive(Debug, Serialize)]
pub enum ResponseStatus {
  Success,
  Cancelled,
  Failed,
}

#[derive(Debug, Serialize)]
pub struct Response<T> {
  pub status: ResponseStatus,
  pub message: Option<String>,
  pub data: Option<T>,
}
