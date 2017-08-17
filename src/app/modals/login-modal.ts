import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal'
import { BSModalContext } from 'angular2-modal/plugins/bootstrap'
import { PlatformLocation } from '@angular/common'
import { FeedModel } from '../models/feed.model'
import { AppComponent } from '../app-component'
import { ApiService } from '../apiServices/api.service'

import { Router } from '@angular/router'
import { Component, OnDestroy, OnInit} from '@angular/core'
import { AuthService } from "angular2-social-login"
import { SocialUserModel } from '../models/social-user-model'
import { Overlay, overlayConfigFactory } from 'angular2-modal'

export class CustomTermsModalContext extends BSModalContext {
    public feedModelString: string
}

@Component({
    templateUrl: '../templates/modals/login-modal.html',
    styleUrls: ['../styles/modals/login-modal.css']
})

export class LoginModal implements CloseGuard, ModalComponent<CustomTermsModalContext> {
    context: CustomTermsModalContext;
    response : any
    loginMode : string

    router: Router
    public user: any;
    sub: any;
    appComponent: AppComponent
    socialUserModel: SocialUserModel
    description : string

    constructor(public dialog: DialogRef<CustomTermsModalContext>, appComponent: AppComponent, router: Router, private apiService: ApiService, public _auth: AuthService) {
        this.appComponent = appComponent
        this.router = router
        this.context = dialog.context;
        //dialog.setCloseGuard(this)
    }

    signIn(provider : any) {
        console.log(provider)
        this.sub = this._auth.login(provider).subscribe(
            (data) => {
                var thisObject = this
                this.appComponent.showCircularProgressBar()
                var socialUserModel = new SocialUserModel()
                socialUserModel.email = data['email']
                socialUserModel.name = data['name']
                socialUserModel.image = data['image']
                socialUserModel.provider = provider
                socialUserModel.socialLoginToken = data['token']
                socialUserModel.uid = data['uid']
                console.log("data : " + JSON.stringify(data))
                console.log("socialUserModel : " + JSON.stringify(socialUserModel))
                this.saveUserDetailsLocally(socialUserModel)
                this.apiService.socialLogin(socialUserModel)
                    .then(response => this.navigateToHome(response))
                    .catch(function (e) {
                        thisObject.appComponent.hideCircularProgressBar()
                        thisObject.appComponent.showErrorMessage(e)
                    })
            }
        )
    }

    saveUserDetailsLocally(socialUserModel : SocialUserModel){
        localStorage.setItem('profile-pic', socialUserModel.image)
        localStorage.setItem('name', socialUserModel.name)
        localStorage.setItem('email', socialUserModel.email)
    }

    navigateToHome(socialUserModel : SocialUserModel) {
        this.appComponent.hideCircularProgressBar()
        if (socialUserModel.newUser)
            localStorage.setItem('newUser', 'true')
         this.sub.unsubscribe();
         this.dialog.close()
    }
}