import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IUser } from 'src/app/models/user.model';
import { UserApiService } from 'src/app/core/services/api/user-api-service';
import { UserStore } from 'src/app/store/user-store';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,MatInputModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  #formBuilder = inject(FormBuilder);
  #userStore = inject(UserStore);

  userForm = this.#formBuilder.group({
    id: new FormControl<number>(0),
    userName: new FormControl<string>(''),
    firstName: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    email: new FormControl<string>(''),
  });

  register() {
    this.#userStore.createUser(this.userForm.value as IUser);
  }
}
