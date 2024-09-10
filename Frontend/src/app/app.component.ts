import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Cambiar BrowserAnimationsModule a CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule], // Usa CommonModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Asegúrate de que está escrito correctamente: 'styleUrls' (no 'styleUrl')
})
export class AppComponent {
  title = 'App Dental Appointment';
}
