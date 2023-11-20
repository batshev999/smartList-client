import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IProduct } from 'src/app/models/product.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Metadata } from 'src/app/shared/models/metadata.model';
import { SingleAutocCompleteFilterComponent } from '../single_autocomplete-filter/single_autocomplete-filter.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SingleAutocCompleteFilterComponent,
    MatInputModule
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductComponent implements OnInit {
  #formBuilder = inject(FormBuilder);
  #dialogRef = inject(MatDialogRef<AddProductComponent>);

  categoryList: Metadata[] = [];
  comanyList: Metadata[] = [];

  product = this.#formBuilder.group({
    categoryId: new FormControl<number>(0),
    companyId: new FormControl<number | null>(null),
    productName: new FormControl<string>(''),
    //?
    isInPackage: new FormControl<boolean>(false),
    amountInPackage: new FormControl<number>(0),
    weight: new FormControl<number>(0),
    weightType: new FormControl<string>(''),
    img: new FormControl<string>(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      categoryList: Metadata[];
      comanyList: Metadata[];
    }
  ) { }

  ngOnInit(): void {
    this.categoryList = this.data.categoryList;
    this.comanyList = this.data.comanyList;
  }

  add() {
    this.#dialogRef.close({ product: this.product.value });
  }
}
