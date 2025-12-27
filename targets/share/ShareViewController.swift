import UIKit
import SwiftUI
import Foundation

final class ShareViewController: UIViewController {

  private var lastSheetHeight: CGFloat = 0

  private let barHeight: CGFloat = 80
  private let bottomExtraPadding: CGFloat = 12

  override func viewDidLoad() {
    super.viewDidLoad()

    view.backgroundColor = .clear
    view.isOpaque = false

    NotificationCenter.default.addObserver(
      forName: NSNotification.Name("close"),
      object: nil,
      queue: nil
    ) { [weak self] _ in
      self?.close()
    }

    guard
      let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem,
      let itemProvider = extensionItem.attachments?.first
    else {
      close()
      return
    }

    if itemProvider.canLoadObject(ofClass: URL.self) {
      itemProvider.loadObject(ofClass: URL.self) { [weak self] object, error in
        if let error {
          self?.enqueueOnMain { [weak self] in
            self?.hostErrorView(
              message: NSLocalizedString("share_error_url_load_failed", comment: ""),
              error: error
            )
          }
          return
        }

        guard let url = object as? URL else {
          self?.enqueueOnMain { [weak self] in
            self?.hostErrorView(
              message: NSLocalizedString("share_error_conversion_failed", comment: ""),
              error: nil
            )
          }
          return
        }

        self?.handleIncomingText(url.absoluteString)
      }
    } else if itemProvider.hasItemConformingToTypeIdentifier("public.plain-text") {
      itemProvider.loadItem(forTypeIdentifier: "public.plain-text", options: nil) { [weak self] item, error in
        if let error {
          self?.enqueueOnMain { [weak self] in
            self?.hostErrorView(
              message: NSLocalizedString("share_error_url_load_failed", comment: ""),
              error: error
            )
          }
          return
        }

        guard let text = item as? String else {
          self?.enqueueOnMain { [weak self] in
            self?.hostErrorView(
              message: NSLocalizedString("share_error_conversion_failed", comment: ""),
              error: nil
            )
          }
          return
        }

        self?.handleIncomingText(text)
      }
    } else {
      enqueueOnMain { [weak self] in
        self?.hostErrorView(
          message: NSLocalizedString("share_error_unsupported_content", comment: ""),
          error: NSError(domain: "", code: 0)
        )
      }
    }
  }

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    view.backgroundColor = .clear
    view.isOpaque = false
  }

  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    makePresentationContainerTransparentIfPossible()
  }

  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()

    let target = barHeight + bottomExtraPadding + view.safeAreaInsets.bottom + 12
    if abs(target - lastSheetHeight) > 0.5 {
      lastSheetHeight = target
      setSheetHeight(height: target)
    }

    makePresentationContainerTransparentIfPossible()
  }

  private func handleIncomingText(_ text: String) {
    let encoded = text.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? text

    enqueueOnMain { [weak self] in
      guard let self else { return }

      if let videoId = self.extractYouTubeVideoId(from: encoded) {
        self.hostView(videoId: videoId)
      } else {
        let path = URL(string: encoded)?.path(percentEncoded: false)
          ?? NSLocalizedString("share_error_invalid_url", comment: "")
        self.hostErrorView(message: path, error: nil)
      }
    }
  }

  private func enqueueOnMain(_ block: @escaping () -> Void) {
    if Thread.isMainThread {
      block()
    } else {
      DispatchQueue.main.async { block() }
    }
  }

  private func hostView(videoId: String) {
    var components = URLComponents()
    components.scheme = "cheftory"
    components.host = "" // cheftory://? 로 만들기
    components.queryItems = [
      URLQueryItem(name: "video-id", value: videoId),
      URLQueryItem(name: "external", value: "true")
    ]

    guard let deepLinkUrl = components.url else {
      hostErrorView(
        message: NSLocalizedString("share_error_deeplink_failed", comment: ""),
        error: nil
      )
      return
    }

    let contentVC = UIHostingController(
      rootView: ShareExtensionView(
        close: { [weak self] in self?.close() },
        deepLinkURL: deepLinkUrl
      )
    )

    contentVC.view.backgroundColor = .clear
    contentVC.view.isOpaque = false

    addChild(contentVC)
    view.addSubview(contentVC.view)
    contentVC.view.translatesAutoresizingMaskIntoConstraints = false

    NSLayoutConstraint.activate([
      contentVC.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      contentVC.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      contentVC.view.topAnchor.constraint(equalTo: view.topAnchor),
      contentVC.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
    ])

    contentVC.didMove(toParent: self)
  }

  private func hostErrorView(message: String, error: Error?) {
    let vc = UIHostingController(
      rootView: ShareErrorView(message: message) { [weak self] in
        self?.close(isSuccess: false, error: error)
      }
    )

    vc.view.backgroundColor = .clear
    vc.view.isOpaque = false

    addChild(vc)
    view.addSubview(vc.view)
    vc.view.translatesAutoresizingMaskIntoConstraints = false

    NSLayoutConstraint.activate([
      vc.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      vc.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      vc.view.topAnchor.constraint(equalTo: view.topAnchor),
      vc.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
    ])

    vc.didMove(toParent: self)
  }

  func extractYouTubeVideoId(from urlString: String) -> String? {
    guard let url = URL(string: urlString) else { return nil }
    let host = url.host ?? ""

    if host.contains("youtu.be") {
      let parts = url.path.split(separator: "/").map(String.init)
      if parts.count >= 2, parts[0] == "shorts" { return parts[1] }
      return parts.first
    }

    if host.contains("youtube.com") {
      let parts = url.path.split(separator: "/").map(String.init)
      if parts.count >= 2, parts[0] == "shorts" { return parts[1] }

      let comps = URLComponents(url: url, resolvingAgainstBaseURL: false)
      return comps?.queryItems?.first(where: { $0.name == "v" })?.value
    }

    return nil
  }

  private func setSheetHeight(height: CGFloat) {
    let targetH = max(1, height)
    preferredContentSize = CGSize(width: 0, height: targetH)

    guard let sheet = sheetPresentationController else { return }
    if #available(iOS 16.0, *) {
      let id = UISheetPresentationController.Detent.Identifier("compact")
      let compact = UISheetPresentationController.Detent.custom(identifier: id) { _ in targetH }
      sheet.detents = [compact]
      sheet.selectedDetentIdentifier = id
      sheet.prefersGrabberVisible = false
      sheet.prefersScrollingExpandsWhenScrolledToEdge = false
    }
  }

  private func makePresentationContainerTransparentIfPossible() {
    var v: UIView? = view
    while let s = v?.superview {
      s.backgroundColor = .clear
      s.isOpaque = false
      v = s
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
