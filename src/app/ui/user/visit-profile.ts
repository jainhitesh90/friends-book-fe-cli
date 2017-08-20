import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { SocialUserModel } from '../../models/social-user-model'
import { FeedModel } from '../../models/feed.model'
import { AuthService } from "angular2-social-login";
import { Utils } from '../../utils/utils'

@Component({
	templateUrl: '../../templates/user/visit-profile.html',
	styleUrls: ['../../styles/user/visit-profile.css']
})

export class VisitProfileComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	socialUserModel: SocialUserModel
	feeds: FeedModel[]
	private activatedRoute: ActivatedRoute
	userId: string
	fetchingProfile : boolean
	fetchingFeeds : boolean

	constructor(appComponent: AppComponent, router: Router, private apiService: ApiService, activatedRoute: ActivatedRoute) {
		this.appComponent = appComponent
		this.router = router
		this.activatedRoute = activatedRoute
	}

	ngOnInit(): void {
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
		if (null != this.userId && this.userId.length > 0) {
			this.getUserProfile()
			this.fetchUsersFeeds()
		} else {
			console.log("Something went wrong")
		}
	}

	getUserProfile() {
		var thisObject = this
		this.fetchingProfile = true
		this.apiService.getUsersProfile(Number(this.userId))
			.then(response => this.socialUserModel = response)
			.then(response => this.fetchingProfile = false)
			.catch(function (e) {
				thisObject.fetchingProfile = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	fetchUsersFeeds() {
		var thisObject = this
		this.fetchingFeeds = true
		this.apiService.getUsersFeeds(Number(this.userId))
			.then(response => this.feeds = response)
			.then(response => this.fetchingFeeds = false)
			.catch(function (e) {
				thisObject.fetchingFeeds = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}
}