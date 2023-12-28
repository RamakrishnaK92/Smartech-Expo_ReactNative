//
//  NotificationViewController.m
//  SmartechNCE
//
//  Created by Netcore Solutions on 26/07/22.
//

#import "NotificationViewController.h"
#import <SmartPush/SmartPush.h>

@interface NotificationViewController ()

@property (weak, nonatomic) IBOutlet UIView *customPnView;

@end

@implementation NotificationViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any required interface initialization here.
    self.customView = _customPnView;
}

@end
