import SwiftUI

struct ShareExtensionView: View {
  @Environment(\.openURL) private var openURL

  let close: () -> Void
  let deepLinkURL: URL

  @State private var isClosing = false
  @State private var cardOffset: CGFloat = 0
  @State private var globalOpacity: Double = 1.0

  private func animateAndClose() {
    withAnimation(.easeInOut(duration: 0.22)) {
      isClosing = true
      cardOffset = 40
      globalOpacity = 0.0
    }
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.26) {
      close()
    }
  }

  var body: some View {
    let totalWidth = UIScreen.main.bounds.width
    let totalHeight = UIScreen.main.bounds.height

    GeometryReader { geometry in
      ZStack {
        Color.black.opacity(isClosing ? 0.0 : 0.06)
          .onTapGesture {
            animateAndClose()
          }
          .frame(width: geometry.size.width, height: geometry.size.height)
          .ignoresSafeArea()

        VStack {
          Spacer()

          HStack(spacing: 0) {
            VStack {
              Text("You can create recipe!")
                .font(.system(size: 16, weight: .bold))
                .multilineTextAlignment(.center)
                .foregroundColor(Color(hex: "#FFFFFF"))
                .lineLimit(1)
            }
            .padding()
            .frame(width: totalWidth * 0.6, height: totalHeight * 0.1)
            .shadow(radius: 10)

            VStack {
              Button {
                openURL(deepLinkURL) { success in
                  print("앱 열기 성공 여부: \(success)")
                  animateAndClose()
                }
              } label: {
                Text("Create")
                  .font(.system(size: 16, weight: .medium))
                  .foregroundColor(Color(hex: "#FA8839"))
              }
              .frame(maxWidth: .infinity, minHeight: 44)
              .background(Color(hex: "#FFFFFF"))
              .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .padding()
            .frame(width: totalWidth * 0.3, height: totalHeight * 0.1)
          }
          .frame(width: totalWidth, height: totalHeight * 0.1)
          .background(Color(hex: "#FA8839"))
          .clipShape(RoundedRectangle(cornerRadius: 20))
          .offset(y: isClosing ? cardOffset : 0)
          .opacity(isClosing ? 0.0 : 1.0)
          .animation(.easeInOut(duration: 0.18), value: isClosing)

          Spacer()
            .frame(height: geometry.safeAreaInsets.bottom + totalHeight * 0.1)
        }
      }
      .opacity(globalOpacity)
      .allowsHitTesting(!isClosing)
    }
    .background(Color.clear)
    .ignoresSafeArea()
  }
}
