export class Utils {

    mobileWidth = 767;

    isTokenAvailable(){
        return localStorage.getItem('authToken') != null
    }

    isMobile() : boolean{
        return screen.width < this.mobileWidth
    }
}
    