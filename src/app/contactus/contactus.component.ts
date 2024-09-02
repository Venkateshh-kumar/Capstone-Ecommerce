import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {
submitForm() {
throw new Error('Method not implemented.');
}

}
