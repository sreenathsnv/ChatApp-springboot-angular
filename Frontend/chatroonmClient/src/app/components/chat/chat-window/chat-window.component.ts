import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatMessageResponse } from '../../../models/chat-message-response';
import { Room } from '../../../models/room.model';
import { forkJoin, Subscription } from 'rxjs';
import { RoomService } from '../../../service/room.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatMessage } from '../../../models/chat-message.model';
import Swal from 'sweetalert2';
import { SearchFilter } from '../../../models/search-filter';

@Component({
  selector: 'app-chat-window',
  standalone: false,
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindowComponent implements OnInit {
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  chatName: string = 'Selected Chat'; // Set dynamically based on selected room
  selectedRoom: any = null; // Set when a room is selected
  messages: ChatMessageResponse[] = []; // Array of message objects { text: string, isSent: boolean, timestamp: string }
  newMessage: string = '';

  availableRooms: Room[];
  joinedRooms: Room[];
  searchedRooms: Room[] = [];

  currentChat: any;
  showChatTools: boolean = this.chatName !== 'Selected Chat';
  currentUserId: string;
  isJoinedRoom: boolean = false;
  private messageSubscription: Subscription | null = null;
  isMenuOpen: boolean = false;
  isSearchRoomOpen: boolean = false;

  constructor(
    private roomService: RoomService,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef
  ) {
    this.availableRooms = [];
    this.joinedRooms = [];
    this.currentUserId = cookieService.get('user');
  }

  ngOnInit(): void {
    forkJoin([
      this.roomService.getUserRooms(),
      this.roomService.getAllAvailableRooms(),
    ]).subscribe(([joinedRooms, availableRooms]) => {
      this.joinedRooms = joinedRooms;
      console.log('joined rooms', joinedRooms);
      this.availableRooms = availableRooms.filter(
        (room1) =>
          !joinedRooms.some(
            (room2) =>
              room2.roomName?.trim().toLowerCase() ===
              room1.roomName?.trim().toLowerCase()
          )
      );

      console.log('avail rooms', this.availableRooms);
    });

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  getMemberNames(members: any[]): string {
    if (!members || members.length === 0) return 'No members';
    const maxDisplay = 5;
    const names = members
      .slice(0, maxDisplay)
      .map((member) => member.username)
      .join(', ');
    return members.length > maxDisplay ? `${names}, etc` : names;
  }

  sendMessage() {
    //    console.log("sender: ",this.cookieService.get('user'))
    if (this.newMessage.trim()) {
      const chatMessage: ChatMessage = {
        msg: this.newMessage,
        senderId: this.cookieService.get('user'),
        receiverId: '',
        type: 'GROUP',
      };
      this.roomService.sendmessageToRoom(this.chatName, chatMessage);
      this.newMessage = ''; // Clear input
    }
  }

  selectRoom(room: any) {
    this.messages = [];
    this.selectedRoom = room;
    this.chatName = room.roomName;
    this.isJoinedRoom = this.checkIsJoinedRoom(room);
    console.log(room);

    if (this.isJoinedRoom) {
      this.roomService.subscribeToRoom(room.roomName);

      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }
      this.messageSubscription = this.roomService.message$.subscribe(
        (message) => {
          this.messages = [...this.messages, message];
          // console.log('New message received:', message);
        }
      );

      this.roomService.getRoomMessages(this.chatName).subscribe((resp) => {
        this.messages = resp;
        // console.log('Initial messages:', this.messages);
      });
    }
    this.showChatTools = this.chatName !== 'Selected Chat';
  }

  private checkIsJoinedRoom(room: Room): boolean {
    return this.joinedRooms.includes(room);
  }

  joinToRoom() {
    this.roomService.joinRoom(this.chatName).subscribe({
      next: (resp) => {
        // console.log(resp)
        this.showChatTools = true;
        this.cdr.detectChanges();
        this.selectRoom(this.selectedRoom);

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Joined to Room',
          showConfirmButton: false,
          timer: 1500,
        });

        forkJoin([
          this.roomService.getUserRooms(),
          this.roomService.getAllAvailableRooms(),
        ]).subscribe(([joinedRooms, availableRooms]) => {
          this.joinedRooms = joinedRooms;
          // console.log("joined rooms",joinedRooms)
          this.availableRooms = availableRooms.filter(
            (room1) =>
              !joinedRooms.some(
                (room2) =>
                  room2.roomName?.trim().toLowerCase() ===
                  room1.roomName?.trim().toLowerCase()
              )
          );

          // console.log("avail rooms",this.availableRooms)
        });

        this.isJoinedRoom = true;

        // console.log(this.chatName, this.showChatTools,this.isJoinedRoom, this.selectedRoom)
      },
      error: (err) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Failed to join room',
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  }


  leaveChat(roomName:string){

    this.roomService.leaveRoom(roomName).subscribe({
      next:resp=>{
        if(resp){ 
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'You have been left',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            width: '300px',
            padding: '0.5rem',
            customClass: {
              popup: 'small-toast',
              title: 'small-toast-title'
            }
          });
          this.chatName = 'Selected Chat';
          this.selectedRoom = null
        }
        else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to leave',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            width: '300px',
            padding: '0.5rem',
            customClass: {
              popup: 'danger-toast',
              title: 'danger-toast-title'
            }
          });
        }

      }
    })

    forkJoin([
      this.roomService.getUserRooms(),
      this.roomService.getAllAvailableRooms(),
    ]).subscribe(([joinedRooms, availableRooms]) => {
      this.joinedRooms = joinedRooms;
      console.log('joined rooms', joinedRooms);
      this.availableRooms = availableRooms.filter(
        (room1) =>
          !joinedRooms.some(
            (room2) =>
              room2.roomName?.trim().toLowerCase() ===
              room1.roomName?.trim().toLowerCase()
          )
      );

      console.log('avail rooms', this.availableRooms);
    });

  }

  onSearchChange(query: string) {
    console.log('Search query changed:', query);
  }

  onSearchSubmit(query: string) {
    this.roomService.searchRooms(query).subscribe({
      next: (resp) => (this.searchedRooms = resp),
    });
  }

  onFilterChange(filters: SearchFilter[]) {
    console.log('Filters changed:', filters);
  }
}
