import { EventEmitter, ViewChild, Component, ViewContainerRef, ViewEncapsulation, ElementRef, Input, Output, OnInit } from '@angular/core'
import { FeedModel } from '../../models/feed.model'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { Router } from '@angular/router'
import { Overlay, overlayConfigFactory } from 'angular2-modal'
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap'
import { CustomTermsModalContext, FeedsReactionModal } from '../../modals/feeds-reaction-modal'

@Component({
	inputs: ['feed'],
	selector: 'feed-component',
	templateUrl: '../../templates/custom-components/feed-component.html',
	styleUrls: ['../../styles/custom-components/feed-component.css']
})

export class CustomFeedComponent implements OnInit {
	@Input() feedModel: FeedModel
	@Output() callback: EventEmitter<string> = new EventEmitter();

	router: Router
	appComponent: AppComponent
	likeText: string

	constructor(public modal: Modal, appComponent: AppComponent, router: Router, private apiService: ApiService) {
		this.appComponent = appComponent
		this.router = router
	}

	ngOnInit() {
		if (this.feedModel != null && this.feedModel.feedType == 'blog')
			this.likeText = 'Interested'
		else
			this.likeText = 'Like'
	}

	toggelLike(feedModel: FeedModel) {
		if (!feedModel.hasLiked) {
			++feedModel.likesCount
			this.apiService.likeFeed(feedModel)
				.then(response => console.log("response : " + response))
				.catch(function (e) {
					--feedModel.likesCount
					console.log("Error : " + e)
				})
		} else {
			--feedModel.likesCount
			this.apiService.unLikeFeed(feedModel)
				.then(response => console.log("response : " + response))
				.catch(function (e) {
					++feedModel.likesCount
					console.log("Error : " + e)
				})
		}
		feedModel.hasLiked = !feedModel.hasLiked //toggle in FE
	}

	toggleCommentButton(feedModel: FeedModel) {
		feedModel.disableComment = !feedModel.disableComment //toggle in FE
	}

	addComment(feedModel: FeedModel) {
		if (feedModel.newComment != null && feedModel.newComment != '') {
			var thisObject = this
			++feedModel.commentsCount
			this.apiService.commentFeed(feedModel)
				.then(response => feedModel.newComment == '')
				.then(response => this.toggleCommentButton(feedModel))
				.catch(function (e) {
					console.log("Error : " + e)
				})
		} else {
			this.appComponent.showErrorMessage('Comment cant be empty')
		}
	}

	toggleFeedDetail(feedModel: FeedModel) {
		this.modal.open(FeedsReactionModal, overlayConfigFactory({ feedModelString: JSON.stringify(feedModel) }, BSModalContext))
			.then((d) => d.result)
			.then((r) => { console.log(r) },
			(error) => { console.log(error) })
	}

	share(feedModel: FeedModel) {
		feedModel.showShareOptions = !feedModel.showShareOptions
	}

	toogleBookmark(feedModel: FeedModel) {
		feedModel.bookmarked = !feedModel.bookmarked
		var bookmarkItems = []
		if (localStorage.getItem("bookmarkList") != null)
			bookmarkItems = JSON.parse(localStorage.getItem("bookmarkList"))

		/* add or remove from localstorage */
		if (feedModel.bookmarked) {
			bookmarkItems.push(feedModel._id)
		} else {
			var index = bookmarkItems.indexOf(feedModel._id)
			if (index != -1)
				bookmarkItems.splice(index, 1);
		}

		/* update localstorage */
		localStorage.setItem("bookmarkList", JSON.stringify(bookmarkItems))
		this.callback.emit(JSON.stringify(feedModel))
	}

	openProfile(userId: string) {
		this.router.navigate(['/home/visit-profile'], { queryParams: { id: userId } })
	}

	openFeedUrl(feedModel: FeedModel) {
		window.open(feedModel.url, '_new')
	}
}