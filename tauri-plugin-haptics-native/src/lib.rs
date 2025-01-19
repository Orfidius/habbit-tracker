use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::HapticsNative;
#[cfg(mobile)]
use mobile::HapticsNative;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the haptics-native APIs.
pub trait HapticsNativeExt<R: Runtime> {
    fn haptics_native(&self) -> &HapticsNative<R>;
}

impl<R: Runtime, T: Manager<R>> crate::HapticsNativeExt<R> for T {
    fn haptics_native(&self) -> &HapticsNative<R> {
        self.state::<HapticsNative<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("haptics-native")
        .invoke_handler(tauri::generate_handler![commands::ping])
        .setup(|app, api| {
            #[cfg(mobile)]
            let haptics_native = mobile::init(app, api)?;
            #[cfg(desktop)]
            let haptics_native = desktop::init(app, api)?;
            #[cfg(target_os = "android")]
            let handle =
                api.register_android_plugin("com.plugin.habbit-tracker", "ExamplePlugin")?;
            app.manage(haptics_native);
            Ok(())
        })
        .build()
}
