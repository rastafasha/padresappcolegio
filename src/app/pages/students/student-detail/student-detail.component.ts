import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';

@Component({
  selector: 'app-student-detail',
  imports: [HeaderComponent, MenuFooterComponent],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent {

}
