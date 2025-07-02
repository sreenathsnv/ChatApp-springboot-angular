import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import {  CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {


  private stompClient!:Client;

  constructor(
    private authService:AuthService,
    private cookieService:CookieService
  ) { 

    
    authService.isLoggedInObservable.subscribe(
      data=>{ 
        if(data){
          this.stompClient = this.createStompClient();
        }
      }
    )

  }


  disconnect():Promise<boolean>
  {

    console.log("disconnecting...")

    return new Promise(resolve=>{

      if(!this.stompClient?.active){
        resolve(true)
        this.cookieService.set('CONNECT',"false")
      }
      

      this.stompClient?.deactivate().then(()=>{
        resolve(true)
      })

    })
  }


  connect(): Promise<boolean> {
  
  
    console.log("connecting to websocket");
  
   
  
    
    return new Promise((resolve=>{

      this.stompClient = this.createStompClient();
  
      this.stompClient.onConnect = () => {
        this.handleSuccessfulConnection();
        this.cookieService.set('CONNECT',"true")
        resolve(true)
      };
    
      this.stompClient.onStompError = (frame) => {
        this.handleConnectionError(frame);
        resolve(false)
      };
    
      this.stompClient.activate();
    })) ;
  }
  
  private createStompClient(): Client {
    return new Client({
      webSocketFactory: () => new SockJS('http://localhost:9090/ws'),
      connectHeaders: {
        Authorization: 'Bearer ' + this.authService.getToken()
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => console.log(msg)
    });
  }
  
  private handleSuccessfulConnection(): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Connected',
      showConfirmButton: false,
      timer: 1500
    });
  }
  
  private handleConnectionError(frame: any): void {
    Swal.fire({
      icon: 'error',
      title: 'WebSocket Error',
      text: frame.headers['message'] || 'Connection error',
      footer: frame.body || '',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000
    });
  }
  
  getClient():Client{
      return this.stompClient
    
  }

}
