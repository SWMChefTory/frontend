//
//  VoiceCommandBridge.swift
//  app
//
//  Created by 황교준 on 12/15/25.
//

import Foundation
import React

@objc(VoiceCommandBridge)
class VoiceCommandBridge: NSObject {
  private let suiteName = "group.com.cheftory.cheftory"
  private let key = "pendingVoiceCommand"

  @objc static func requiresMainQueueSetup() -> Bool { false }

  @objc(getPendingVoiceCommand:rejecter:)
  func getPendingVoiceCommand(_ resolve: RCTPromiseResolveBlock,
                              rejecter reject: RCTPromiseRejectBlock) {
    guard let defaults = UserDefaults(suiteName: suiteName) else {
      resolve(nil); return
    }
    let cmd = defaults.dictionary(forKey: key)
    if cmd != nil { defaults.removeObject(forKey: key) }
    resolve(cmd)
  }
}

