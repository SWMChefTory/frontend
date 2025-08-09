//
//  ShareErrorView.swift
//  cheiftory
//
//  Created by 황교준 on 8/9/25.
//
import SwiftUI

struct ShareErrorView: View {
  let message: String
  let onClose: () -> Void

  var body: some View {
    VStack(spacing: 16) {
      Text("공유 실패").font(.headline)
      Text(message).multilineTextAlignment(.center)
      Button("확인") { onClose() }
        .buttonStyle(.borderedProminent)
    }
    .padding()
  }
}

