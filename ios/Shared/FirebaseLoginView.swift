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

    var body: some View {
        VStack {
            TextField("Email", text: $email).keyboardType(.emailAddress)
                .autocapitalization(.none)
            SecureField("Password", text: $password)
            Button(action: { login() }) {
                Text("Sign in")
            }
        }
        .padding()
    }

    func login() {
        Auth.auth().signIn(withEmail: email, password: password) { (result, error) in
            if error != nil {
                print(error?.localizedDescription ?? "")
            } else {
                print("success")
                if (result?.user.uid != nil) {
                    currentUserId = result!.user.uid
                }
            }
        }
    }
}
