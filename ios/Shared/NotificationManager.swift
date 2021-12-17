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
    
    func subscribeTo(source: NotificationSource) -> () {
        self.messaging.subscribe(toTopic: source.id)
        debugPrint("[NNN]", "Successfully subscribed to \(source.id)")
    }
    func unsubscribeFrom(source: NotificationSource) -> () {
        self.messaging.unsubscribe(fromTopic: source.id)
        debugPrint("[NNN]", "Successfully unsubscribed from \(source.id)")
    }
}
