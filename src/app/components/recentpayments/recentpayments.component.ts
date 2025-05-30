import { Component, OnInit } from '@angular/core';
import { CommonModule, Location, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../../models/payment';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { StudentService } from '../../services/student-service.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-recentpayments',
  imports:[
    CommonModule, FormsModule, NgIf, NgFor, LoadingComponent, RouterLink
  ],
  templateUrl: './recentpayments.component.html',
  styleUrls: ['./recentpayments.component.css'],
})
export class RecentpaymentsComponent {
  title = 'Pagos';

  payments!: Payment[]|null;
  error!: string;
  p: number = 1;
  count: number = 8;
  isLoading:boolean = false;
  public user;
  query: string = '';
  student_id!:number;
  student!:Student;

  constructor(
    private location: Location,
    private paymentService: PaymentService,
    private userService: UserService,
    private studentService: StudentService,
    private http: HttpClient
  ) {
    this.user = this.userService.user;
  }

  ngOnInit(): void {
    this.getPagos();
    window.scrollTo(0, 0);
    // this.getPagos_list();
  }

  getPagos(): void {
    this.isLoading = true;
    this.paymentService.getPagosPendingbyUser(this.user.id).subscribe((res: any) => {
      this.payments = res.data;
      (error:any) => (this.error = error);
      this.isLoading = false;
        // console.log(this.payments);
        //recorremos payment para traer la info del studiante
        if (this.payments) {
          this.payments.forEach((payment: Payment) => {
            if (payment.student_id !== undefined) {
              this.studentService.getUserById(payment.student_id).subscribe((res: any) => {
                this.student = res;
                console.log(this.student);

              });
            }
          });
        }
    })
  }
  

  getStudent(){
    this.studentService.getUserById(this.student_id).subscribe((res: any) =>{
      console.log(res);
      })
    }
  
  search() {
    return this.paymentService.search(this.query).subscribe((res: any) => {
      this.payments = res;
      if (!this.query) {
        this.ngOnInit();
      }
    });
  }

  public PageSize(): void {
    this.getPagos();
    this.query = '';
  }

  cambiarStatus(data: any) {
    const VALUE = data.status;
    console.log(VALUE);

    this.paymentService.updateStatus(data, data.id).subscribe((resp) => {
      console.log(resp);
      // Swal.fire('Actualizado', `actualizado correctamente`, 'success');
      // this.toaster.open({
      //   text:'Producto Actualizado!',
      //   caption:'Mensaje de Validación',
      //   type:'success',
      // })
      this.getPagos();
    });
  }
}
