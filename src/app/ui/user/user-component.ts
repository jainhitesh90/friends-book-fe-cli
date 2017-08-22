import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { AppComponent } from '../../app-component'
import { Router } from '@angular/router'
import { ApiService } from '../../apiServices/api.service'
import { SocialUserModel } from '../../models/social-user-model'
import { Utils } from '../../utils/utils'

@Component({
    templateUrl: '../../templates/user/user-component.html',
    styleUrls: ['../../styles/user/user-component.css']
})

export class UserComponent implements OnInit {

    public appComponent: AppComponent
    router: Router
    searchText: string
    bookmarkItems: string[]
    socialUserModel: SocialUserModel
    mobileView: boolean

    classList = ["selected-icon-colors", "un-selected-icon-colors"]
    classListDesktop = ["selected-tab-bg", "un-selected-tab-bg"]

    classIndex1: number
    classIndex2: number
    classIndex3: number
    classIndex4: number
    classIndex5: number
    classIndex6: number
    classIndex7: number
    classIndex8: number
    classIndex9: number
    classIndex10: number

    constructor(appComponent: AppComponent, router: Router, private cdr: ChangeDetectorRef) {
        this.appComponent = appComponent
        this.router = router
        this.router.navigate(['/home/feeds']) //resolve this bug later
    }

    ngOnInit() {
        this.mobileView = new Utils().isMobile()
        this.unselectAllIcons()
        this.getUsersDetail()
        this.updateBookmarkCount()
    }

    getUsersDetail() {
        this.socialUserModel = new SocialUserModel()
        this.socialUserModel.name = localStorage.getItem('name')
        this.socialUserModel.image = localStorage.getItem('profile-pic')
        this.socialUserModel.email = localStorage.getItem('email')
    }

    onResize(event) {
        if (event.target.innerWidth >= new Utils().mobileWidth) {
            this.mobileView = false;
        } else {
            this.mobileView = true;
        }
    }

    public updateBookmarkCount() {
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

    showFriends() {
        this.router.navigate(['/home/friends'])
    }

    openBookmarks() {
        this.router.navigate(['/home/bookmarks'])
    }

    showNotifications() {
        this.router.navigate(['/home/notifications'])
    }

    showSearchPage() {
        if (this.searchText != null && this.searchText.length > 0)
            this.router.navigate(['/home/search'], { queryParams: { search: this.searchText } })
        else
            this.appComponent.showErrorMessage("Please enter some text to search")
    }

    setSelectedIconBg(pos: number) {
        this.unselectAllIcons()
        switch (pos) {
            case 1:
                this.classIndex1 = 0
                this.classIndex6 = 0
                break;
            case 2:
                this.classIndex2 = 0
                this.classIndex7 = 0
                break;
            case 3:
                this.classIndex3 = 0
                this.classIndex8 = 0
                break;
            case 4:
                this.classIndex4 = 0
                this.classIndex9 = 0
                break;
            case 5:
                this.classIndex5 = 0
                this.classIndex10 = 0
                break;
        }
        this.cdr.detectChanges();
    }

    unselectAllIcons() {
        this.classIndex1 = 1
        this.classIndex2 = 1
        this.classIndex3 = 1
        this.classIndex4 = 1
        this.classIndex5 = 1
        this.classIndex6 = 1
        this.classIndex7 = 1
        this.classIndex8 = 1
        this.classIndex9 = 1
        this.classIndex10 = 1
    }
}