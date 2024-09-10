import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/api-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string | null = null;
  formularioLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.formularioLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {}

  enviarLogin() {
    if (this.formularioLogin.valid) {
      const { email, password } = this.formularioLogin.value;

      this.userService.login(email, password).subscribe(
        response => {
          console.log('El token es:', response.token);
          // Guardar el token
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            alert('Login successful');

            const role = this.userService.getRole();

            switch (role) {
              case 'is_super_admin':
                this.router.navigate(['/dashboard-super-admin']);
                break;
              case 'admin':
                this.router.navigate(['/dashboard-admin']);
                break;
              case 'user':
                this.router.navigate(['/dashboard-user']);
                break;
              case 'profesional':
                this.router.navigate(['/dashboard-profesional']);
                break;
              default:
                alert('No tienes credenciales válidas');
                this.router.navigate(['/login']);
                break;
            }
          } else {
            alert('No se recibió un token válido');
          }
        },
        error => {
          if (error.status === 401) {
            this.errorMessage = 'Usuario no encontrado';
            alert('Este usuario no existe');
          } else if (error.status === 400) {
            this.errorMessage = 'Contraseña incorrecta';
          } else {
            this.errorMessage = 'Error en el servidor';
          }
        }
      );
    }
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.formularioLogin.get(controlName);
    return control?.hasError(errorType) && control?.touched;
  }
}
