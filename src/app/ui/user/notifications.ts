import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { NotificationModel } from '../../models/notification-model'
import { AuthService } from "angular2-social-login";
import { BaseComponent } from './base-component'
declare var gapi: any;

@Component({
	moduleId: module.id,
	templateUrl: '../../templates/user/notifications.html',
	styleUrls: ['../../styles/user/notifications.css']
})

export class NotificationsComponent extends BaseComponent implements OnInit {

	@ViewChild('fileInput') fileInput: ElementRef

	router: Router
	appComponent: AppComponent
	notifications: NotificationModel[]
	fetchingNotifications: boolean

	constructor(appComponent: AppComponent, router: Router, private apiService: ApiService) {
		super()
		this.appComponent = appComponent
		this.router = router
	}

	ngOnInit() {
		if (super.isTokenAvailable()) {
			this.getNotifications()
		} else {
			this.router.navigate(['/login'])
		}
	}

	getNotifications() {
		var thisObject = this
		this.fetchingNotifications = true
		this.apiService.getNotifications()
			.then(response => this.notifications = response)
			.then(response => this.fetchingNotifications = false)
			.catch(function (e) {
				thisObject.fetchingNotifications = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	openNotification(notification: NotificationModel) {
		if (notification.redirectUrl != null) {
			window.open(notification.redirectUrl, '_self')  //external link
		} else if (notification.routeUrl != null) {
			this.router.navigateByUrl(notification.routeUrl) //internal route
		}
	}
}