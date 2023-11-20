import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IProduct } from 'src/app/models/product.model';
import { ProductStore } from 'src/app/store/product-store';
import { Subject, map, skip, switchMap, tap, withLatestFrom } from 'rxjs';
import { Metadata } from 'src/app/shared//models/metadata.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from 'src/app/components/add-product/add-product.component';
import { GlobalRootStore } from 'src/app/store/global-root-store';
import { IProductDetailsInShop } from 'src/app/models/ProductDetailsInShop.model';
import { ShopListStore } from 'src/app/store/shop-list-store';
import { AutoCompleteFilterProductsComponent } from 'src/app/shared/components/autocomplete-filter-products/autocomplete-filter-products.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IShopList } from 'src/app/models/shopList.model';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [
    CommonModule,
    AutoCompleteFilterProductsComponent,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
})
export class ShopListComponent implements OnInit {
  #productStore = inject(ProductStore);
  #shopListStore = inject(ShopListStore);
  #globalRootStore = inject(GlobalRootStore);
  #formBuilder = inject(FormBuilder);
  #matDialog = inject(MatDialog);

  shopList = toSignal(this.#shopListStore.shopList$);
  readonly requestOpenPopUp = new Subject<void>();
  productList$ = toSignal(this.#productStore.products$);

  myShopList = this.#formBuilder.group({
    isUsedSatistic:new FormControl<boolean>(true),
    productDetailsInShop: new FormControl<
      { product: IProduct; amount: number,checked:boolean,disable:boolean }[]
    >([]),
  });

  constructor() {
    // this.myShopList.valueChanges.subscribe((form) => {
    //   if (form.productDetailsInShop) {
    //     var x = form.productDetailsInShop.map((p) => {
    //       return {
    //         amount: p.amount,
    //         productId: p.product.id,
    //       } as IProductDetailsInShop;
    //     });
    //     this.#shopListStore.updateProductDetailsInShops(x);
    //   }
    // });

       this.myShopList.valueChanges.subscribe((form) => {
      if (form.productDetailsInShop) {
        var x = form.productDetailsInShop.filter(p=>p.checked).map((p) => {
          return {
            amount: p.amount,
            productId: p.product.id,
            id:p.product.id,
            categoryId:p.product.categoryId,
            companyId:p.product.companyId,
            productName:p.product.productName,
            isInPackage:p.product.isInPackage,
            amountInPackage:p.product.amountInPackage,
            weight:p.product.weight,
            weightType:p.product.weightType,
            img:p.product.img
          } as IProductDetailsInShop;
        });
        this.#shopListStore.updateProductDetailsInShops({productDetailsInShops: x,isUsedSatistic:form.isUsedSatistic!} as IShopList);
      }
    });
    
  }

  ngOnInit(): void {
    this.requestOpenPopUp
      .pipe(
        withLatestFrom(
          this.#globalRootStore.comanyList$,
          this.#globalRootStore.categoryList$
        ),
        switchMap(async ([_, comanyList, categoryList]) =>
          this.#matDialog
            .open(AddProductComponent, {
              data: { comanyList: comanyList, categoryList: categoryList },
            })
            .afterClosed()
            .subscribe((resultFromPopUp) => {
              // const productFormGroup = new FormGroup<{
              //   product: FormControl<IProduct|null>,
              //   amount:FormControl<number|null>
              // }>({
              //   product: new FormControl(resultFromPopUp.product ,[Validators.required]) ,
              //   amount: new FormControl(1, Validators.required),
              // });
              // this.myShopList.controls.productDetailsInShop.;
              this.#productStore.addProduct(resultFromPopUp.product);
            })
        )
      )
      .subscribe();
  }

  addProduct() {
    this.requestOpenPopUp.next();
  }

  saveList() {
    this.#shopListStore.saveList();
  }
}
