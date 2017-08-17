export class Utils {
    isTokenAvailable(){
        return localStorage.getItem('authToken') != null
    }

    isMobile() : boolean{
        return screen.width < 737
    }
}
    