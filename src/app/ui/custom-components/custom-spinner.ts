import { EventEmitter, ViewChild, Component, ViewContainerRef, ViewEncapsulation, ElementRef, Input, Output, OnInit } from '@angular/core'
import { AppComponent } from '../../app-component'

@Component({
	inputs: ['loadingText', 'size'],
    selector: 'custom-spinner',
	templateUrl: '../../templates/custom-components/custom-spinner.html'
})

export class CustomSpinner {

	appComponent: AppComponent
	loadingText : string
	size : string

	classList = ["small", "medium", "large"]
	classIndex : Number
	
    constructor(appComponent: AppComponent) {
		this.appComponent = appComponent
		this.loadingText = 'Loading'
	}
}