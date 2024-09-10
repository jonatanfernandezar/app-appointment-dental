import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchPasswords } from '../../utils/matchValidator';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/api-auth.service';
import jwt from 'jwt-simple';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

  formularioSignUp: FormGroup;

  constructor(
    private form: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.formularioSignUp = this.form.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      passwordGroup: this.form.group(
        {
          password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
          repeatPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
        },
        { validators: matchPasswords('password', 'repeatPassword') }
      ),
      role: ['user']
    });
  }

  enviarSignUp() {
    if (this.formularioSignUp.valid) {
      const { name, email, passwordGroup, role } = this.formularioSignUp.value;

      // Enviar datos al servicio
      this.userService.signup(name, email, passwordGroup.password, role).subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          if (response.token) {
            // Almacena el token
            localStorage.setItem('token', response.token);
          } else {
            alert('No tiene credenciales validas');
          }
          console.log('Usuario registrado:', response);
          this.formularioSignUp.reset();
          alert('Se ha registrado exitosamente');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al registrar usuario:', error);
          if (error.status === 400 && error.error.message === 'El usuario ya está registrado') {
            alert('El usuario ya está registrado. Por favor, intente con otro correo.');
          } else {
            alert('No se pudo crear el usuario. Intente nuevamente.');
          }
        }
      );
    }
  }

  hasErrors(controlName: string, errorType: string, groupName: string = '') {
    const control = groupName
      ? (this.formularioSignUp.get(groupName) as FormGroup).get(controlName)
      : this.formularioSignUp.get(controlName);

    return control?.hasError(errorType) && control.touched;
  }
}
