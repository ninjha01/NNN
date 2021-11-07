//
//  ContentView.swift
//  Shared
//
//  Created by Nishant Jha on 11/5/21.
//

import SwiftUI
//import Firestore

private class NotificationSourceViewModel: ObservableObject {
    @Published var notificationSources = [NotificationSource]()
    @Published var fetching = false
    
    @MainActor
    func fetchData() async {
        fetching = true
        await NotificationSourceRepository().pull(
            saveFunc: ({( sources: [NotificationSource]) -> () in
                debugPrint("[NNN]", "Model recieved \(sources)")
                self.notificationSources = sources
                self.fetching = false
            }))
    }
}

struct NotificationSourceListView: View {
    @StateObject fileprivate var model = NotificationSourceViewModel()
    
    var body: some View {
        NavigationView{
            List {
                ForEach($model.notificationSources) { $source in
                    NotificationSourceView(source: $source)
                }
            }
            .navigationTitle("Notification Sources")
            .overlay {
                if (model.fetching) {
                    ProgressView("Fetching notifcation sources...")
                        .progressViewStyle(CircularProgressViewStyle())
                }
            } .animation(.default, value: model.notificationSources)
                .task {
                    await model.fetchData()
                    
                }
        }
    }
}
struct NotificationSourceView: View {
    @Binding var source: NotificationSource
    var body: some View {
        Section(header: Text(source.name)) {
            ForEach(source.topics) { topic in
                TopicToggler(name: topic.name,
                             toggledOn: topic.subscribed,
                             onChange: {() -> () in
                    debugPrint("[NNN]", "called onChange for topic \(topic.name)")})
            }
        }
    }
}

struct TopicToggler: View {
    private var name: String
    @State private var toggledOn: Bool
    private var onChange: () -> ()
    
    init(name: String, toggledOn: Bool, onChange: @escaping () -> ()) {
        self.name = name
        self.toggledOn = toggledOn
        self.onChange = onChange
    }
    
    var body: some View {
        Toggle(isOn: $toggledOn) {
            Text(name)
        }
        .onChange(of: toggledOn)
        { value in
            //perform your action here...
            self.onChange()
        }
    }
}
