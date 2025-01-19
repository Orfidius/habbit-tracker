use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<HapticsNative<R>> {
  Ok(HapticsNative(app.clone()))
}

/// Access to the haptics-native APIs.
pub struct HapticsNative<R: Runtime>(AppHandle<R>);

impl<R: Runtime> HapticsNative<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    Ok(PingResponse {
      value: payload.value,
    })
  }
}
