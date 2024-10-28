// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use std::fs;
// use std::process::Command;
use tauri::Manager;
use tauri::async_runtime;
use tauri::api::process::{Command, CommandEvent};

fn main() {
    tauri::Builder::default()
        // .plugin(tauri::plugins::shell::init())
        // .invoke_handler(tauri::generate_handler![
        //     security_audit, 
        //     demonstrate_security,
        //     test_sqlite_security
        // ])
        // .setup(|app| {
        //     // Access the main window instance to interact with the frontend if needed
        //     let window = app.get_window("main").expect("Failed to get main window");

        //     // Run the sidecar on app setup
        //     run_sidecar(window.clone());

        //     Ok(())
        // })
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            tauri::async_runtime::spawn(async move {
              let (mut rx, mut child) = Command::new_sidecar("my-sidecar") // This is only the name of the binary itself, not the complete path like on the javascript side above
                .expect("failed to setup `app` sidecar")
                .spawn()
                .expect("Failed to spawn packaged node");
            });
      
            Ok(())
          })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// // Function to initialize and handle the sidecar process
// fn run_sidecar(window: tauri::Window) {
//     let (mut rx, mut child) = Command::new_sidecar("my-sidecar")
//         .expect("failed to create `my-sidecar` command")
//         .spawn()
//         .expect("failed to spawn sidecar");

//     async_runtime::spawn(async move {
//         // Handle events from the sidecar (e.g., stdout)
//         while let Some(event) = rx.recv().await {
//             if let CommandEvent::Stdout(line) = event {
//                 // Emit the line received to the Tauri frontend for display or logging
//                 window
//                     .emit("sidecar-message", Some(line))
//                     .expect("failed to emit event");
//             }
//         }

//         // You can also write to the sidecar’s stdin if necessary
//         child.write("message from Rust\n".as_bytes()).unwrap();
//     });
// }

// use tauri::api::process::{Command, CommandEvent};

// fn run_sidecar(window: tauri::Window) {
//     // Define the sidecar command (use just the filename, not the entire path)
//     let (mut rx, mut child) = Command::new_sidecar("my-sidecar")
//         .expect("Failed to create `my-sidecar` binary command")
//         .spawn()
//         .expect("Failed to spawn sidecar");

//     // Spawn an async task to handle command output
//     tauri::async_runtime::spawn(async move {
//         while let Some(event) = rx.recv().await {
//             match event {
//                 CommandEvent::Stdout(line) => {
//                     window
//                         .emit("message", Some(format!("Output: '{}'", line)))
//                         .expect("Failed to emit event");
//                 }
//                 CommandEvent::Stderr(line) => {
//                     window
//                         .emit("error", Some(format!("Error: '{}'", line)))
//                         .expect("Failed to emit error event");
//                 }
//                 _ => {}
//             }
//         }
//     });

//     // Write to the sidecar's stdin if necessary
//     child.write("Start command\n".as_bytes()).unwrap();
// }

// #[derive(serde::Serialize)]
// struct SecurityReport {
//     filesystem_access: String,
//     process_execution: String,
//     network_access: String,
//     system_info_access: String,
// }


// #[tauri::command]
// async fn security_audit() -> Result<SecurityReport, String> {
//     let filesystem_test = fs::read_to_string("/etc/passwd")
//         .map(|_| "Warning - Unrestricted file system access".to_string())
//         .unwrap_or("Secure - File system access is controlled".to_string());

//     let process_test = Command::new("ls").output()
//         .map(|_| "Warning - Can execute system commands".to_string())
//         .unwrap_or("Secure - Process execution is controlled".to_string());

//     let system_info = Command::new("uname").arg("-a").output()
//         .map(|_| "Warning - Can access system information".to_string())
//         .unwrap_or("Secure - System information access is controlled".to_string());

//     Ok(SecurityReport {
//         filesystem_access: filesystem_test,
//         process_execution: process_test,
//         network_access: "Requires explicit configuration".to_string(),
//         system_info_access: system_info,
//     })
// }

// #[tauri::command]
// async fn demonstrate_security() -> Result<Vec<String>, String> {
//     let mut security_tests = Vec::new();
    
//     // Test file system restrictions
//     if fs::read_dir("/").is_ok() {
//         security_tests.push("WARNING: Root directory is accessible".into());
//     } else {
//         security_tests.push("SECURE: Root directory is protected".into());
//     }
    
//     // Test network restrictions
//     if std::net::TcpListener::bind("0.0.0.0:80").is_ok() {
//         security_tests.push("WARNING: Can bind to privileged ports".into());
//     } else {
//         security_tests.push("SECURE: Cannot bind to privileged ports".into());
//     }
    
//     // Test process restrictions
//     if Command::new("sudo").arg("id").output().is_ok() {
//         security_tests.push("WARNING: Can execute privileged commands".into());
//     } else {
//         security_tests.push("SECURE: Cannot execute privileged commands".into());
//     }
    
//     Ok(security_tests)
// }


// #[tauri::command]
// async fn test_sqlite_security() -> Result<String, String> {
//     // Verify file access permissions
//     let db_path = "../../data.sqlite";
//     let metadata = fs::metadata(db_path).map_err(|_| "Cannot access SQLite DB")?;
//     let permissions = metadata.permissions();

//     // Basic check for read-only (Unix systems)
//     if !permissions.readonly() {
//         return Ok("WARNING: SQLite DB file is not read-only".into());
//     } else {
//         Ok("SQLite DB file access is secure".into())
//     }
// }