import SwiftUI

struct ShareExtensionView: View {
  let close: () -> Void
  let deepLink: () -> Void
  
  var body: some View {
    let totalWidth = UIScreen.main.bounds.width
    let totalHeight = UIScreen.main.bounds.height
    
    GeometryReader { geometry in
      ZStack {
        Color.black.opacity(0.001)
                  .contentShape(Rectangle())
                  .onTapGesture {
                    print("background tapped!")
                    close()
                  }
                  .frame(width: totalWidth, height: totalHeight)
        VStack {
          Spacer()
          
          HStack(spacing: 0) {
            VStack {
              Text("레시피 생성이 가능합니다!")
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
                deepLink()
                close()
              } label: {
                Text("생성하기")
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
          
          Spacer()
            .frame(height: geometry.safeAreaInsets.bottom + totalHeight * 0.1)
        }
      }
    }
    .ignoresSafeArea()
  }
}
