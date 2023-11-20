import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Metadata } from 'src/app/shared/models/metadata.model';


export interface User {
  name: string;
}

@Component({
  selector: 'app-single_autocomplete-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './single_autocomplete-filter.component.html',
  styleUrls: ['./single_autocomplete-filter.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: SingleAutocCompleteFilterComponent, multi: true }]
})
export class SingleAutocCompleteFilterComponent implements ControlValueAccessor {

  @Input() autoCompleteList: Metadata[] | undefined | null;
  readonly valueControl = new FormControl<number>(0);
  readonly searchControl = new FormControl<string | Metadata>('');
  callBackFunction: Function|undefined;

constructor(){
  this.valueControl.valueChanges.subscribe((values) => {
    if (this.callBackFunction) {
      this.callBackFunction(values);
    }
  });
}

  readonly filteredOptions = this.searchControl?.valueChanges.pipe(
    startWith(''),
    map(value => {
      const name: string = typeof value === 'string' ? value : `${value?.id} ${value?.name}`;
      return name ? this._filter(name) : this.autoCompleteList?.slice();
    })
  );


  writeValue(obj: any): void {
    this.valueControl.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.callBackFunction = fn;
  }

  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }

  // displayFn(user: User): string {
  //   return user && user.name ? user.name : '';
  // }

  requireMatch(control: AbstractControl) {
    const selection: any = control.value;
    if (typeof selection === 'string') {
      return { incorrect: true };
    }
    return null;
  }

  private _filter(name: string): Metadata[] | undefined {
    const filterValue = name.toLowerCase();
    return this.autoCompleteList?.filter(option => option.name.includes(filterValue));
  }


}
