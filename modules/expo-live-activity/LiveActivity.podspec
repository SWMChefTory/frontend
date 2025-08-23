Pod::Spec.new do |s|
  s.name          = 'LiveActivity'
  s.version       = '0.1.0'
  s.summary       = 'Live Activity Expo module'
  s.description   = 'Live Activity integration for Expo Modules'
  s.homepage      = 'https://example.com/expo-live-activity'
  s.license       = { :type => 'MIT' }
  s.authors       = { 'Your Name' => 'you@example.com' }
  s.source        = { :path => '.' }
  s.platforms     = { :ios => '17.0' }
  s.swift_version = '5.0'
  s.source_files  = 'ios/**/*.{h,m,mm,swift}'
  s.dependency    'ExpoModulesCore'
  
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
