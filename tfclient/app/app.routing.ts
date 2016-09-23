import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login.component';
import { RootComponent } from './components/root.component';
import { ThreadViewComponent } from './components/thread-view.component';
import { NewThreadComponent } from './components/new-thread.component';

import { CanActivateViaAuthenticated, CanActivateViaAuthenticatedV2 } from './guards/can-activate-via-authenticated.guard';

const appRoutes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: '', 
    component: RootComponent,
    canActivate: [
      CanActivateViaAuthenticatedV2
    ]
  },
  {
    path: 'thread/:thread_uuid',
    component: ThreadViewComponent,
    canActivate: [
      CanActivateViaAuthenticatedV2
    ]
  },
  {
    path: 'thread',
    component: NewThreadComponent,
    canActivate: [
      CanActivateViaAuthenticatedV2
    ]
  }
]

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
