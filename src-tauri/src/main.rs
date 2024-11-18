// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

fn main() {
        let migrations = vec![
            // Define your migrations here
            Migration {
                version: 1,
                description: "create_initial_tables",
                sql: "CREATE TABLE habbits (
                            id INTEGER PRIMARY KEY, 
                            name TEXT,
                            iteration SMALLINT,
                            goal SMALLINT,
                            remind BOOL,
                            frequency ENUM(daily, monthly, hourly, weekly)
                         );",
                kind: MigrationKind::Up,
            },
        ];

        let _ = tauri::Builder::default().plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:habbit.db", migrations)
                .build(),
        );
    habbit_tracker_lib::run()
}
