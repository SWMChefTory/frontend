import UIKit
import SwiftUI
import UniformTypeIdentifiers

final class ShareViewController: UIViewController, UIGestureRecognizerDelegate {
  private var tasksAfterPresented: [() -> Void] = []
  private weak var contentView: UIView? // 추가된 프로퍼티
  
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
            self?.hostErrorView(message: "변환 실패", error: nil)
          }
          return
        }
        
        self?.tasksAfterPresented.append { [weak self] in
          let encoded = text.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
          guard let videoId = self?.extractYouTubeVideoId(from: encoded) as? String else{
            self?.hostErrorView(message: "Youtube URL만 지원합니다!", error:nil)
            return;
          }
          self?.hostView(videoId:videoId)
        }
        return;
      }
    }
    
    else if itemProvider.hasItemConformingToTypeIdentifier("public.plain-text"){
      itemProvider.loadItem(forTypeIdentifier: "public.plain-text", options: nil) { [weak self] (url, error) in
        if let error {
          self?.tasksAfterPresented.append {
            self?.hostErrorView(message: "URL 로드 실패", error: error)
          }
          return
        }
        
        guard let text =  url as? String else {
          self?.tasksAfterPresented.append {
            self?.hostErrorView(message: "변환 실패", error: nil)
          }
          return
        }
        self?.tasksAfterPresented.append { [weak self] in
          let encoded = text.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
          guard let videoId = self?.extractYouTubeVideoId(from: encoded) as? String else{
            self?.hostErrorView(message: "Youtube URL만 지원합니다!", error:nil)
            return;
          }
          self?.hostView(videoId:videoId)
        }
      }
    }
    else {
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
  
  private func hostView(videoId: String) {
    let contentVC = UIHostingController(rootView: ShareExtensionView(
      close: { [weak self] in
        self?.close()
      },
      deepLink: { [weak self] in
        guard let self = self else {
          print("self가 nil")
          return
        }

        guard let deepLinkUrl = URL(string: "com.cheftory://?video-id=\(videoId)&external=true") else {
            print("딥링크 URL 생성 실패")
            return
        }

        print("딥링크 시도: \(deepLinkUrl)")
        
        print(deepLinkUrl)
        
        EnvironmentValues().openURL(deepLinkUrl, completion: { success in
          print("앱 열기 성공 여부: \(success)")
        })      }
    ))
    
    addChild(contentVC)
    view.addSubview(contentVC.view)
    contentVC.view.translatesAutoresizingMaskIntoConstraints = false
    
    NSLayoutConstraint.activate([
      contentVC.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      contentVC.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      contentVC.view.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
      contentVC.view.heightAnchor.constraint(equalTo: view.heightAnchor)
    ])
    
    contentVC.view.backgroundColor = .clear
    
    
    contentVC.view.layer.cornerRadius = 16
    contentVC.view.layer.masksToBounds = true  // 자식 뷰들도 잘리게 함
    contentVC.view.clipsToBounds = true
    
    contentVC.didMove(toParent: self)
  }
  
  
  func extractYouTubeVideoId(from urlString: String) -> String? {
      guard let url = URL(string: urlString) else { return nil }
      
      // youtu.be 형식
      if url.host?.contains("youtu.be") == true {
          return String(url.path.dropFirst()) // '/' 제거
      }
      
      // youtube.com 형식
      if url.host?.contains("youtube.com") == true {
          let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
          return components?.queryItems?.first(where: { $0.name == "v" })?.value
      }
      
      return nil
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
      vc.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      vc.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      vc.view.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
      vc.view.heightAnchor.constraint(equalTo: view.heightAnchor)
    ])
    vc.view.backgroundColor = .clear
    
    vc.view.layer.cornerRadius = 16
    vc.view.layer.masksToBounds = true  // 자식 뷰들도 잘리게 함
    vc.view.clipsToBounds = true
    
    vc.didMove(toParent: self)
  }
  
  private func setSheetHeight(ratio: CGFloat) {
    let screenH = UIScreen.main.bounds.height
    let targetH = max(200, screenH * ratio)
    
    self.preferredContentSize = CGSize(width: 0, height: targetH)
    guard let sheet = self.sheetPresentationController else { return }
    
    if #available(iOS 16.0, *) {
      let id = UISheetPresentationController.Detent.Identifier("compact")
      let compact = UISheetPresentationController.Detent.custom(identifier: id) { _ in targetH }
      sheet.detents = [compact]
      sheet.selectedDetentIdentifier = id
      sheet.prefersGrabberVisible = false
      sheet.prefersScrollingExpandsWhenScrolledToEdge = false
      sheet.largestUndimmedDetentIdentifier = nil
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
