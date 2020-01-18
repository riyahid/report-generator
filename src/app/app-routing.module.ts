import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'transactions', component: TabMenuComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
