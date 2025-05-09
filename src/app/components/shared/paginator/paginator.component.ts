import { Component, ElementRef, input, output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {

  @ViewChild('siguiente') siguiente!: ElementRef;
  @ViewChild('previo') previo!: ElementRef;

  pageInput = input<number>(1);
  totalInput = input<number>(0);
  sizeInput = input<number>(10);

  pageOuput = output<number>();
  initRange: number = 1;
  endRange: number = 10;
  previousPage: number = 0;
  nextPage: number = 2;
  totalPages: number = 0;

  page: number = 1;
  size: number = 10;
  total: number = 0;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['totalInput'] || changes['size']) {
      this.initilize();
    }

    this.setPageRange();

  }

  //Establezco el estado interno del objeto en base a los inputs
  initilize() {

    this.previousPage = this.pageInput() -1;
    this.page = this.pageInput();
    this.nextPage = this.pageInput() +1;
    this.total = this.totalInput();
    this.size = this.sizeInput();
    this.totalPages = Math.trunc(this.total / this.size) + (this.total % this.size > 0 ? 1 : 0);

  }

  setPageRange() {

    this.initRange = (this.page-1)*this.size +1;
    this.endRange = this.page*this.size <= this.total ? this.page*this.size: this.total;

  }

  onPreviousPage() {

    this.previousPage--;
    this.page--;
    this.nextPage--;

    this.pageOuput.emit(this.page);

    this.setPageRange();

  }

  onNextPage() {

    this.previousPage++;
    this.page++;
    this.nextPage++;

    this.pageOuput.emit(this.page);

    this.setPageRange();

  }

}
