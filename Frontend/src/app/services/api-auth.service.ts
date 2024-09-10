import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/v1/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  // Para con los datos del formulario pueda crear un usuario haciendo POST a la API.
  signup(name: string, email: string, password: string, role: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, { name, email, password, role }).pipe(
      tap(response => {
        // Guardar el token en el almacenamiento local
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  // Para con los datos del formulario pueda comprobar el usuario logeado con la BD haciendo POST a la API.
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Guardar el token en el almacenamiento local
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      return !!token;
    }
    return false;
  }

  // Cerrar sesión
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Obtener el rol del usuario desde el token JWT
  getRole(): string {
    const token = typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
    if (token) {
      try {
        // Divide el token en sus partes (asumiendo formato JWT)
        const parts = token.split('.');
        if (parts.length === 3) {
          // Decodifica la parte del payload en Base64
          const payload = this.base64UrlDecode(parts[1]);
          const parsedPayload = JSON.parse(payload);
          console.log(parsedPayload);

          if(parsedPayload.is_super_admin) {
            return 'is_super_admin';
          }

          // Verifica los roles
          switch (parsedPayload.role) {
            case 'is_super_admin':
              return 'is_super_admin';
            case 'admin':
              return 'admin';
            case 'user':
              return 'user';
            case 'profesional':
              return 'profesional';
            default:
              return ''; // Retorna vacío si no hay un rol válido
          }
        } else {
          console.error('Token is not in the expected format.');
          return '';
        }
      } catch (e) {
        console.error('Error decoding token:', e);
        return '';
      }
    }
    return ''; // Retorna una cadena vacía si no hay token
  }

  // Función para decodificar Base64 URL-safe
  private base64UrlDecode(base64Url: string): string {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding > 0) {
      base64 += '='.repeat(4 - padding);
    }
    return atob(base64);
  }
}
