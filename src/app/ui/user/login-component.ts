import { Router } from '@angular/router'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Overlay, overlayConfigFactory } from 'angular2-modal'
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap'
import { CustomTermsModalContext, LoginModal } from '../../modals/login-modal'

@Component({
    moduleId: module.id,
    templateUrl: '../../templates/user/login.html',
    styleUrls: ['../../styles/user/login.css']
})

export class LoginComponent implements OnInit {

    router: Router
    public user: any;

    constructor(public modal: Modal, router: Router) {
        this.router = router
    }

    ngOnInit() {
        this.showLoginModal()
    }

    showLoginModal() {
        this.modal.open(LoginModal, overlayConfigFactory({}, BSModalContext))
            .then((d) => d.result)
            .then((r) => {
                this.router.navigate(['/home/feeds'])
            },
            (error) => {
                this.showLoginModal()
                console.log(error)
            })
    }
}