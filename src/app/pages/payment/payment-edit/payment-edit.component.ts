import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';

@Component({
  selector: 'app-payment-edit',
  imports: [HeaderComponent, MenuFooterComponent],
  templateUrl: './payment-edit.component.html',
  styleUrl: './payment-edit.component.scss'
})
export class PaymentEditComponent {

}
