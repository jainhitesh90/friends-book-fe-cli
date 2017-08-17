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

export class FeedsReactionModal implements CloseGuard, ModalComponent<CustomTermsModalContext> {
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
        dialog.setCloseGuard(this)
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
        this.showDetails = true
    }

    closeModal() {
        this.dialog.close(true)
    }

}