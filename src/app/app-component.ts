import { Component } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'

@Component({
  selector: 'my-app',
  templateUrl: './app-component.html',
  styleUrls: ['./app-component.css']
})

export class AppComponent {

  // Toast messages
  public showSuccessToast: boolean
  public showErrorToast: boolean
  public message: string

  //progress bar
  public visibilityStatus: string
  public isClassVisible: boolean
  public postingData: boolean
  public loadingData: boolean
  public router: Router

  constructor(router: Router) {
    this.visibilityStatus = "show"
    this.isClassVisible = false
    this.router = router
  }

  showSuccessMessage(msg: string): void {
    if (msg != null && msg.length > 0) {
      this.message = msg
      this.showSuccessToast = true
      window.scrollTo(0, 0)
      setTimeout(() => { this.showSuccessToast = false }, 4000)
    }
  }

  showErrorMessage(msg: string): void {
    if (msg != null && msg.length > 0) {
      this.message = msg
      this.showErrorToast = true
      window.scrollTo(0, 0)
      setTimeout(() => { this.showErrorToast = false }, 4000)
    }
  }

  showLinearProgressBar(): void {
    window.scrollTo(0, 0)
    this.postingData = true
  }

  hideLinearProgressBar(): void {
    this.postingData = false
  }

  showCircularProgressBar(): void {
    window.scrollTo(0, 0)
    this.loadingData = true
  }

  hideCircularProgressBar(): void {
    this.loadingData = false
  }

  public isLoading(): boolean {
    return this.loadingData
  }

  public isPosting(): boolean {
    return this.postingData
  }
}