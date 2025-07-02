import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from '../../../service/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  standalone: false,
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent {


  roomForm:FormGroup;

  constructor(
    private fb:FormBuilder,
    private roomService:RoomService,
    private router:Router
  ){

    this.roomForm = this.fb.group({

      roomName:['',[Validators.required]],
      bio:[''],
      
    })
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      
      this.roomService.createRoom(this.roomForm.get('roomName')?.value,this.roomForm.get('bio')?.value)
      setTimeout(() => {

        this.roomForm.reset();
        this.router.navigate(['/']);
        
      }, 1000);
      
    } else {
      // Mark all fields as touched to show validation errors
      this.roomForm.markAllAsTouched();
    }
  }

  // Helper method to check if a field has errors
  hasError(fieldName: string): boolean {
    const field = this.roomForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

}
