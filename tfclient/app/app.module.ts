import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

// Routing
import { routing, appRoutingProviders } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
import { RootComponent } from './components/root.component';
import { TopMenuComponent } from './components/top-menu.component';
import { ThreadViewComponent } from './components/thread-view.component';
import { NewThreadComponent } from './components/new-thread.component';

// Guards
import { CanActivateViaAuthenticated } from './guards/can-activate-via-authenticated.guard';

// Services
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    FormsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RootComponent,
    TopMenuComponent,
    ThreadViewComponent,
    NewThreadComponent
  ],
  providers: [
    appRoutingProviders,
    DataService,
    CanActivateViaAuthenticated,
    AuthService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }