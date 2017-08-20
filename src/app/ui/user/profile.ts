import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { SocialUserModel } from '../../models/social-user-model'
import { FeedModel } from '../../models/feed.model'
import { AuthService } from "angular2-social-login";
import { Utils } from '../../utils/utils'
import { UserComponent } from './user-component'

@Component({
	templateUrl: '../../templates/user/profile.html',
	styleUrls: ['../../styles/user/profile.css']
})

export class ProfileComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	socialUserModel: SocialUserModel
	feeds: FeedModel[]
	bookmarkItems: string[]
	fetchingProfile: boolean
	fetchingFeeds: boolean
	mobileView: boolean

	userId: string
	myProfile : boolean

	constructor(appComponent: AppComponent, private userComponent: UserComponent, router: Router, private apiService: ApiService, private activatedRoute: ActivatedRoute) {
		this.appComponent = appComponent
		this.router = router
		userComponent.setSelectedIconBg(2)
	}

	ngOnInit() {
		window.scrollTo(0,0)
		if (new Utils().isTokenAvailable()) {
			this.activatedRoute.queryParams.subscribe(params => {
				this.checkQueryParamResponse(params)
			});
		} else {
			this.router.navigate(['/login'])
		}
	}

	private checkQueryParamResponse(params: any) {
		this.userId = params['id']
		console.log("this.userId : " + this.userId == null)
		if (undefined == this.userId || null == this.userId || this.userId.length == 0) {
			this.myProfile = true
		} else {
			this.myProfile = false
		}
		this.getProfile()
		this.fetchFeeds()
	}

	getProfile() {
		var thisObject = this
		this.fetchingProfile = true
		this.apiService.getUsersProfile(this.userId)
			.then(response => this.socialUserModel = response)
			.then(response => this.fetchingProfile = false)
			.catch(function (e) {
				thisObject.fetchingProfile = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	fetchFeeds() {
		var thisObject = this
		this.fetchingFeeds = true
		this.apiService.getUsersFeeds(this.userId)
			.then(response => this.feeds = response)
			.then(response => this.fetchingFeeds = false)
			.catch(function (e) {
				thisObject.fetchingFeeds = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	navigateToHome() {
		this.router.navigate(['/home/feeds'])
	}

	logout() {
        localStorage.clear()
        this.router.navigate(['/login'])
    }
}