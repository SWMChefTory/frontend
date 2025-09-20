Pod::Spec.new do |s|
  s.name          = 'LiveActivity'
  s.version       = '0.1.0'
  s.summary       = 'Live Activity Expo module'
  s.description   = 'Live Activity integration for Expo Modules'
  s.homepage      = 'https://example.com/expo-live-activity'
  s.license       = { :type => 'MIT' }
  s.authors       = { 'Your Name' => 'you@example.com' }
  s.source        = { :path => '.' }
  s.source_files  = 'ios/**/*.{h,m,mm,swift}'
  s.dependency    'ExpoModulesCore'

  s.platform     = :ios, '16.1'
  s.ios.deployment_target = '16.1'

  s.weak_frameworks = ['ActivityKit', 'WidgetKit', 'AppIntents', 'SwiftUI']
  
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule',
    'IPHONEOS_DEPLOYMENT_TARGET' => '16.1'  
  }
end
