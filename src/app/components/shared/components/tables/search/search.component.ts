import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  checkActiveSearch: boolean = true;
  searchInput: string = '';
  search = output<{searchText: string}>();
  over2Chars: boolean = false;

  onSubmit() {
    this.search.emit({ searchText : this.searchInput});
  }

  onUpdateField(event: KeyboardEvent) {
    if (this.checkActiveSearch && this.searchInput.length > 2) {
      this.over2Chars = true;
      this.search.emit({ searchText : this.searchInput});
    } else if (this.checkActiveSearch && this.over2Chars) {
      this.over2Chars = false;
      this.search.emit({ searchText : ''});
    }
  }

  clearSearch(): void {
    this.searchInput = '';
    this.over2Chars = false;
    this.search.emit({ searchText: '' });
  }

}
