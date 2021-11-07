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


struct NotificationSource: Identifiable, Decodable, Equatable {
    var id: String
    var name:  String
    var topics: [Topic]
}

struct Topic: Identifiable, Hashable, Decodable {
    var id: String
    var name: String
    var subscribed: Bool
}
