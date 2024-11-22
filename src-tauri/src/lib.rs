use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn save_habbit(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_habbits_table",
            sql: "CREATE TABLE habbits (
                    id INTEGER, 
                    name TEXT,
                    iteration INTEGER,
                    goal INTEGER,
                    remind BOOLEAN,
                    frequency TEXT,
                    lastUpdated DATETIME,
                    PRIMARY KEY(id)
                );",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:habbit.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![save_habbit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
