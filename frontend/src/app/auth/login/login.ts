import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
/* codigo provisionalllll para probar el login */
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  error = false;

constructor(private router: Router) {}

login() {
  console.log('LOGIN CLICK', this.email, this.password);

  if (this.email === 'admin@demo.com' && this.password === '123456') {
    console.log('NAVEGANDO A PROYECTOS');
    this.router.navigate(['/proyectos']);
  }
  }
}
