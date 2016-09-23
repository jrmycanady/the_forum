import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login.component';
import { RootComponent } from './components/root.component';
import { ThreadViewComponent } from './components/thread-view.component';
import { NewThreadComponent } from './components/new-thread.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminUsersComponent } from './components/admin/admin-users.component';
import { AdminNewUserComponent } from './components/admin/admin-new-user.component';

import { CanActivateViaAuthenticated } from './guards/can-activate-via-authenticated.guard';

const appRoutes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', 
    component: RootComponent,
    canActivate: [
      CanActivateViaAuthenticated
    ]
  },
  {
    path: 'thread/:thread_uuid',
    component: ThreadViewComponent,
    canActivate: [
      CanActivateViaAuthenticated
    ]
  },
  {
    path: 'thread',
    component: NewThreadComponent,
    canActivate: [
      CanActivateViaAuthenticated
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [
      CanActivateViaAuthenticated
    ],
    children: [
      { 
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      { path: 'users', component: AdminUsersComponent },
      { path: 'new-user', component: AdminNewUserComponent }
    ]
  }
]

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
