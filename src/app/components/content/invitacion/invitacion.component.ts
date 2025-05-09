import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-invitacion',
  imports: [CommonModule, NgClass],
  templateUrl: './invitacion.component.html'
})
export class InvitacionComponent {

  invitaciones = [
    { id: 1, src: '../../img/4.jpg', title: 'Alas de Cristal' },
    { id: 2, src: '../../img/5.jpg', title: 'Brisa de Fiesta' },
    { id: 3, src: '../../img/6.jpg', title: 'Vuelo de Amor' }
  ];

  currentPage = 0;
  itemsPerPage = 2;
  totalPages = Math.ceil(this.invitaciones.length / this.itemsPerPage);

  get currentItems() {
    const start = this.currentPage * this.itemsPerPage;
    return this.invitaciones.slice(start, start + this.itemsPerPage);
  }

  // Nuevo getter para el título
  get currentTitle(): string {
    return this.currentItems.length > 0 ? this.currentItems[0].title : 'Invitación';
  }

  ngOnInit() {
    this.updateItemsPerPage();
  }

  updateItemsPerPage() {
    this.itemsPerPage = this.invitaciones.length === 3 ? 3 : 2;
    this.totalPages = Math.ceil(this.invitaciones.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

}

// .f1 {
//   font-family: "SophiaMorgant", sans-serif;
// }
// .f2 {
//   font-family: "Raleway", sans-serif;
// }
// .n i {
//   font-size: 30px;
// }
// body {
//   background: #f3d8cd;
// }
// body .s1 {
//   display: grid;
//   grid-template-columns: 1fr;
// }
// body .s1 div {
//   font-size: 3.5rem;
//   font-weight: 400;
// }
// @media only screen and (min-width: 768px) {
//   body .s1 {
//     grid-template-columns: 1fr 1fr;
//   }
//   body .s1 div {
//     grid-column: 1/3;
//   }
//   body .s1 .ss1 {
//     grid-column: 1/2;
//   }
//   body .s1 .ss2 {
//     grid-column: 2/3;
//   }
// }
// body .s1 section {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
