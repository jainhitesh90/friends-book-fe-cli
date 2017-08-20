import { Headers, Http, Response, RequestOptions, HttpModule } from '@angular/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { FeedModel } from '../models/feed.model'
import { SocialUserModel } from '../models/social-user-model'
import { NotificationModel } from '../models/notification-model'
import 'rxjs/add/operator/toPromise'

declare var Promise: any;

@Injectable()
export class ApiService {

    //baseUrl = 'https://friendsbook.herokuapp.com/'
    baseUrl = 'http://localhost:8080/'

    constructor(private http: Http) {
    }

    userOption(): any {
        var header = new Headers()
        header.append('Content-Type', 'application/json')
        header.append('authToken', localStorage.getItem('authToken'))
        return {
            headers: header, withCredentials: false
        }
    }

    /* User login */
    socialLogin(socialUserModel: SocialUserModel): Promise<SocialUserModel> {
        var loginUrl =  this.baseUrl + 'user/signup'
        var json = {
            'email': socialUserModel.email,
            'name': socialUserModel.name,
            'image': socialUserModel.image,
            'provider': socialUserModel.provider,
            'token': socialUserModel.socialLoginToken,
            'uid': socialUserModel.uid
        }
        return this.http
            .post(loginUrl, json)
            .toPromise()
            .then(this.socialLoginResponse)
            .catch(this.handleError)
    }

