import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';

export type SortOrder = 'asc' | 'desc' | '';

@Component({
  selector: 'app-column-sort',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './column-sort.component.html'
})
export class ColumnSortComponent<T extends string> {

  fieldInput = input('');
  fieldQueryInput = input.required<T>();
  activeSort = input<{ fieldQuery: T, order: string } | undefined>();
  orderOuput = output<{ fieldQuery: T, order: string }>();

  private readonly isActive = computed(() => this.activeSort()?.fieldQuery === this.fieldQueryInput());

  readonly order = computed<SortOrder>(() => this.isActive() ? (this.activeSort()?.order as SortOrder) : '');

  onChangeAscDesc(): void {
    const currentOrder = this.order();
    const nextOrder = currentOrder === 'asc' ? 'desc' : 'asc';

    this.orderOuput.emit({
      fieldQuery: this.fieldQueryInput(),
      order: nextOrder
    });
  }
}
