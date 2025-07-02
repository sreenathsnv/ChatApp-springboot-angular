import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { WebSocketService } from '../../service/web-socket.service';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {


isLoggedIn:boolean = false;
isConnected:boolean;
isLoading:boolean = false;

currentURL:string='';
conneectBtnURL:string='/chat'
showConnectBtn:boolean=false;

constructor(
    private authService:AuthService, 
    private router:Router,
    private cookieService:CookieService,
    private webSocket:WebSocketService,
    
  ){

    this.isConnected = cookieService.get('CONNECT')==='true';

    this.router.events
      .pipe(filter(event=>event instanceof NavigationEnd))
      .subscribe( event=>
      {
        this.currentURL = event.urlAfterRedirects
        this.showConnectBtn = this.currentURL === this.conneectBtnURL;
      }
      )
}



  ngOnInit(): void {
    
    this.authService.isLoggedInObservable.subscribe((status)=>{
      this.isLoggedIn = status      
    })

    

  }

  

  connect(){
    this.isLoading = true
     this.webSocket.connect().then(connected=>{
      this.isConnected = connected
     })
    console.log("connected=",this.isConnected)
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  disconnect(){
    this.webSocket.disconnect().then(status=>{
      this.isConnected = !status
    })
  }

  logout() {
    this.authService.logout();
    setTimeout(()=>{
      this.router.navigate(['/login'])
    },1000)
    }
}
