import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('../app/pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('../app/pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/pages/layout/layout.module').then(m => m.LayoutPageModule)
  },
  {
    path: '**',
    loadChildren: () =>
      import('../app/pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'layout',
    loadChildren: () => import('./pages/layout/layout.module').then( m => m.LayoutPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
