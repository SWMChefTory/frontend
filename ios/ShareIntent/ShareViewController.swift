import UIKit
import SwiftUI
import UniformTypeIdentifiers

final class ShareViewController: UIViewController {
  private var tasksAfterPresented: [() -> Void] = []
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    setSheetHeight(ratio: 0.0)
    view.backgroundColor = .lightGray.withAlphaComponent(0.0)
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // extensionItem과 itemProvider 확인
    guard
      let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem,
      let itemProvider = extensionItem.attachments?.first
    else {
      close()
      return
    }
    
    if itemProvider.canLoadObject(ofClass: URL.self) {
      itemProvider.loadObject(ofClass: URL.self) { [weak self] url, error in
        if let error {
          self?.tasksAfterPresented.append {
            self?.hostErrorView(message: "URL 로드 실패", error: error)
          }
          return
        }
        
        guard let text = url?.absoluteString else {
          self?.tasksAfterPresented.append {
            self?.hostErrorView(message: "URL 형식 아님", error: nil)
          }
          return
        }
        
        self?.tasksAfterPresented.append { [weak self] in
          self?.hostView(url:text)
        }
      }
    } else {
      self.tasksAfterPresented.append { [weak self] in
        self?.hostErrorView(
          message: "지원하지 않는 콘텐츠 형식입니다.",
          error: NSError(domain: "", code: 0)
        )
      }
    }
    
    NotificationCenter.default.addObserver(
      forName: NSNotification.Name("close"),
      object: nil,
      queue: nil
    ) { [weak self] _ in
      self?.close()
    }
  }
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    tasksAfterPresented.forEach { $0() }
    tasksAfterPresented.removeAll()
  }
  
  
  private func hostView(url:String){
    let contentVC = UIHostingController(rootView: ShareExtensionView(){[weak self] in
      self?.close(isSuccess: true)
    }
    )
    contentVC.preferredContentSize = CGSize(width: UIScreen.main.bounds.width, height: 100)
    addChild(contentVC)
    view.addSubview(contentVC.view)
    contentVC.view.translatesAutoresizingMaskIntoConstraints = false
    let ratio: CGFloat = 0.3

    NSLayoutConstraint.activate([
        contentVC.view.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: ratio),
        contentVC.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
        contentVC.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        contentVC.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    ])
    
    contentVC.view.layer.cornerRadius = 16
    contentVC.view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
    contentVC.view.clipsToBounds = true
    contentVC.didMove(toParent: self)
    
  }
  
  
  
  private func hostErrorView(message: String, error: Error?) {
    let vc = UIHostingController(
      rootView: ShareErrorView(message: message) { [weak self] in
        self?.close(isSuccess: false, error: error)
      }
    )
    addChild(vc)
    view.addSubview(vc.view)
    vc.view.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      vc.view.topAnchor.constraint(equalTo: view.topAnchor),
      vc.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
      vc.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      vc.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
    ])
    vc.didMove(toParent: self)
    
    //    setSheetHeight(ratio: 0.3)
  }
  
  private func setSheetHeight(ratio: CGFloat) {
    let screenH = UIScreen.main.bounds.height
    let targetH = max(200, screenH * ratio) // 원하는 작은 값
    
    // 힌트
    self.preferredContentSize = CGSize(width: 0, height: targetH)
    guard let sheet = self.sheetPresentationController else { return }
    
    if #available(iOS 16.0, *) {
      // iOS16+: 커스텀 detent "하나만"
      let id = UISheetPresentationController.Detent.Identifier("compact")
      let compact = UISheetPresentationController.Detent.custom(identifier: id) { _ in targetH }
      sheet.detents = [compact]
      sheet.selectedDetentIdentifier = id
      sheet.prefersGrabberVisible = false
      sheet.prefersScrollingExpandsWhenScrolledToEdge = false
      sheet.largestUndimmedDetentIdentifier = nil   // 딤 유지
    }
  }
  
  private func close(isSuccess: Bool = false, error: Error? = nil) {
    if isSuccess {
      extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    } else {
      extensionContext?.cancelRequest(withError: error ?? NSError(domain: "", code: 0))
    }
  }
}

