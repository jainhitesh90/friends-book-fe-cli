import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
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
	newFeed: FeedModel
	feeds: FeedModel[]
	fetchingFeeds: boolean
	newUser: boolean
	uploadingFeed : boolean
	fileName : string
	posting : boolean

	selectedFeedCategory = 'allFeeds'

	onChange(selectedItem: any) {
		switch (selectedItem) {
			case 'friendsFeeds':
				this.friendsFeeds()
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
	}

	ngOnInit() {
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

	friendsFeeds() {
		var thisObject = this
		this.fetchingFeeds = true
		this.apiService.getMyFriendsFeeds()
			.then(response => this.feedResponse(response))
			.catch(function (e) {
				thisObject.fetchingFeeds = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	fetchAllFeeds() {
		var thisObject = this
		this.fetchingFeeds = true
		this.apiService.getAllFeeds()
			.then(response => this.feedResponse(response))
			.catch(function (e) {
				thisObject.fetchingFeeds = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	feedResponse(response: any) {
		this.feeds = response
		this.retrieveBookmarkArray()
		this.fetchingFeeds = false
	}

	retrieveBookmarkArray() {
		var bookmarkItems = JSON.parse(localStorage.getItem("bookmarkList"))
		if (bookmarkItems != null)
			for (var i = 0; i < this.feeds.length; i++) {
				if (bookmarkItems.indexOf(this.feeds[i]._id) > -1)
					this.feeds[i].bookmarked = true
			}
	}

	public childFeedComponentResponse() {
		this.userComponent.updateBookmarkCount()
	}

	dismissAlert() {
		this.newUser = false
		localStorage.removeItem('newUser')
	}
}