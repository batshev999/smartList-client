import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-amount-product-in-shop-list',
  standalone: true,
  imports: [
    CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatInputModule],
  templateUrl: './amount-product-in-shop-list.component.html',
  styleUrls: ['./amount-product-in-shop-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AmountProductInShopListComponent,
      multi: true,
    },
  ],
})
export class AmountProductInShopListComponent implements ControlValueAccessor {
  readonly amount = new FormControl<number>(0);

  callBackFunction: Function | undefined;

 constructor(){
  this.amount.valueChanges.subscribe((value) => {
    if (this.callBackFunction) {
      this.callBackFunction(value);
    }
  });

 }
  writeValue(obj: any): void {
    this.amount.setValue(obj);
    }

  registerOnChange(fn: any): void {
    this.callBackFunction = fn;

  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

}
