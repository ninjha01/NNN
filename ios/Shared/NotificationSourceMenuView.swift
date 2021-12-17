//
//  ContentView.swift
//  Shared
//
//  Created by Nishant Jha on 11/5/21.
//

import SwiftUI
//import Firestore

private func subscribeToTopics(sources: [NotificationSource]) {
    let messagingManager = MessagingManager()
    for source in sources {
        if source.amISubscribed() {
            messagingManager.subscribeTo(source: source)
        }
    }
}

func handleSubscribeToTopic(source: NotificationSource) async {
    let messagingManager = MessagingManager()
    let dataRepo = NotificationSourceRepository()
    messagingManager.subscribeTo(source: source)
    dataRepo.subscribeTo(
        source: source
    )
}

func handleUnsubscribeToTopic(source: NotificationSource) async {
    let messagingManager = MessagingManager()
    let dataRepo = NotificationSourceRepository()
    messagingManager.unsubscribeFrom(source: source)
    dataRepo.unsubscribeFrom(
        source: source
    )
}


private class NotificationSourceViewModel: ObservableObject {
    @Published var notificationSources = [NotificationSource]()
    @Published var fetching = false
    var sourceRepo = NotificationSourceRepository()
    
    @MainActor
    func fetchData() {
        fetching = true
        sourceRepo.pull(
            saveFunc: ({( sources: [NotificationSource]) -> () in
                debugPrint("[NNN]", "Model recieved \(sources)")
                self.notificationSources = sources
                subscribeToTopics(sources: sources)
                self.fetching = false
            }))
    }
    
}


struct NotificationSourceListView: View {
    @StateObject fileprivate var model = NotificationSourceViewModel()
    
    var body: some View {
        NavigationView{
            List {
                ForEach(model.notificationSources) { source in
                    SourceToggler(display_name: source.display_name,
                                  toggledOn: source.amISubscribed(),
                                  onChange: {(_ toggledOn: Bool) async -> () in
                        if (toggledOn) {
                            await handleSubscribeToTopic(source: source)}
                        else {
                            await handleUnsubscribeToTopic(source: source)
                        }
                    })
                }
            }
            .overlay {
                if (model.fetching) {
                    ProgressView("Fetching notifcation sources...")
                        .progressViewStyle(CircularProgressViewStyle())
                }
            } .animation(.default, value: model.notificationSources)
                .task {
                    model.fetchData()
                    
                }
        }.navigationBarTitle("Notification Sources")
    }
}

struct SourceToggler: View {
    private var display_name: String
    @State private var toggledOn: Bool
    private var onChange: (_ toggledOn: Bool) async -> ()
    
    init(display_name: String, toggledOn: Bool, onChange: @escaping (Bool) async -> ()) {
        self.display_name = display_name
        self.toggledOn = toggledOn
        self.onChange = onChange
    }
    
    var body: some View {
        Toggle(isOn: $toggledOn) {
            Text(display_name)
        }
        .onChange(of: toggledOn)
        { value in
            toggledOn.toggle()
        }.task(id: toggledOn) {
            await onChange(toggledOn)
        }
    }
}
