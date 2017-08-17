import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { FeedModel } from '../../models/feed.model'
import { AuthService } from "angular2-social-login";
import { Utils } from '../../utils/utils'

@Component({
	templateUrl: '../../templates/user/search-page.html'
})

export class SearchComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	searchText: string
	feeds: FeedModel[]
	category: string
	private activatedRoute: ActivatedRoute
	fetchingSearchResult: boolean

	constructor(appComponent: AppComponent, router: Router, private apiService: ApiService, activatedRoute: ActivatedRoute) {
		this.appComponent = appComponent
		this.router = router
		this.activatedRoute = activatedRoute
	}

	ngOnInit(): void {
		if (new Utils().isTokenAvailable()) {
			this.router.navigate(['/login'])
		} else {
			this.activatedRoute.queryParams.subscribe(params => {
				this.searchText = params['search']
				if (this.searchText != null && this.searchText.length != 0)
					this.search()
			});
		}
	}

	search() {
		if (this.searchText == null || this.searchText.length == 0)
			this.appComponent.showErrorMessage("Please enter text to search")
		else {
			var thisObject = this
			this.fetchingSearchResult = true
			this.apiService.searchFeed(this.searchText)
				.then(response => this.feeds = response)
				.then(response => this.fetchingSearchResult = false)
				.catch(function (e) {
					thisObject.fetchingSearchResult = false
					thisObject.appComponent.showErrorMessage(e)
				})
		}
	}
}