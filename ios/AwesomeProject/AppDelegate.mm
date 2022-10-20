#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <React/RCTAppSetupUtils.h>

// Add this import at the top (before #if RCT_NEW_ARCH_ENABLED)
#import <MarketingCloudSDK/MarketingCloudSDK.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

static NSString *const kRNConcurrentRoot = @"concurrentRoot";

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  MarketingCloudSDKConfigBuilder *mcsdkBuilder = [MarketingCloudSDKConfigBuilder new];
  [mcsdkBuilder sfmc_setApplicationId:@"7d957421-1c78-4eb4-b08e-ea6d2394a3e9"];
  [mcsdkBuilder sfmc_setAccessToken:@"byuyTVJNdyv79JqsUprcBtR2"];
  [mcsdkBuilder sfmc_setAnalyticsEnabled:@(YES)];
  [mcsdkBuilder sfmc_setMarketingCloudServerUrl:@"https://mchl2nbhxv6-wy1sw36p75pysf08.device.marketingcloudapis.com/"];
  [mcsdkBuilder sfmc_setDelayRegistrationUntilContactKeyIsSet:@(YES)];
  [mcsdkBuilder sfmc_setMid:@("7290728")];
  
  NSError *error = nil;
  BOOL success =
  [[MarketingCloudSDK sharedInstance] sfmc_configureWithDictionary:[mcsdkBuilder sfmc_build]
                                                             error:&error];
  
  if (success == YES) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (@available(iOS 10, *)) {
        // set the UNUserNotificationCenter delegate - the delegate must be set here in
        // didFinishLaunchingWithOptions
        [UNUserNotificationCenter currentNotificationCenter].delegate = self;
        [[UIApplication sharedApplication] registerForRemoteNotifications];
        
        [[UNUserNotificationCenter currentNotificationCenter]
         requestAuthorizationWithOptions:UNAuthorizationOptionAlert |
         UNAuthorizationOptionSound |
         UNAuthorizationOptionBadge
         completionHandler:^(BOOL granted, NSError *_Nullable error) {
          if (error == nil) {
            if (granted == YES) {
              dispatch_async(dispatch_get_main_queue(), ^{
              });
            }
          }
        }];
      } else {
        
#if __IPHONE_OS_VERSION_MIN_REQUIRED < 100000
        UIUserNotificationSettings *settings = [UIUserNotificationSettings
                                                settingsForTypes:UIUserNotificationTypeBadge | UIUserNotificationTypeSound |
                                                UIUserNotificationTypeAlert
                                                categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
#endif
        [[UIApplication sharedApplication] registerForRemoteNotifications];
      }
    });
  } else {
    //  MarketingCloudSDK sfmc_configure failed
    os_log_debug(OS_LOG_DEFAULT, "MarketingCloudSDK sfmc_configure failed with error = %@",
                 error);
  }
  
  // RN setup
  RCTAppSetupPrepareApp(application);

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

#if RCT_NEW_ARCH_ENABLED
  _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
  _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
  _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
  _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
  bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
#endif

  NSDictionary *initProps = [self prepareInitialProps];
  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"AwesomeProject", initProps);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;

}

- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[MarketingCloudSDK sharedInstance] sfmc_setDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application
    didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    os_log_debug(OS_LOG_DEFAULT, "didFailToRegisterForRemoteNotificationsWithError = %@", error);
}

// The method will be called on the delegate when the user responded to the notification by opening
// the application, dismissing the notification or choosing a UNNotificationAction. The delegate
// must be set before the application returns from applicationDidFinishLaunching:.
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler {
    // tell the MarketingCloudSDK about the notification
    [[MarketingCloudSDK sharedInstance] sfmc_setNotificationRequest:response.notification.request];

    if (completionHandler != nil) {
        completionHandler();
    }
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:
             (void (^)(UNNotificationPresentationOptions options))completionHandler {
    NSLog(@"User Info : %@", notification.request.content.userInfo);
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert |
                      UNAuthorizationOptionBadge);
}

// This method is REQUIRED for correct functionality of the SDK.
// This method will be called on the delegate when the application receives a silent push

- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    [[MarketingCloudSDK sharedInstance] sfmc_setNotificationUserInfo:userInfo];

    completionHandler(UIBackgroundFetchResultNewData);
}


/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feture is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  // Switch this bool to turn on and off the concurrent root
  return true;
}

- (NSDictionary *)prepareInitialProps
{
  NSMutableDictionary *initProps = [NSMutableDictionary new];

#ifdef RCT_NEW_ARCH_ENABLED
  initProps[kRNConcurrentRoot] = @([self concurrentRootEnabled]);
#endif

  return initProps;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end
