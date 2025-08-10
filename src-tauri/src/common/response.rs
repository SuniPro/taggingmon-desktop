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

impl<T> Response<T> {
  pub fn ok(data: T) -> Self {
    Self {
      status: ResponseStatus::Success,
      message: None,
      data: Some(data),
    }
  }

  pub fn fail(message: String) -> Self {
    Self {
      status: ResponseStatus::Failed,
      message: Some(message),
      data: None,
    }
  }

  pub fn cancel(message: String) -> Self {
    Self {
      status: ResponseStatus::Canceled,
      message: Some(message),
      data: None,
    }
  }
}
