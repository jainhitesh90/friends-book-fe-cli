import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { AppComponent } from '../../app-component'
import { UserComponent } from './user-component'
import { Utils } from '../../utils/utils'
import { ApiService } from '../../apiServices/api.service'
import { FeedModel } from '../../models/feed.model'
import { PushNotificationService } from '../../apiServices/push-notification.service'

@Component({
	templateUrl: '../../templates/user/feeds.html',
	styleUrls: ['../../styles/user/feeds.css']
})

export class FeedsComponent implements OnInit {

	@ViewChild('imageFileInput') imageFileInput: ElementRef
	@ViewChild('videoFileInput') videoFileInput: ElementRef

	router: Router
	appComponent: AppComponent

	/* new Post */
	newFeed: FeedModel
	uploadingFeed: boolean
	fileName: string
	posting: boolean

	/* Feeds list */
	feeds: FeedModel[]
	pageNumber: number
	fetchingFeeds: boolean
	newUser: boolean
	lastFeeds : boolean
	
	selectedFeedCategory = 'allFeeds'

	onChange(selectedItem: any) {
		this.reInitialize()
		switch (selectedItem) {
			case 'friendsFeeds':
				this.fetchFriendsFeeds()
				break;
			case 'allFeeds':
				this.fetchAllFeeds()
				break;
		}
	}

	constructor(appComponent: AppComponent, private userComponent: UserComponent, router: Router, private apiService: ApiService, private pushNotificationService: PushNotificationService) {
		this.appComponent = appComponent
		this.router = router
		userComponent.setSelectedIconBg(1)
		this.pageNumber = -1
		this.lastFeeds = false
		window.onscroll = () => {
			let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			let body = document.body, html = document.documentElement;
			let docHeight = Math.max(body.scrollHeight,
				body.offsetHeight, html.clientHeight,
				html.scrollHeight, html.offsetHeight);
			let windowBottom = windowHeight + window.pageYOffset;
			if (windowBottom >= docHeight) {
				if(!this.lastFeeds)
					this.fetchAllFeeds()
			}
		};
	}

	ngOnInit() {
		window.scrollTo(0,0)
		if (new Utils().isTokenAvailable()) {
			this.newFeed = new FeedModel()
			this.fetchAllFeeds()
			this.pushNotificationService.requestNotificationPermission();
			if (localStorage.getItem('newUser') == 'true')
				this.newUser = true
		} else {
			this.router.navigate(['/login'])
		}
	}

	fileAdded() {
		var file = this.imageFileInput.nativeElement.files[0]
		if (file != null)
			this.fileName = file.name
	}

	uploadFeed() {
		var thisObject = this
		var fileToUpload = null
		let fileImage = this.imageFileInput.nativeElement;
		if (fileImage.files && fileImage.files[0]) {
			if (fileImage.files[0].type.indexOf('image') !== -1) {
				this.newFeed.contentType = "image"
				this.newFeed.content = fileImage.files[0];
			} else if (fileImage.files[0].type.indexOf('video') !== -1) {
				this.newFeed.contentType = "video"
				this.newFeed.content = fileImage.files[0];
			}
		} else {
			this.newFeed.contentType = "text"
		}
		this.newFeed.feedType = "post"
		this.uploadingFeed = true
		this.apiService.addFeed(this.newFeed)
			.then(response => this.uploadFeedResponse())
			.catch(function (e) {
				thisObject.appComponent.showErrorMessage(e)
				thisObject.uploadingFeed = false
			})
	}

	uploadFeedResponse() {
		this.uploadingFeed = false
		this.appComponent.showSuccessMessage('Posted successfully!')
		this.newFeed.title = ''
		this.fileName = null
	}

	fetchAllFeeds() {
		this.pageNumber  = this.pageNumber + 1
		var thisObject = this
		this.fetchingFeeds = true
		this.apiService.getAllFeeds(this.pageNumber)
			.then(response => this.feedResponse(response))
			.catch(function (e) {
				thisObject.fetchingFeeds = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	fetchFriendsFeeds() {
		this.pageNumber  = this.pageNumber + 1
		var thisObject = this
		this.fetchingFeeds = true
		this.apiService.getMyFriendsFeeds(this.pageNumber)
			.then(response => this.feedResponse(response))
			.catch(function (e) {
				thisObject.fetchingFeeds = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	feedResponse(response: any) {
		if (this.feeds == null)
			this.feeds = response
		else
			this.appendNewItems(response)
		this.retrieveBookmarkArray(this.feeds)
	}

	appendNewItems(newFeeds: FeedModel[]) {
		var len = newFeeds.length
		if (len < 5)
			this.lastFeeds = true
		for (var i = 0; i < length; i++) {
			this.feeds.push(newFeeds[i])
		}
	}

	retrieveBookmarkArray(feeds: FeedModel[]) {
		var bookmarkItems = JSON.parse(localStorage.getItem("bookmarkList"))
		if (bookmarkItems != null)
			for (var i = 0; i < feeds.length; i++) {
				if (bookmarkItems.indexOf(feeds[i]._id) > -1)
					feeds[i].bookmarked = true
			}
	}

	public childFeedComponentResponse() {
		this.userComponent.updateBookmarkCount()
	}

	dismissAlert() {
		this.newUser = false
		localStorage.removeItem('newUser')
	}

	reInitialize(){
		this.feeds = null
		this.pageNumber = -1
		this.lastFeeds = false
	}
}