export class Utils {
    isTokenAvailable(){
        return localStorage.getItem('authToken') != null
    }
}
    