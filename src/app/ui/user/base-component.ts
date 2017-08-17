import { Component } from '@angular/core'

@Component({
	moduleId: module.id,
})

export class BaseComponent {

    constructor() {
		
    }
    
    isTokenAvailable(){
        return localStorage.getItem('authToken') != null
    }
}
