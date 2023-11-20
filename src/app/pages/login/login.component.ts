import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from 'src/app/store/user-store';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from 'src/app/models/user.model';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  #formBuilder = inject(FormBuilder);
  #userStore = inject(UserStore);

  userForm = this.#formBuilder.group({
    email: new FormControl<string>(''),
  });

  login() {
    this.#userStore.login(this.userForm.controls.email.value as string);
  }
}
