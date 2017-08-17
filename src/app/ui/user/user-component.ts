import { Component,OnInit } from '@angular/core'
import { AppComponent } from '../../app-component'
import { Router } from '@angular/router'
import { ApiService } from '../../apiServices/api.service'
import { SocialUserModel } from '../../models/social-user-model'

@Component({
    templateUrl: '../../templates/user/user-component.html',
    styleUrls: ['../../styles/user/user-component.css']
})

export class UserComponent implements OnInit{

    public appComponent : AppComponent
    router: Router
    searchText : string
    bookmarkItems : string []
    socialUserModel : SocialUserModel
    mobileView : boolean

    constructor(appComponent : AppComponent, router: Router) {
        this.appComponent = appComponent
        this.router = router
    }

    ngOnInit() {
        if (screen.width < 737)
            this.mobileView = true
        else
            this.mobileView = false
        this.getUsersDetail()
        this.updateBookmarkCount()
    }

    getUsersDetail() {
        this.socialUserModel = new SocialUserModel()
        this.socialUserModel.name = localStorage.getItem('name')
        this.socialUserModel.image = localStorage.getItem('profile-pic')
        this.socialUserModel.email = localStorage.getItem('email')
    }
    
    public updateBookmarkCount(){
        this.bookmarkItems = JSON.parse(localStorage.getItem("bookmarkList"))
        if (this.bookmarkItems == null)
            this.bookmarkItems = []
	}

    showFeeds() {
        this.router.navigate(['/home/feeds'])
    }

    showProfile() {
        this.router.navigate(['/home/profile'])
    }

    showNotifications() {
        this.router.navigate(['/home/notifications'])
    }
    
    openBookmarks(){
		this.router.navigate(['/home/bookmarks'])
    }
    
    showFriends() {
        this.router.navigate(['/home/friends'])
    }

    showSearchPage() {
        if (this.searchText!=null && this.searchText.length > 0)
            this.router.navigate(['/home/search'], { queryParams: { search : this.searchText } })
        else 
            this.appComponent.showErrorMessage("Please enter some text to search")
    }

    logout() {
		localStorage.clear()
		this.router.navigate(['/login'])
    }
}