//base modules
import { NgModule, Component, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'

// User
import { UserComponent } from './ui/user/user-component'
import { LoginComponent } from './ui/user/login-component'
import { FeedsComponent } from './ui/user/feeds'
import { SingleFeedComponent } from './ui/user/single-feed'
import { MyProfileComponent } from './ui/user/my-profile'
import { SearchComponent } from './ui/user/search'
import { NotificationsComponent } from './ui/user/notifications'
import { FriendsComponent } from './ui/user/friends'
import { VisitProfileComponent } from './ui/user/visit-profile'
import { BookmarkComponent } from './ui/user/bookmarks'
import { CustomFeedComponent } from './ui/custom-components/feed-component'
import { CustomSpinner } from './ui/custom-components/custom-spinner'

import { AppComponent } from './app-component'
import { ApiService } from './apiServices/api.service'
import { FeedsReactionModal } from './modals/feeds-reaction-modal'
import { LoginModal } from './modals/login-modal'

// 3rd party libraries
import { ModalModule } from 'angular2-modal'
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap'
import { Angular2SocialLoginModule } from "angular2-social-login";
import { ShareButtonsModule} from 'ng2-sharebuttons';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    Angular2SocialLoginModule,
    ShareButtonsModule.forRoot(),
    BrowserModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home/feeds', pathMatch: 'full' }, 
      { path: 'login', component: LoginComponent },
      { path: 'home', component: UserComponent,
        children: [
          { path: 'profile', component: MyProfileComponent },
          { path: 'visit-profile', component: VisitProfileComponent },
          { path: 'feed', component: SingleFeedComponent },
          { path: 'feeds', component: FeedsComponent },
          { path: 'search', component: SearchComponent },
          { path: 'notifications', component: NotificationsComponent },
          { path: 'bookmarks', component: BookmarkComponent },
          { path: 'friends', component: FriendsComponent },
        ]
      }
    ]),
  ],
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    SingleFeedComponent,
    FeedsComponent,
    MyProfileComponent,
    VisitProfileComponent,
    NotificationsComponent,
    FriendsComponent,
    SearchComponent,
    BookmarkComponent,
    CustomFeedComponent,
    CustomSpinner,
    FeedsReactionModal,
    LoginModal
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent],
  entryComponents: [FeedsReactionModal, LoginModal]
})

export class AppModule { }

let providers = {
  "google": {
    "clientId": "654787904657-4l06fbrbt75od7hvl6s0k8bl5ueep1n8.apps.googleusercontent.com"
  },
  "facebook": {
    "clientId": "1081604671942168",
    "apiVersion": "v2.8"
  }
};

Angular2SocialLoginModule.loadProvidersScripts(providers);