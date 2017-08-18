import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { NotificationModel } from '../../models/notification-model'
import { AuthService } from "angular2-social-login";
import { Utils } from '../../utils/utils'
import {SocialUserModel} from '../../models/social-user-model'
import { UserComponent } from './user-component'

@Component({
	templateUrl: '../../templates/user/friends.html',
	styleUrls: ['../../styles/user/friends.css']
})

export class FriendsComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	friends : SocialUserModel[]
	users : SocialUserModel[]
	loadingFriends : boolean
	fetchingSuggestions : boolean

	constructor(appComponent: AppComponent, private userComponent: UserComponent, router: Router, private apiService: ApiService) {
		this.appComponent = appComponent
		this.router = router
	}

	ngOnInit() {
		window.scrollTo(0,0)
		if (new Utils().isTokenAvailable()) {
			this.getFriendsList()
			this.getFriendSuggestions()
		} else {
			this.router.navigate(['/login'])
		}
	}

	ngAfterViewInit() {
		this.userComponent.setSelectedIconBg(3)
	}

	getFriendsList() {
		var thisObject = this
		this.loadingFriends = true
		this.apiService.getFriends()
			.then(response => this.friends = response)
			.then(response => this.loadingFriends = false)
			.catch(function (e) {
				thisObject.loadingFriends = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	getFriendSuggestions() {
		var thisObject = this
		this.fetchingSuggestions = true
		this.apiService.getFriendSuggestions()
			.then(response => this.users = response)
			.then(response => this.fetchingSuggestions = false)
			.catch(function (e) {
				thisObject.fetchingSuggestions = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	addFriend(friend : SocialUserModel){
		/* Remove from user's list*/
		var index = this.users.indexOf(friend)
		if (index != -1)
		this.users.splice(index, 1)

		/* Add to friends list and Change status to Friends */
		friend.friendStatus = 'Sent'
		this.friends.push(friend)

		var thisObject = this
		this.apiService.addFriend(friend)
			.then(response => console.log(response))
			.catch(function (e) {
				thisObject.appComponent.hideCircularProgressBar()
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	acceptFriend(friend : SocialUserModel){
		/* Remove from user's list*/
		var index = this.users.indexOf(friend)
		if (index != -1)
		this.users.splice(index, 1)

		/* Change status to Friends */
		friend.friendStatus = 'Friends'

		var thisObject = this
		this.apiService.acceptFriend(friend)
			.then(response => console.log(response))
			.catch(function (e) {
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	unFriend(friend : SocialUserModel){
		/* Remove from friend's suggestion list*/
		var index = this.friends.indexOf(friend)
		if (index != -1)
		this.friends.splice(index, 1)

		/* Add to users list */
		this.users.push(friend)

		var thisObject = this
		this.apiService.unFriend(friend)
			.then(response => console.log(response))
			.catch(function (e) {
				thisObject.appComponent.showErrorMessage(e)
			})
	}
}