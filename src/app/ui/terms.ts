import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { AppComponent } from '../app-component'

@Component({
	templateUrl: '../templates/terms.html',
	styleUrls: ['../styles/terms.css']
})

export class TermsComponent  {

	router: Router
	appComponent: AppComponent

	constructor(appComponent: AppComponent, router: Router) {
		this.appComponent = appComponent
		this.router = router
	}
}