import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { AppComponent } from '../../app-component'
import { ApiService } from '../../apiServices/api.service'
import { NotificationModel } from '../../models/notification-model'
import { AuthService } from "angular2-social-login";
import { BaseComponent } from './base-component'
import {SocialUserModel} from '../../models/social-user-model'

@Component({
	moduleId: module.id,
	templateUrl: '../../templates/user/friends.html',
	styleUrls: ['../../styles/user/friends.css']
})

export class FriendsComponent extends BaseComponent implements OnInit {

	router: Router
	appComponent: AppComponent
	friends : SocialUserModel[]
	users : SocialUserModel[]
	loadingFriends : boolean
	fetchingSuggestions : boolean

	constructor(appComponent: AppComponent, router: Router, private apiService: ApiService) {
		super()
		this.appComponent = appComponent
		this.router = router
	}

	ngOnInit() {
		if (super.isTokenAvailable()) {
			this.getFriendsList()
			this.getAllUsers()
		} else {
			this.router.navigate(['/login'])
		}
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

	getAllUsers() {
		var thisObject = this
		this.fetchingSuggestions = true
		this.apiService.getAllUsers()
			.then(response => this.users = response)
			.then(response => this.fetchingSuggestions = false)
			.catch(function (e) {
				thisObject.fetchingSuggestions = false
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	addFriend(friend : SocialUserModel){
		var thisObject = this
		this.appComponent.showCircularProgressBar()
		this.apiService.addFriend(friend)
			.then(response => this.addFriendResponse(response,friend))
			.catch(function (e) {
				thisObject.appComponent.hideCircularProgressBar()
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	addFriendResponse(response : any, friend : SocialUserModel){
		/* Remove from user's list*/
		var index = this.users.indexOf(friend)
		if (index != -1)
		this.users.splice(index, 1)

		this.appComponent.hideCircularProgressBar()
	}

	acceptFriend(friend : SocialUserModel){
		var thisObject = this
		this.appComponent.showCircularProgressBar()
		this.apiService.acceptFriend(friend)
			.then(response => this.acceptFriendResponse(response,friend))
			.catch(function (e) {
				thisObject.appComponent.hideCircularProgressBar()
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	acceptFriendResponse(response : any, friend : SocialUserModel){
		/* Remove from user's list*/
		var index = this.users.indexOf(friend)
		if (index != -1)
		this.users.splice(index, 1)

		this.appComponent.hideCircularProgressBar()
	}

	unFriend(friend : SocialUserModel){
		var thisObject = this
		this.appComponent.showCircularProgressBar()
		this.apiService.unFriend(friend)
			.then(response => this.unFriendResponse(response, friend))
			.catch(function (e) {
				thisObject.appComponent.hideCircularProgressBar()
				thisObject.appComponent.showErrorMessage(e)
			})
	}

	unFriendResponse(response : any, friend : SocialUserModel){
		/* Remove from friend's suggestion list*/
		var index = this.friends.indexOf(friend)
		if (index != -1)
		this.friends.splice(index, 1)
		this.appComponent.hideCircularProgressBar()
	}
}

