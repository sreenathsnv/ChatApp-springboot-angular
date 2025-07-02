import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { Room } from '../models/room.model';
import { WebSocketService } from './web-socket.service';
import { ChatMessage } from '../models/chat-message.model';
import { IMessage } from '@stomp/stompjs';
import { ChatMessageResponse } from '../models/chat-message-response';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  
  private messageSubject = new Subject<ChatMessageResponse>();
  
  message$ = this.messageSubject.asObservable();
  
  constructor(

    private http:HttpClient,
    private websocketService:WebSocketService,
    private authService:AuthService
  
  ) { }


  getHeaders(){
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      
      Authorization: `Bearer ${authToken}`
    })
    return headers;
  }
  createRoom(roomName:string,bio:string){

    const apiURL = `${environment.apiURL}/room/create`;
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      
      Authorization: `Bearer ${authToken}`
    })
    
    this.http.post(apiURL,{
      roomName:roomName,
      bio:bio
    },
    {headers}

  ).subscribe({
    next:(resp)=>{
      Swal.fire({
                 position: 'top-end',
                 icon: 'success',
                 title: roomName+' has been registered successfully',
                 showConfirmButton: false,
                 timer: 1500
               }); 
    },

    error:()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error creating '+roomName,
        showConfirmButton: false,
        timer: 1500
      }); 
    }
  }
  )



  }

  getAllAvailableRooms(){

    
    const headers:HttpHeaders = this.getHeaders();
    return this.http.get<Room[]>(`${environment.apiURL}/room/all`,
    {headers}

  )
  }

  getUserRooms(){
    const headers:HttpHeaders = this.getHeaders();
    return this.http.get<Room[]>(`${environment.apiURL}/room/user`,
    {headers}

  )
  }

  subscribeToRoom(roomName: string) {
    const client = this.websocketService.getClient();
    if (!client.active) {
      console.error('WebSocket client is not connected. Attempting to reconnect...');
      this.websocketService.connect().then((connected) => {
        if (connected) {
          this.subscribeToRoom(roomName); // Retry subscription
        } else {
          console.error('Failed to connect to WebSocket');
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'WebSocket connection failed',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
      return;
    }

    client.subscribe(`/topic/chat/${roomName}`, (message: IMessage) => {
      try {
        const payload: ChatMessageResponse = JSON.parse(message.body);
        console.log(`Payload from /topic/chat/${roomName}:`, payload);
        this.messageSubject.next(payload);
      } catch (error) {
        console.error('Invalid JSON:', message.body, error);
      }
    });
  }

  sendmessageToRoom(roomName:string,message:ChatMessage){

    

    this.websocketService.getClient().publish({
      destination:`/app/chat/${roomName}/send`,
      body: JSON.stringify(message),
      headers:{
         'content-type': 'application/json',
         'Authorization': `Bearer ${this.authService.getToken()}`
      }
    }

    )
  }

  getRoomMessages(roomName:string){

    const headers:HttpHeaders = this.getHeaders();
    
    return this.http.get<ChatMessageResponse[]>(`${environment.apiURL}/room/${roomName}/messages`,{headers})
  }
  
  joinRoom(roomName:string){
    const headers:HttpHeaders = this.getHeaders();
    
    return this.http.post(`${environment.apiURL}/room/${roomName}/join`,null,{headers})
  }

  searchRooms(roomName:string){
    const headers:HttpHeaders = this.getHeaders();

    return this.http.get<Room[]>(`${environment.apiURL}/rooms?name=${roomName}`,{headers})
  }

  leaveRoom(roomName:string){
    const headers:HttpHeaders = this.getHeaders();
    return this.http.delete<boolean>(`${environment.apiURL}/room/${roomName}/leave`,{headers})
  }

}
