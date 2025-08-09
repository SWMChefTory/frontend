import SwiftUI

struct ShareExtensionView: View {
    let close: () -> Void
    
    var body: some View {
        NavigationStack{
            VStack(spacing: 20){
                
                Button {
                    // TODO: save text
                    close()
                } label: {
                    Text("Save")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Share Extension")
            .toolbar {
                Button("Cancel") {
                    close()
                }
            }
        }
    }
}
