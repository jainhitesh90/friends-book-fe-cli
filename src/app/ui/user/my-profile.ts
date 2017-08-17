import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { SocialUserModel } from '../../models/social-user-model'
import { FeedModel } from '../../models/feed.model'
import { AuthService } from "angular2-social-login";
import { BaseComponent } from './base-component'

declare var gapi: any;

@Component({
	moduleId: module.id,
	templateUrl: '../../templates/user/my-profile.html',
	styleUrls: ['../../styles/user/my-profile.css']
})

export class MyProfileComponent extends BaseComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	socialUserModel: SocialUserModel
	feeds: FeedModel[]
	bookmarkItems: string[]
	fetchingProfile: boolean
	fetchingFeeds: boolean
	mobileView: boolean

	constructor(appComponent: AppComponent, router: Router, private apiService: ApiService) {
		super()
		this.appComponent = appComponent
		this.router = router
	}

	ngOnInit() {
		if (super.isTokenAvailable) {
			if (screen.width < 737) {
				this.mobileView = true
				this.getProfile()
			}
			else {
				this.mobileView = false
			}
			this.fetchMyFeeds()

		} else {
			this.router.navigate(['/login'])
		}
	}

	fetchMyFeeds() {
		var thisObject = this
		this.fetchingFeeds = true
		this.apiService.getMyFeeds()
			.then(response => this.feeds = response)
			.then(response => this.fetchingFeeds = false)
			.catch(function (e) {
				thisObject.fetchingFeeds = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	getProfile() {
		var thisObject = this
		this.fetchingProfile = true
		this.apiService.getProfile()
			.then(response => this.socialUserModel = response)
			.then(response => this.fetchingProfile = false)
			.catch(function (e) {
				thisObject.fetchingProfile = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}
}