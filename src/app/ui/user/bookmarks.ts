import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AppComponent } from '../../app-component'
import { UserComponent } from './user-component'
import { ApiService } from '../../apiServices/api.service'
import { FeedModel } from '../../models/feed.model'
import { Utils } from '../../utils/utils'

@Component({
	templateUrl: '../../templates/user/bookmark.html',
	styleUrls: ['../../styles/user/bookmark.css']
})

export class BookmarkComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	searchText: string
	feeds: FeedModel[]
	bookmarkedFeedsId: string[]
	fetchingBookmarks: boolean

	constructor(appComponent: AppComponent, private userComponent: UserComponent, router: Router, private apiService: ApiService) {
		this.appComponent = appComponent
		this.router = router
	}

	ngOnInit(): void {
		window.scrollTo(0,0)
		if (new Utils().isTokenAvailable()) {
			this.fetchBookmarks()
		} else {
			this.router.navigate(['/login'])
		}
	}

	ngAfterViewInit() {
		this.userComponent.setSelectedIconBg(4)
	}

	fetchBookmarks() {
		this.bookmarkedFeedsId = JSON.parse(localStorage.getItem("bookmarkList"))
		if (this.bookmarkedFeedsId != null && this.bookmarkedFeedsId.length > 0) {
			var thisObject = this
			this.fetchingBookmarks = true
			this.apiService.getFeedsByIds(this.bookmarkedFeedsId)
				.then(response => this.feeds = response)
				.then(response => this.fetchingBookmarks = false)
				.then(response => this.retrieveBookmarkArray())
				.catch(function (e) {
					thisObject.fetchingBookmarks = false
					thisObject.appComponent.showErrorMessage(e)
				})
		}
	}

	retrieveBookmarkArray() {
		for (var i = 0; i < this.feeds.length; i++) {
				//if (bookmarkItems.indexOf(this.feeds[i]._id) > -1)
					this.feeds[i].bookmarked = true
		}
		// var bookmarkItems = JSON.parse(localStorage.getItem("bookmarkList"))
		// if (bookmarkItems != null)
		// 	for (var i = 0; i < this.feeds.length; i++) {
		// 		if (bookmarkItems.indexOf(this.feeds[i]._id) > -1)
		// 			this.feeds[i].bookmarked = true
		// 	}
	}

	public childComponentResponse(event: any) {
		var feedModel = JSON.parse(event)
		for (var i = 0; i < this.feeds.length; i++) {
			if (this.feeds[i]._id === feedModel._id)
				this.feeds.splice(i, 1)
		}
		// var index = this.feeds.indexOf(feedModel)
		// if (index > -1)
		// 	this.feeds.splice(index, 1)
		this.userComponent.updateBookmarkCount()
	}

	share(feedModel: FeedModel) {
		feedModel.showShareOptions = !feedModel.showShareOptions
	}
}