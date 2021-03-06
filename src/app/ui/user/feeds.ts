import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, NgZone } from '@angular/core'
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

export class FeedsComponent implements OnInit, OnDestroy {

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
	lastFeeds: boolean
	requestNewFeeds: boolean

	selectedFeedCategory : string

	onChange(selectedItem: any) {
		this.initialize()
		this.selectedFeedCategory = selectedItem
		this.fetchFeeds(this.selectedFeedCategory)
	}

	constructor(appComponent: AppComponent, private userComponent: UserComponent, router: Router, private apiService: ApiService, private pushNotificationService: PushNotificationService, private zone: NgZone) {
		this.appComponent = appComponent
		this.router = router
		this.initialize()
		window.onscroll = () => {
			let windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			let body = document.body, html = document.documentElement;
			let docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			let windowBottom = windowHeight + window.pageYOffset;
			if (windowBottom >= docHeight) {
				if (!this.lastFeeds && this.requestNewFeeds)
					this.fetchFeeds(this.selectedFeedCategory)
			}
		};
	}

	ngOnInit() {
		window.scrollTo(0, 0)
		if (new Utils().isTokenAvailable()) {
			this.newFeed = new FeedModel()
			this.fetchFeeds('allFeeds')
			this.pushNotificationService.requestNotificationPermission();
			if (localStorage.getItem('newUser') == 'true')
				this.newUser = true
		} else {
			this.router.navigate(['/login'])
		}
	}

	ngAfterViewInit() {
		this.userComponent.setSelectedIconBg(1)
	}

	fileAdded() {
		var file = this.imageFileInput.nativeElement.files[0]
		if (file != null)
			this.fileName = file.name
	}

	uploadFeed() {
		if (this.newFeed.description != null && this.newFeed.description != '') {
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
		} else {
			this.appComponent.showErrorMessage("Please describe your post")
		}
	}

	uploadFeedResponse() {
		this.uploadingFeed = false
		this.appComponent.showSuccessMessage('Posted successfully!')
		this.newFeed.description = ''
		this.fileName = null
	}

	fetchFeeds(type: string) {
		this.pageNumber = this.pageNumber + 1
		var thisObject = this
		this.fetchingFeeds = true
		this.requestNewFeeds = false
		switch (type) {
			case 'allFeeds':
				this.apiService.getAllFeeds(this.pageNumber)
					.then(response => this.zone.run(() => { this.feedResponse(response) }))
					.catch(function (e) {
						thisObject.errorResponse(e)
					})
				break;
			case 'friendsFeeds':
				this.apiService.getMyFriendsFeeds(this.pageNumber)
					.then(response => this.zone.run(() => { this.feedResponse(response) }))
					.catch(function (e) {
						thisObject.errorResponse(e)
					})
				break;
		}
	}

	errorResponse(e: any) {
		this.lastFeeds = true
		this.fetchingFeeds = false
		this.requestNewFeeds = true
		this.appComponent.showErrorMessage(e)
	}

	feedResponse(response: any) {
		this.requestNewFeeds = true
		var newFeedlength = response.length
		if (newFeedlength < 10) {
			this.lastFeeds = true
		}
		if (this.feeds == null)
			this.feeds = new Array()
		for (var i = 0; i < newFeedlength; i++) {
			this.feeds.push(response[i])
		}
		this.retrieveBookmarkArray(this.feeds)
		this.fetchingFeeds = false
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

	initialize() {
		this.selectedFeedCategory = 'allFeeds'
		this.feeds = null
		this.pageNumber = -1
		this.lastFeeds = false
		/* request new paginated feeds only if previous request is successful (later on replace this with rxJs) */
		this.requestNewFeeds = true
	}

	ngOnDestroy() {
		window.onscroll = () => {
			//empty function to over ride pagination when destroyed
		}
	}
}