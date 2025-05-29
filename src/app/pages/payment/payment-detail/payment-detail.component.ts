import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Payment } from '../../../models/payment';
import { PaymentService } from '../../../services/payment.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';

@Component({
  selector: 'app-payment-detail',
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, RouterLink,
    HeaderComponent, MenuFooterComponent
  ],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.scss'
})
export class PaymentDetailComponent {

  title = "Detalle Pago";
  payment!: Payment;
  error!: string;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.activatedRoute.params.subscribe( ({id}) => this.getPagoById(id));
  }
  getUser(id:number){
    this.paymentService.getPagosbyUser(id).subscribe(
      res =>{
        this.payment = res;
        (error:any) => this.error = error
        console.log(this.payment);
      }
    );
  }

  getPagoById(id:number){
    this.paymentService.getPagoById(id).subscribe(
      res=>{
        this.payment = res;
        console.log(this.payment);
      }
    )
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  cambiarStatus(data:any){
    const VALUE = data.status;
    console.log(VALUE);
    
    this.paymentService.updateStatus(data, data.id).subscribe(
      resp =>{

        console.log(resp);
        // Swal.fire('Actualizado', `actualizado correctamente`, 'success');
        // this.toaster.open({
        //   text:'Producto Actualizado!',
        //   caption:'Mensaje de Validación',
        //   type:'success',
        // })
        this.ngOnInit();
      }
    )
  }
}
