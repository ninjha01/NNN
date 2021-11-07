//
//  NotificationManager.swift
//  NNN (iOS)
//
//  Created by Nishant Jha on 11/7/21.
//

import Foundation
import Firebase

class MessagingManager: ObservableObject {
    private let messaging = Messaging.messaging()
    
    func subscribeTo(app: String, topic: String) -> () {
        let topicName = "\(app)-\(topic)"
        self.messaging.subscribe(toTopic: topicName)
        debugPrint("[NNN]", "Successfully subscribed to app \(app)'s topic \(topic)")
    }
}
