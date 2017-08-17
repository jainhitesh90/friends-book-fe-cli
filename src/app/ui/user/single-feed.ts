import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AppComponent } from '../../app-component'
import { UserComponent } from './user-component'
import { Utils } from '../../utils/utils'
import { ApiService } from '../../apiServices/api.service'
import { FeedModel } from '../../models/Feed.model'

@Component({
	moduleId: module.id,
	templateUrl: '../../templates/user/single-feed.html'
})

export class SingleFeedComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	feed: FeedModel
	fetchingFeed: boolean
	feedId: string

	constructor(appComponent: AppComponent, private userComponent: UserComponent, router: Router, private apiService: ApiService, private activatedRoute: ActivatedRoute) {
		this.appComponent = appComponent
		this.router = router
	}

	ngOnInit() {
		if (new Utils().isTokenAvailable()) {
			this.activatedRoute.queryParams.subscribe(params => {
				this.checkQueryParamResponse(params)
			});
		} else {
			this.router.navigate(['/login'])
		}
	}

	private checkQueryParamResponse(params: any) {
		this.feedId = params['id']
		if (null != this.feedId && this.feedId.length > 0) {
			this.fetchFeed()
		} else {
			console.log("Something went wrong")
		}
	}

	fetchFeed() {
		var thisObject = this
		this.fetchingFeed = true
		this.apiService.getSingleFeedsById(this.feedId)
			.then(response => this.feed = response)
			.then(response => this.fetchingFeed = false)
			.catch(function (e) {
				thisObject.fetchingFeed = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}
}