import { NgClass, NgStyle } from '@angular/common';
import { Component, input, output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-column-sort',
  imports: [NgClass, NgStyle],
  templateUrl: './column-sort.component.html'
})
export class ColumnSortComponent {

  fieldInput = input<string>('');
  fieldQueryInput = input<string>('fieldQuery');
  clear = input<boolean>();

  orderInput = input<string>('');
  order: string = 'asc';
  orderOuput = output<{fieldQuery: string, order: string}>();

  ngOnInit() {
    this.order = this.orderInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clear']) {
        this.order = '';
      }
  }

  onChangeAscDesc() {

    switch (this.order) {
      case 'asc':
        this.order = 'desc';
        break;
      case 'desc':
        this.order = 'asc';
        break;
      default:
        this.order = 'asc';
        break;
    }

    this.orderOuput.emit({fieldQuery: this.fieldQueryInput(), order: this.order });

  }

}
