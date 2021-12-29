//
//  FirebaseModels.swift
//  Pods
//
//  Created by Nishant Jha on 11/6/21.
//
import SwiftUI
import Foundation

class User: ObservableObject {
    @Published
    var uid: String? = nil
    
    init(uid: String?) {
        self.uid = uid
    }
    func loggedIn() -> Bool {
        return self.uid != nil
    }
}


class NotificationSource: Equatable, Identifiable {
    static func == (lhs: NotificationSource, rhs: NotificationSource) -> Bool {
        return lhs.id == rhs.id

    }
    
    var id: String
    var display_name:  String
    var subscribers: [String]
    var allowed_user_ids: [String]
    
    init(id: String, display_name: String, subscribers: [String], allowed_user_ids: [String]) {
        self.id = id
        self.display_name = display_name
        self.subscribers = subscribers
        self.allowed_user_ids = allowed_user_ids
    }
    func amISubscribed() -> Bool {
        return self.subscribers.contains(getCurrentUserID() ?? "unknown")
    }
    func isAllowed() -> Bool {
        return self.allowed_user_ids.contains(getCurrentUserID() ?? "unknown")
    
    }
}
