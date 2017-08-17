import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { SocialUserModel } from '../../models/social-user-model'
import { FeedModel } from '../../models/feed.model'
import { AuthService } from "angular2-social-login";
import { Utils } from '../../utils/utils'

@Component({
	moduleId: module.id,
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

	// toggelLike(feed: FeedModel) {
	// 	if (!feed.hasLiked) {
	// 		++feed.likesCount
	// 		this.apiService.likeFeed(feed)
	// 			.then(response => console.log("response : " + response))
	// 			.catch(function (e) {
	// 				--feed.likesCount
	// 				console.log("Error : " + e)
	// 			})
	// 	} else {
	// 		--feed.likesCount
	// 		this.apiService.unLikeFeed(feed)
	// 			.then(response => console.log("response : " + response))
	// 			.catch(function (e) {
	// 				++feed.likesCount
	// 				console.log("Error : " + e)
	// 			})
	// 	}
	// 	feed.hasLiked = !feed.hasLiked //toggle in FE
	// }

	// toggleCommentButton(feed: FeedModel) {
	// 	feed.disableComment = !feed.disableComment //toggle in FE
	// }

	// addComment(feed: FeedModel) {
	// 	if (feed.newComment != null && feed.newComment != '') {
	// 		var thisObject = this
	// 		++feed.commentsCount
	// 		this.apiService.commentFeed(feed)
	// 			.then(response => feed.newComment == '')
	// 			.then(response => this.toggleCommentButton(feed))
	// 			.catch(function (e) {
	// 				console.log("Error : " + e)
	// 			})
	// 	} else {
	// 		this.appComponent.showErrorMessage('Comment cant be empty')
	// 	}
	// }

	// toggleFeedDetail(feed: FeedModel) {
	// 	if (!feed.showDetail) {
	// 		if (feed.likesList == null || feed.commentsList == null) {
	// 			var thisObject = this
	// 			this.apiService
	// 				.getFeedLikesAndComments(feed._id)
	// 				.then(response => this.toggleFeedResponse(response, feed))
	// 				.catch(function (e) {
	// 					console.log("Error : " + e)
	// 				})
	// 		} else {
	// 			feed.showDetail = !feed.showDetail
	// 		}
	// 	} else {
	// 		feed.showDetail = !feed.showDetail
	// 	}
	// }

	// toggleFeedResponse(response: FeedModel, feed: FeedModel) {
	// 	feed.likesList = response.likesList
	// 	feed.commentsList = response.commentsList
	// 	feed.showDetail = !feed.showDetail
	// }
}