use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn save_habit(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_habits_table",
            sql: "CREATE TABLE habits (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    iteration INTEGER,
                    goal INTEGER,
                    remind BOOLEAN,
                    frequency TEXT,
                    lastUpdated DATETIME
                );",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:habit.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![save_habit])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
