//
//  ContentView.swift
//  Shared
//
//  Created by Nishant Jha on 11/5/21.
//

import SwiftUI

struct NotificationSource {
    var name:  String
    var topics: Array<String>
    init(name: String, topics: Array<String>) {
        self.name = name
        self.topics = topics
    }
}

struct NotificationSourceMenuView: View {
    var body: some View {
        NavigationView{
            List {
                Text("Melon")
                Text("Abacus")
            }
            .navigationTitle("Apps")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        NotificationSourceMenuView()
            .previewDevice(PreviewDevice(rawValue: "iPhone 12 Pro Max"))
    }
}
