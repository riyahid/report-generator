import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users: User[] = [];
  constructor(private fb: FormBuilder, private service: LoginService, private router: Router) {
    this.service.getUsers().subscribe(data => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as any)
        } as User;
      });
    });
  }

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(value: any) {
    const index = this.users.findIndex(user => {
      return user.username === value.username && user.password === value.password;
    });
    if (index >= 0) {
      this.router.navigateByUrl('/transactions');
    }
  }
}
