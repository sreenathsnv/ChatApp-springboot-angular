import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { ChatWindowComponent } from './components/chat/chat-window/chat-window.component';
import { CreateRoomComponent } from './components/chat/create-room/create-room.component';

const routes: Routes = [
  {
    path:"",
    component:HomeComponent
  },
  {
    path:"home",
    component:HomeComponent
  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"signup",
    component:SignupComponent
  },
 
  {
    path:"chat",
    component:ChatWindowComponent,
    canActivate:[authGuard]
  },
  {
    path:"room/create",
    component:CreateRoomComponent,
    canActivate:[authGuard]
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
