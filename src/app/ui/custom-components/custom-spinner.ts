import { EventEmitter, ViewChild, Component, ViewContainerRef, ViewEncapsulation, ElementRef, Input, Output, OnInit } from '@angular/core'
import { AppComponent } from '../../app-component'

@Component({
	inputs: ['loadingText'],
    selector: 'custom-spinner',
	templateUrl: '../../templates/custom-components/custom-spinner.html'
})

export class CustomSpinner {

	appComponent: AppComponent
	loadingText : string
	
    constructor(appComponent: AppComponent) {
		this.appComponent = appComponent
		this.loadingText = 'Loading'
	}
}