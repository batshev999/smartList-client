import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import {
  filter,
  map,
  skip,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IProduct } from 'src/app/models/product.model';
import { IProductDetailsInShop } from 'src/app/models/ProductDetailsInShop.model';
import { Observable, combineLatest, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStore } from 'src/app/store/product-store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { AmountProductInShopListComponent } from 'src/app/components/amount-product-in-shop-list/amount-product-in-shop-list.component';
import { ShopListStore } from 'src/app/store/shop-list-store';

export interface User {
  name: string;
}

@Component({
  selector: 'app-autocomplete-filter-products',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    MatListModule,
    AmountProductInShopListComponent,
  ],
  templateUrl: './autocomplete-filter-products.component.html',
  styleUrls: ['./autocomplete-filter-products.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutoCompleteFilterProductsComponent,
      multi: true,
    },
  ],
})
export class AutoCompleteFilterProductsComponent
  implements ControlValueAccessor, OnInit {
  @Input() initalShoplist: Array<IProductDetailsInShop> | undefined = [];
  #productStore = inject(ProductStore);
  #shopListStore = inject(ShopListStore);

  readonly searchControl = new FormControl<string>('');
  readonly productsSelect = new FormControl<IProduct[]>([]);
  ignoreInitialChange = true;
  productList$ = this.#productStore.products$;
  product$ = combineLatest([
    this.#productStore.products$,
    this.#productStore.newProuct$,
  ]).pipe(
    map(([products, newProuct]) =>
      products.map((p) => {
        var product = newProuct?.find(
          (productDetailsInShops) => p.id === productDetailsInShops.id
        );
        // if(!product){
        // var productInShopList = this.shopList.controls?.find(
        //     (productDetailsInShops) => p.id === productDetailsInShops.controls.product.value?.id&&
        //     productDetailsInShops.controls.product.value?.amount!=undefined&&
        //     productDetailsInShops.controls.product.value?.amount>0
        //   );
        //   if(productInShopList){
        //     product=productInShopList.controls.product.value??undefined;
        //   }
        // }
        return {
          product: p,
          amount: product?.amount ?? 0,
          checked: product ? true : p.isNew ?? false,
          disable: true,
        };
      })
    )
  );

  shopList = new FormArray<
    FormGroup<{
      product: FormControl<IProduct | null>;
      amount: FormControl<number | null>;
      checked: FormControl<boolean | null>;
      disable: FormControl<boolean | null>;
    }>
  >([]);

  // readonly shopList = new FormControl<FormGroup<{
  //   product:FormControl<IProduct>,
  //   amount:FormControl<number>
  // }
  // >[]>([]);
  //   shopList = new FormArray<FormGroup<{
  //     product: FormControl<IProduct | null>;
  //     amount: FormControl<number | null>;
  // }>>([]);
  // shopList!: FormArray<FormGroup<{ product: FormControl<IProduct | null>; amount: FormControl<number | null>; }>>;  readonly searchControl = new FormControl<string>("");
  callBackFunction: Function | undefined;


  filteredOptions = combineLatest([
    this.productList$,
    this.searchControl.valueChanges.pipe(
      tap((x) => console.log('productList', x)),
      startWith(this.searchControl.value)
    ),
  ]).pipe(map(([productList, search]) => this._filter(productList, search)));


  constructor() {
    this.#productStore.products$.subscribe();
    this.#shopListStore.shopList$.subscribe();
    this.product$
      .pipe(
        tap((products) => {
          this.shopList.clear({ emitEvent: false });
          products.forEach((initialValue) => {
            const group = new FormGroup({
              product: new FormControl<IProduct | null>(initialValue.product),
              amount: new FormControl<number | null>(initialValue.amount),
              checked: new FormControl<boolean | null>(initialValue.checked),
              disable: new FormControl<boolean | null>(initialValue.disable),
            });
            this.shopList.push(group);
          });
        })
      )
      .subscribe();

    this.searchControl.valueChanges.pipe(startWith('')).subscribe((search) => {
      if (search === '') {
        this.shopList.controls.forEach((p) =>
          p.controls.disable.setValue(true, { emitEvent: false })
        );
      } else {
        const shopListByFilter = this.shopList.controls.filter(
          (p) =>
            !p.controls.product.value?.productName
              .toLowerCase()
              .includes(search!)
        );
        shopListByFilter.forEach((p) =>
          p.controls.disable.setValue(false, { emitEvent: false })
        );
      }
    });

      this.shopList.valueChanges.subscribe((value) => {
        if (this.callBackFunction) {
          this.callBackFunction(value);
        }
      });
  }

  ngOnInit(): void {
    // if (!this.initalShoplist && this.initalShoplist!.length > 0) {
    //   var x = this.initalShoplist!.map((item) => {
    //     return {
    //       product: {
    //         id: item.id,
    //         categoryId: item.categoryId,
    //         companyId: item.companyId,
    //         productName: item.productName,
    //         isInPackage: item.isInPackage,
    //         amountInPackage: item.amountInPackage,
    //         weight: item.weight,
    //         weightType: item.weightType,
    //         img: item.img,
    //         isNew: true,
    //       } as IProduct,
    //       amount: item.amount,
    //     };
    //   });
    //   this.shopList.patchValue(x, { emitEvent: false });
    // }
  }

  writeValue(obj: any): void {
    this.shopList.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.callBackFunction = fn;
  }

  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }

  requireMatch(control: AbstractControl) {
    const selection: any = control.value;
    if (typeof selection === 'string') {
      return { incorrect: true };
    }
    return null;
  }

  private _filter(
    productList: IProduct[],
    name: string | null
  ): IProduct[] | undefined | null {
    const filterValue = name ? name.toLowerCase() : '';
    var x = productList.filter(
      (option) =>
        option.productName.toLowerCase().includes(filterValue) ||
        option.id.toString().includes(filterValue)
    );
    return productList.filter(
      (option) =>
        option.productName.toLowerCase().includes(filterValue) ||
        option.id.toString().includes(filterValue)
    );
  }

  onCheckboxChange(index: number) {
    const item = this.shopList.at(index);
      // Check if the checkbox is unchecked
      if (!item.get('checked')?.value) {
        // If unchecked, set the amount to 0
        item.get('amount')?.setValue(0);
      }
  }
}
