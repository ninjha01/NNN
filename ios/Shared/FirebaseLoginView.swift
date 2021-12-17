//
//  FirebaseLoginView.swift
//  NNN (iOS)
//
//  Created by Nishant Jha on 11/5/21.
//

import SwiftUI
import Firebase

struct FirebaseLoginView: View {
    @Binding var currentUserId: String?
    
    @State var email = ""
    @State var password = ""
    @State var alertMsg = ""
    @State var showAlert = false
    var body: some View {
        VStack {
            TextField("Email", text: $email).keyboardType(.emailAddress)
                .autocapitalization(.none).padding(.bottom)
            SecureField("Password", text: $password).padding(.bottom)
            Button(action: { login() }) {
                Text("Sign in")
            }.padding(.bottom)
            Button(action: { signup() }) {
                Text("Sign up")
            }
            .alert(isPresented: $showAlert) {
                Alert(
                    title: Text("Failed to login/signup"),
                    message: Text(alertMsg)
                )
            }
        }
        .padding()
        .navigationBarTitle("NNS: Sign in/up")
    }

    func login() {
        Auth.auth().signIn(withEmail: email, password: password) { (result, error) in
            if error != nil {
                alertMsg = error!.localizedDescription
                showAlert = true
            } else {
                print("success")
                if (result?.user.uid != nil) {
                    currentUserId = result!.user.uid
                }
            }
        }
    }
    
    func signup() {
        Auth.auth().createUser(withEmail: email, password: password) { (result, error) in
            if error != nil {
                alertMsg = error!.localizedDescription
                showAlert = true
            } else {
                print("success")
                if (result?.user.uid != nil) {
                    currentUserId = result!.user.uid
                }
            }
        }
    }
}

