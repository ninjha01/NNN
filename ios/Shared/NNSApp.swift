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
            EntryPointView()
        }
    }
}

struct EntryPointView: View {
    @StateObject var currentUser = User(uid: Auth.auth().currentUser?.uid)

    var body: some View {
        debugPrint("[NNN]", "EntryPoint rerendered")
        debugPrint("[NNN]", currentUser.uid ?? "no current user")
        return NavigationView {
            if (currentUser.loggedIn()) {
                NotificationSourceListView()
            } else {
                FirebaseLoginView(currentUserId: $currentUser.uid)
            }
        }
        .environmentObject(currentUser)
    }
}

struct App_Previews: PreviewProvider {
    static var previews: some View {
        EntryPointView()
.previewInterfaceOrientation(.portrait)
    }
}
