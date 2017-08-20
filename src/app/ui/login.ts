import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal'
import { FeedModel } from '../models/feed.model'
import { AppComponent } from '../app-component'
import { ApiService } from '../apiServices/api.service'

import { Router } from '@angular/router'
import { Component, OnDestroy, OnInit} from '@angular/core'
import { AuthService } from "angular2-social-login"
import { SocialUserModel } from '../models/social-user-model'

@Component({
    templateUrl: '../templates/login.html',
    styleUrls: ['../styles/login.css']
})

export class LoginComponent implements OnDestroy {

    router: Router
    public user: any;

    response : any
    loginMode : string

    sub: any;
    
    socialUserModel: SocialUserModel
    description : string
    logging : boolean

    constructor(router: Router, private appComponent: AppComponent, private apiService: ApiService, public _auth: AuthService) {
        this.router = router
        this.socialUserModel = new SocialUserModel()
    }

    signIn(provider : any) {
        this.sub = this._auth.login(provider).subscribe(
            (data) => {
                var thisObject = this
                this.logging = true
                this.setSocialUserModel(data, provider)
                this.apiService.socialLogin(this.socialUserModel)
                    .then(response => this.navigateToHome(response))
                    .catch(function (e) {
                        thisObject.logging = false
                        thisObject.appComponent.showErrorMessage(e)
                    })
            }
        )
    }

    setSocialUserModel(data : any , provider : string) {
        this.socialUserModel.email = data['email']
        this.socialUserModel.name = data['name']
        this.socialUserModel.image = data['image']
        this.socialUserModel.provider = provider
        this.socialUserModel.socialLoginToken = data['token']
        this.socialUserModel.uid = data['uid']

        /* Save locally */
        localStorage.setItem('profile-pic', this.socialUserModel.image)
        localStorage.setItem('name', this.socialUserModel.name)
        localStorage.setItem('email', this.socialUserModel.email)
    }

    navigateToHome(socialUserModel : SocialUserModel) {
        this.logging = false
        if (socialUserModel.newUser)
            localStorage.setItem('newUser', 'true')
        this.router.navigate(['/home/feeds'])
    }

    ngOnDestroy(){
        if (this.sub != null)
        this.sub.unsubscribe();
    }

    openTnC(){
        this.router.navigate(['terms'])
    }
}