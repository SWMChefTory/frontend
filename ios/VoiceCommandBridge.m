  //
//  VoiceCommandBridge.m
//  app
//
//  Created by 황교준 on 12/15/25.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VoiceCommandBridge, NSObject)
RCT_EXTERN_METHOD(getPendingVoiceCommand:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
