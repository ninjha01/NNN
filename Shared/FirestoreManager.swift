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

func getCurrentUserID() -> String? {
    return Auth.auth().currentUser?.uid
}

class NotificationSourceRepository: ObservableObject {
    private let ref = store.collection("topics")
    func pull(saveFunc: @escaping (_ sources: [NotificationSource]) -> ()) -> () {
        var sourceList: [NotificationSource] = [NotificationSource]()
        ref.getDocuments() { (snapshot, err) in
            if let err = err {
                debugPrint("[NNN]", "Error getting documents: \(err)")
                sourceList = []
            } else {
                debugPrint("[NNN]", "Success! : \(snapshot!.documents)")
                for document in snapshot!.documents {
                    let data = document.data()
                    sourceList.append(
                        NotificationSource(
                            id: document.documentID,
                            display_name: data["display_name"] as! String,
                            subscribers: data["subscribers"] as! [String])
                    )
                }
                saveFunc(sourceList)
            }
        }
    }
    
    func subscribeTo(
        source: NotificationSource
    ){
        let uid = getCurrentUserID()
        let docRef = ref.document(source.id)
        docRef.updateData(["subscribers": FieldValue.arrayUnion([uid])]) {err in
            if (err != nil) {
                debugPrint("[NNN] Failed to push subscription \(err)")
            } else {
                debugPrint("[NNN] Subscribed to \(source.display_name) successfully")
            }
        }
    }
    func unsubscribeFrom(
        source: NotificationSource
    ) {
        let uid = getCurrentUserID()
        let docRef = ref.document(source.id)
        docRef.updateData(["subscribers": FieldValue.arrayRemove([uid])]) {err in
            if (err != nil) {
                debugPrint("[NNN] Failed to remove subscription \(err)")
            } else {
                debugPrint("[NNN] Unsubscribed from \(source.display_name) successfully")
            }
        }
    }
}
