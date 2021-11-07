//
//  FirestoreManager.swift
//  NNN (iOS)
//
//  Created by Nishant Jha on 11/7/21.
//

import SwiftUI
import FirebaseFirestore
import FirebaseAuth

private let store = Firestore.firestore()


class NotificationSourceRepository: ObservableObject {
    private let ref = store.collection("NotificationSources")
    func pull(saveFunc: @escaping (_ sources: [NotificationSource]) -> ()) async -> () {
        var sourceList: [NotificationSource] = [NotificationSource]()
        
        let uid = Auth.auth().currentUser!.uid
        await ref.getDocuments() { (snapshot, err) in
            if let err = err {
                debugPrint("[NNN]", "Error getting documents: \(err)")
                sourceList = []
            } else {
                debugPrint("[NNN]", "Success! : \(snapshot!.documents)")
                for document in snapshot!.documents {
                    let data = document.data()
                    var topics = [Topic]()
                    for topicDatum in data["topics"] as! [[String: Any]] {
                        let name = topicDatum["name"] as! String
                        debugPrint("[NNN] topicDatum", topicDatum)
                        let subscribers = topicDatum["subscribers"] as! [String]
                        topics.append(Topic(id: name, name: name, subscribed: subscribers.contains(uid ?? "no user")))
                    }
                    sourceList.append(
                        NotificationSource(id: document.documentID, name: data["name"] as! String, topics: topics)
                    )
                }
                saveFunc(sourceList)
            }
        }
    }
}
