import { Component } from '@angular/core';
import { TEXT, TITLE } from '../../shared/content/sobre-mi.content';
@Component({
  selector: 'app-sobre-mi',
  templateUrl: './sobre-mi.component.html',
  styleUrl: './sobre-mi.component.min.css'
})
export class SobreMiComponent {
  title: string = TITLE;
  finalText = TEXT;
}
