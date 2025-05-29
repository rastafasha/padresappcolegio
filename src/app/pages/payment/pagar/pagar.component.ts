import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Payment } from '../../../models/payment';
import { PaymentMethod } from '../../../models/paymentmethod.model';
import { AuthService } from '../../../services/auth.service';
import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { PaymentmethodService } from '../../../services/paymentmethod.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuFooterComponent } from '../../../shared/menu-footer/menu-footer.component';

@Component({
  selector: 'app-pagar',
  imports:[CommonModule, NgIf, NgFor, FormsModule,ReactiveFormsModule, 
    HeaderComponent,
    MenuFooterComponent
  ],
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css'],
})
export class PagarComponent implements OnInit {
  public PaymentRegisterForm!: FormGroup;
  public cargando: boolean = true;
  public cargandoPago: boolean = true;

  public text_validation: string = '';
  public text_success: string = '';

  metodo!: string;
  usuario: Usuario;
  user: any;
  error!: string;
  appointment_id: any;
  appointment: any;
  deuda: any;
  pagoSeleccionado!: Payment;
  paymentMethods!: PaymentMethod[]|null;

  patient_id: any;
  patient_selected: any;
  patient: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    public authService: AuthService,
    public userService: UserService,
    public paymentMethodService: PaymentmethodService
  ) {
    this.usuario = this.authService.user;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getTiposdepagos();
    this.activatedRoute.params.subscribe((resp: any) => {
      // console.log(resp);
      this.appointment_id = resp.id;
    });
    
    this.user = this.authService.user;
    
    this.getInfoUser();
    this.getInfoCita();
    this.validarFormulario();
  }

  getInfoUser(){
    // this.userService.showPatientByNdoc(this.user.n_doc).subscribe((resp:any)=>{
    //   // this.patient = resp.patient;
    //   this.user = resp.user;
    // })
  }

  getInfoCita() {
    this.cargando = true;
    // this.appoitmentService
    //   .showAppointment(this.appointment_id)
    //   .subscribe((resp: any) => {
    //     this.cargando = false;
    //     // console.log(resp);
    //     this.appointment = resp.appointment;
    //     this.deuda = resp.deuda;
    //     this.patient_id = resp.appointment.patient_id;
    //   });
  }

  validarFormulario() {
    this.PaymentRegisterForm = this.fb.group({
      id: [''],
      metodo: ['', Validators.required],
      bank_name: [''],
      monto: ['', Validators.required],
      referencia: [''],
      email: [this.user.email],
      nombre: [this.user.name],
      appointment_id: [''],
      status: ['PENDING'],
      fecha: [''],
    });
  }
  updateForm() {

    const formData = new FormData();
    formData.append('metodo', this.PaymentRegisterForm.get('metodo')?.value);
    formData.append(
      'bank_name',
      this.PaymentRegisterForm.get('bank_name')?.value
    );
    formData.append('monto', this.PaymentRegisterForm.get('monto')?.value);
    formData.append(
      'referencia',
      this.PaymentRegisterForm.get('referencia')?.value
    );
    // formData.append('nombre', this.PaymentRegisterForm.get('nombre').value);
    // formData.append('nombre',this.usuario.name);
    // formData.append('email',this.user.email);
    
    
    // formData.append('fecha', this.PaymentRegisterForm.get('fecha').value);
    formData.append('status', 'PENDING');

    //crear
    const data = {
      ...this.PaymentRegisterForm.value,
      patient_id: this.patient_id,
      appointment_id: this.appointment_id,
    };
    this.cargando = true;
    // Swal.fire('Procesando', `procesando Pago`, 'warning');
    this.paymentService.create(data).subscribe((resp: any) => {
      this.pagoSeleccionado = resp;

      // console.log(this.pagoSeleccionado);
      // this.emptyCart();

      this.cargando = false;

      if (resp.message == 403) {
        // Swal.fire('Actualizado', this.text_validation, 'success');
        this.text_validation = resp.message_text;
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: this.text_validation,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Swal.fire('Actualizado', this.text_success, 'success' );
        // this.text_success = 'La Cita medica se ha creado, favor espere la verificacion de  el pago';
        this.text_success =
          'Se Ha enviado el pago, favor espere la verificación';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.text_success,
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigateByUrl(`/app/mis-pagos`);
      }
    });

    return false;
  }

  selectedTypeCoupon(value: any) {
    this.metodo = value;
  }

  getTiposdepagos(): void {
    // return this.planesService.carga_info();
    this.paymentMethodService.getPaymentmethods().subscribe((res:any) => {
      this.paymentMethods = res;
      (error:any) => (this.error = error);
      // console.log(res);
    });
  }
}
