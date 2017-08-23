import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router';
import { Headers, Http, Response, RequestOptions, HttpModule } from '@angular/http'
import { URLSearchParams } from "@angular/http";
import { ApiService } from './api.service'
import { FirebaseApp } from "angularfire2";
import * as firebase from 'firebase';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PushNotificationService {

    private firebaseMessaginInstance: firebase.messaging.Messaging;

    constructor(private router: Router, private http: Http, @Inject(FirebaseApp) private _firebaseApp: firebase.app.App, private apiService: ApiService) {

        this.firebaseMessaginInstance = firebase.messaging(this._firebaseApp);
        let device = this.checkDeviceType();
        let _this = this;

        this.firebaseMessaginInstance.onMessage(function (payload: any) {
            console.log("Notification recieved")
            var options = {
                'body': payload.notification.body,
                'icon': payload.notification.icon,
                'click_action': payload.notification.click_action
            };
            var notification = new Notification(payload.notification.title, options);
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(payload.notification.title, options);
            });
            self.addEventListener('notificationclick', function (event: any) {
                const clickedNotification = event.notification;
                clickedNotification.close();
            });
            notification.onclick = function (event) {
                router.navigate(['/home/notifications'])
            }
        });

        this.firebaseMessaginInstance.onTokenRefresh(function () {
            this.firebaseMessaginInstance.getToken()
                .then(function (refreshedToken: any) {
                    _this.setTokenSentToServer(false);
                    _this.apiService.subscribeNotifications('subscribed', refreshedToken, device);
                }).catch(function (err: string) {
                    console.log('Unable to retrieve refreshed token ', err);
                });
        });

        this.firebaseMessaginInstance.getToken()
            .then(function (fcmToken: any) {
                if (fcmToken) {
                    var checkSentToken = window.localStorage.getItem('pushRegistered')
                    if (!_this.isTokenSentToServer()) {
                        _this.apiService.subscribeNotifications('subscribed', fcmToken, device);
                        _this.setTokenSentToServer(true);
                    }
                } else {
                    _this.setTokenSentToServer(false);
                }
            })
            .catch(function (err) {
                _this.setTokenSentToServer(false);
            });
    }

    checkDeviceType() {
        var ua = navigator.userAgent.toLowerCase(), deviceType = 'desktop', browser = 'chrome';

        /**check for mobile****/
        if (ua.indexOf('android') > -1 || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            deviceType = 'mobile';
        }
        /*check for chrome */
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            browser = 'firefox';
        }
        return deviceType + '-' + browser;
    }

    public setTokenSentToServer(sent: any) {
        window.localStorage.setItem('pushRegistered', sent ? (1).toString() : (0).toString());
    }

    requestNotificationPermission() {
        this.firebaseMessaginInstance.requestPermission()
            .then(() => {
                var thisObject = this
                this.firebaseMessaginInstance.getToken()
                    .then((fcmToken) => {
                        if (fcmToken) {
                            if (!this.isTokenSentToServer()) {
                                let device = this.checkDeviceType();
                                this.apiService.subscribeNotifications('subscribed', fcmToken, device);
                                thisObject.setTokenSentToServer(true);
                            }
                        } else {
                            thisObject.setTokenSentToServer(false);
                        }
                    }).catch(function (err) {
                        console.log("error : " + err)
                        thisObject.setTokenSentToServer(false);
                    });
            })
            .catch((error) => { 
                console.log("requestNotificationPermission error : " + error) 
            });
    }

    private deleteToken() {
        var thisObject = this
        this.firebaseMessaginInstance.getToken()
            .then(function (fcmToken) {
                this.firebaseMessaginInstance.deleteToken(fcmToken)
                    .then(function () {
                        thisObject.setTokenSentToServer(false);
                    })
                    .catch(function (err: any) {
                        console.log('Could not delete token. ', err);
                    });
                // [END delete_token]
            })
            .catch(function (err) {
                console.log('Error retrieving Instance ID token. ', err);
            });
    }

    isTokenSentToServer() {
        var checkToken = parseInt(window.localStorage.getItem('pushRegistered'));
        return checkToken == 1;
    }
}