#import <React/RCTBridgeDelegate.h>
#import <UserNotifications/UserNotifications.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
