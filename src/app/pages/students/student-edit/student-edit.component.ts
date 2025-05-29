import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';

@Component({
  selector: 'app-student-edit',
  imports: [HeaderComponent, MenuFooterComponent],
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.scss'
})
export class StudentEditComponent {

}
