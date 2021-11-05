//
//  NNNApp.swift
//  Shared
//
//  Created by Nishant Jha on 11/5/21.
//

import SwiftUI
import Firebase

@main
struct NNNApp: App {
    // Handles Firebase-y init
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            NotificationSourceMenuView()
            FirebaseLoginView()
        }
    }
}
