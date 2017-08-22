import { Component } from '@angular/core'
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal'
import { BSModalContext } from 'angular2-modal/plugins/bootstrap'
import { PlatformLocation } from '@angular/common'
import { FeedModel } from '../models/feed.model'
import { AppComponent } from '../app-component'
import { ApiService } from '../apiServices/api.service'

export class CustomTermsModalContext extends BSModalContext {
    public feedModelString: string
}

@Component({
    templateUrl: '../templates/modals/feeds-reaction-modal.html',
    styleUrls: ['../styles/modals/feeds-reaction-modal.css']
})

export class FeedsReactionModal implements ModalComponent<CustomTermsModalContext> {
    context: CustomTermsModalContext;
    feed: FeedModel
    showDetails: boolean
    response : any

    constructor(public dialog: DialogRef<CustomTermsModalContext>, private apiService: ApiService) {
        this.context = dialog.context;
        this.feed = JSON.parse(this.context.feedModelString)
        if (this.feed.likesList == null || this.feed.commentsList == null)
            this.getDetails()
        else
            this.showDetails = true
    }

    getDetails() {
        var thisObject = this
        this.apiService
            .getFeedLikesAndComments(this.feed._id)
            .then(response => this.toggleFeedResponse(response, this.feed))
            .catch(function (e : any) {
                console.log("Error : " + e)
            })
    }

    toggleFeedResponse(response: FeedModel, feedModel: FeedModel) {
        feedModel.likesList = response.likesList
        feedModel.commentsList = response.commentsList
        if (feedModel.feedType == 'event') {
            if (feedModel.likesList.length == 0) {
                feedModel.activity_line = ''
            } else if (feedModel.likesList.length == 1) {
                feedModel.activity_line = feedModel.likesList[0]['feedOwner']['name'] + ' is interested in the event'
            } else if (feedModel.likesList.length == 2) {
                feedModel.activity_line = feedModel.likesList[0]['feedOwner']['name'] + ' and ' + feedModel.likesList[1]['feedOwner']['name'] + ' are interested in the event'
            } else {
                feedModel.activity_line = feedModel.likesList[0]['feedOwner']['name'] + ' and ' + (feedModel.likesList.length - 1) + ' others are interested in the event'
            }
        } else {
            if (feedModel.likesList.length == 0) {
                feedModel.activity_line = ''
            } else if (feedModel.likesList.length == 1) {
                feedModel.activity_line = feedModel.likesList[0]['feedOwner']['name'] + ' liked the post'
            } else if (feedModel.likesList.length == 2) {
                feedModel.activity_line = feedModel.likesList[0]['feedOwner']['name'] + ' and ' + feedModel.likesList[1]['feedOwner']['name'] + ' liked the post'
            } else {
                feedModel.activity_line = feedModel.likesList[0]['feedOwner']['name'] + ' and ' + (feedModel.likesList.length - 1) + ' others liked the post'
            }
        }
        this.showDetails = true
    }

    closeModal() {
        this.dialog.close(true)
    }
}