    private socialLoginResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as SocialUserModel
                localStorage.setItem("authToken", data.authToken)
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Get all users */
    getFriendSuggestions(): Promise<SocialUserModel[]> {
        var url = this.baseUrl + 'users/friends-suggestion'
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getFriendSuggestionsResponse)
            .catch(this.handleError)
    }

    private getFriendSuggestionsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as SocialUserModel[]
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Get my friends */
    getFriends(): Promise<SocialUserModel[]> {
        var url = this.baseUrl + 'friend/list'
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getFriendsResponse)
            .catch(this.handleError)
    }

    private getFriendsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as SocialUserModel[]
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Add a friend */
    addFriend(socialUserModel:SocialUserModel): Promise<string> {
        var url = this.baseUrl + 'friend/send-request'
        var json = {'id' : socialUserModel._id }
        return this.http
            .post(url, json, this.userOption())
            .toPromise()
            .then(this.addFriendResponse)
            .catch(this.handleError)
    }

    private addFriendResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as string
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Remove a friend */
    unFriend(socialUserModel:SocialUserModel): Promise<string> {
        var url = this.baseUrl + 'friend/un-friend'
        var json = {'id' : socialUserModel._id }
        return this.http
            .post(url, json, this.userOption())
            .toPromise()
            .then(this.unFriendResponse)
            .catch(this.handleError)
    }

    private unFriendResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as string
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Accept friend request*/
    acceptFriend(socialUserModel:SocialUserModel): Promise<string> {
        var url = this.baseUrl + 'friend/accept-request'
        var json = {'id' : socialUserModel._id }
        return this.http
            .post(url, json, this.userOption())
            .toPromise()
            .then(this.acceptFriendResponse)
            .catch(this.handleError)
    }

    private acceptFriendResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as string
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Notification */
    subscribeNotifications(permission: string, fcmToken: string, deviceId: string){
        var addDeviceUrl = this.baseUrl + 'users/addDevice'
        var json = { 'deviceId': deviceId, 'fcmToken' : fcmToken }
        return this.http
            .put(addDeviceUrl, json, this.userOption())
            .toPromise()
            .then(this.subscribeNotificationsResponse)
            .catch(this.handleError)
    } 

    private subscribeNotificationsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                return res.json().message || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* User profile */

    getProfile(): Promise<SocialUserModel> {
        var profileUrl = this.baseUrl + 'users/profile'
        return this.http
            .get(profileUrl, this.userOption())
            .toPromise()
            .then(this.getProfileResponse)
            .catch(this.handleError)
    }

    private getProfileResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as SocialUserModel
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Visit profile of other */

    getUsersProfile(userId : Number): Promise<SocialUserModel> {
        var profileUrl = this.baseUrl + 'users/other-profile/' + userId 
        return this.http
            .get(profileUrl, this.userOption())
            .toPromise()
            .then(this.getUsersProfileResponse)
            .catch(this.handleError)
    }

    private getUsersProfileResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as SocialUserModel
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* User notifications */

    getNotifications(): Promise<NotificationModel[]> {
        var profileUrl = this.baseUrl + 'users/notifications'
        return this.http
            .get(profileUrl, this.userOption())
            .toPromise()
            .then(this.getNotificationResponse)
            .catch(this.handleError)
    }

    private getNotificationResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as NotificationModel[]
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Search api */

    searchFeed (searchText : string): Promise<FeedModel[]> {
        var searchUrl = this.baseUrl + 'feed/search/' + searchText
        return this.http
            .get(searchUrl, this.userOption())
            .toPromise()
            .then(this.getSearchFeedResponse)
            .catch(this.handleError)
    }

    private getSearchFeedResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                let data = res.json().data as FeedModel[]
                return data || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Feeds apis */

    getSingleFeedsById (feedId : string): Promise<FeedModel> {
        var url = this.baseUrl + 'feed/' + feedId
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getSingleFeedByIdResponse)
            .catch(this.handleError)
    }

    private getSingleFeedByIdResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel[]
            let singleFeed = data[0]
            if (responseStatus) {
                return singleFeed || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    getFeedsByIds (feedIds : string[]): Promise<FeedModel[]> {
        var url = this.baseUrl + 'feed/list-by-id/' + JSON.stringify(feedIds)
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getFeedsByIdsResponse)
            .catch(this.handleError)
    }

    private getFeedsByIdsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel[]
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    getUsersFeeds(userId : Number): Promise<FeedModel[]> {
        var url = this.baseUrl + 'feed/other-feeds/' + userId
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getUsersFeedsResponse)
            .catch(this.handleError)
    }

    private getUsersFeedsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel[]
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    getMyFeeds(): Promise<FeedModel[]> {
        var url = this.baseUrl + 'feed/my-feeds'
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getMyFeedsResponse)
            .catch(this.handleError)
    }

    private getMyFeedsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel[]
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    getAllFeeds(pageNumber : number): Promise<FeedModel[]> {
        var url = this.baseUrl + 'feed/list/' + pageNumber
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getAllFeedsResponse)
            .catch(this.handleError)
    }

    private getAllFeedsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel[]
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    getMyFriendsFeeds(pageNumber : number): Promise<FeedModel[]> {
        var url = this.baseUrl + 'feed/friends/' + pageNumber
        return this.http
            .get(url, this.userOption())
            .toPromise()
            .then(this.getMyFriendsFeedsResponse)
            .catch(this.handleError)
    }

    private getMyFriendsFeedsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel[]
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    addFeed(feedModel: FeedModel): Promise<string> {
        var loginUrl = this.baseUrl + 'feed/add'
        let input = new FormData();
        var header = new Headers();
        header.append('authToken', localStorage.getItem('authToken'))
        input.append("feedType", feedModel.feedType);
        input.append("content", feedModel.content);
        input.append("title", feedModel.title);
        input.append("contentType", feedModel.contentType);
        return this.http
            .post(loginUrl, input, { headers: header })
            .toPromise()
            .then(this.addFeedResponse)
            .catch(this.handleError)
    }

    private addFeedResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            if (responseStatus) {
                return res.json().message || {}
            } else {
                let error = res.json().error as string
                return Promise.reject(error)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    updateFeed(feedModel : FeedModel): Promise<FeedModel> {
        var url = this.baseUrl + 'feed/update/' + feedModel._id
        let input = new FormData();
        var header = new Headers();
        header.append('authToken', localStorage.getItem('userAuthToken'))
        input.append("content", feedModel.content);
        input.append("description", feedModel.description);
        input.append("contentType", feedModel.contentType);
        return this.http
            .put(url,input, { headers: header })
            .toPromise()
            .then(this.updateFeedResponse)
            .catch(this.handleError)
    }

    private updateFeedResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    deleteFeed(id: string): Promise<string> {
        var deleteUrl = this.baseUrl + 'feed/delete/' + id
        var header = new Headers();
        header.append('authToken', localStorage.getItem('userAuthToken'))
        return this.http
            .delete(deleteUrl, { headers: header })
            .toPromise()
            .then(this.deleteFeedResponse)
            .catch(this.handleError)
    }

    private deleteFeedResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().message as string
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Likes and comments apis */

    likeFeed(feed : FeedModel): Promise<string> {
        var blogUpdateUrl = this.baseUrl + 'feed/like/' + feed._id
        var json = {}
        return this.http
            .put(blogUpdateUrl, json, this.userOption())
            .toPromise()
            .then(this.likeFeedResponse)
            .catch(this.handleError)
    }

    private likeFeedResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = "Liked the feed"
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    unLikeFeed(feed : FeedModel): Promise<string> {
        var blogUpdateUrl = this.baseUrl + 'feed/unlike/' + feed._id
        var json = {}
        return this.http
            .put(blogUpdateUrl, json, this.userOption())
            .toPromise()
            .then(this.unLikeFeedResponse)
            .catch(this.handleError)
    }

    private unLikeFeedResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = "UnLiked the feed"
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    commentFeed(feed : FeedModel): Promise<string> {
        var blogUpdateUrl = this.baseUrl + 'feed/comment/' + feed._id
        var json = { newComment : feed.newComment}
        return this.http
            .put(blogUpdateUrl, json, this.userOption())
            .toPromise()
            .then(this.commentFeedResponse)
            .catch(this.handleError)
    }

    private commentFeedResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = "Commented on the feed"
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    getFeedLikesAndComments(id: string): Promise<FeedModel> {
        var blogUrl = this.baseUrl + 'feed/details/' + id
        return this.http
            .get(blogUrl, this.userOption())
            .toPromise()
            .then(this.getFeedLikesAndCommentsResponse)
            .catch(this.handleError)
    }

    private getFeedLikesAndCommentsResponse(res: Response) {
        if (res.status == 200) {
            var responseStatus = res.json().success as boolean
            let data = res.json().data as FeedModel
            if (responseStatus) {
                return data || {}
            } else {
                return Promise.reject(data)
            }
        } else {
            return Promise.reject('Something went wrong!')
        }
    }

    /* Error handling */
    private handleError(error : any) {
        console.error('Error fetching api response : ', error)
        return Promise.reject(error)
    }
}