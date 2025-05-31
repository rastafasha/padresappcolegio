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
import { StudentService } from '../../../services/student-service.service';
import { Student } from '../../../models/student';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';
import { TasabcvService } from '../../../services/tasabcv.service';

@Component({
  selector: 'app-pagar',
  imports:[CommonModule, NgIf, NgFor, FormsModule,ReactiveFormsModule, 
    HeaderComponent,
    MenuFooterComponent, BackButtnComponent
  ],
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css'],
})
export class PagarComponent implements OnInit {
  public PaymentRegisterForm!: FormGroup;
  public cargando: boolean = true;
  public cargandoPago: boolean = true;
  pageTitle = 'Pagar';
  public text_validation: string = '';
  public text_success: string = '';

  metodo!: string;
  usuario: Usuario;
  error!: string;
  pago_id!: number;
  deuda: any;
  pagoSeleccionado!: Payment;
  paymentMethods!: PaymentMethod[]|null;

  student_id!: number;
  parent_id!: number;
  fecha!: Date;
  student!:Student;

  precio_dia!:number;
  matricula!:number;
  precio_fecha!:Date;

  public FILE_AVATAR: any;
    public IMAGE_PREVISUALIZA: any = "assets/img/user-06.jpg";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    public authService: AuthService,
    public userService: UserService,
    public paymentMethodService: PaymentmethodService,
    public studentService:StudentService,
    public tasaBcvService:TasabcvService
  ) {
    this.usuario = this.authService.user;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getTiposdepagos();
    this.activatedRoute.params.subscribe((resp: any) => {
      // console.log(resp);
      this.pago_id = resp.id;
    });
    
    this.usuario = this.authService.user;
    // console.log(this.usuario);
    this.getInfoUser();
    this.getInfoCita();
    this.validarFormulario();
    this.getUltimoPrecioTasaBcv();
  }

  getInfoUser(){
    // this.userService.showPatientByNdoc(this.user.n_doc).subscribe((resp:any)=>{
    //   // this.patient = resp.patient;
    //   this.user = resp.user;
    // })
  }

  getUltimoPrecioTasaBcv(){
    this.tasaBcvService.getTasas().subscribe((resp:any)=>{
      this.precio_dia = resp[0].precio_dia
      this.precio_fecha = resp[0].created_at

      console.log(resp);
    })
  }

  getInfoCita() {
    this.cargando = true;
    this.paymentService
      .getPagoById(this.pago_id)
      .subscribe((resp: any) => {
        this.cargando = false;
        // console.log(resp);
        this.deuda = resp.monto;
        this.student_id = resp.student_id;
        this.parent_id = resp.parent_id;
        this.fecha = resp.fecha;
        this.getStuden();
      });
  }
  

  getStuden(){
    this.studentService.getUserById(this.student_id).subscribe((resp:any)=>{
      console.log(resp);
      this.student = resp.student;
      this.matricula = resp.student.matricula
    })
  }

  validarFormulario() {
    this.PaymentRegisterForm = this.fb.group({
      id: [''],
      metodo: ['', Validators.required],
      bank_name: [''],
      bank_destino: ['',Validators.required],
      monto: ['', Validators.required],
      referencia: [''],
      email: [this.usuario.email],
      nombre: [this.usuario.name],
      parent_id: [this.usuario.id],
      student_id: [''],
      status: ['PENDING'],
      fecha: [''],
    });
  }

   loadFile($event: any) {
    if ($event.target.files[0].type.indexOf("image")) {
          this.text_validation = "Solamente pueden ser archivos de tipo imagen";
          return;
        }
        this.text_validation = "";
        this.FILE_AVATAR = $event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.FILE_AVATAR);
        reader.onloadend = () => (this.IMAGE_PREVISUALIZA = reader.result);
  }
  updateForm() {

    const formData = new FormData();
    formData.append('metodo', this.PaymentRegisterForm.get('metodo')?.value);
    formData.append(
      'bank_name',
      this.PaymentRegisterForm.get('bank_name')?.value
    );
    formData.append(
      'bank_destino',
      this.PaymentRegisterForm.get('bank_destino')?.value
    );
    formData.append('monto', this.PaymentRegisterForm.get('monto')?.value);
    formData.append(
      'referencia',
      this.PaymentRegisterForm.get('referencia')?.value
    );
    formData.append('student_id', this.student_id+'');
    formData.append('parent_id', this.parent_id+'');
    formData.append('nombre', this.usuario.name);
    formData.append('email', this.usuario.email);
    formData.append('imagen', this.FILE_AVATAR);
    // if (this.FILE_AVATAR) {
    //   formData.append("imagen", this.FILE_AVATAR);
    // }
    // formData.append('fecha', this.PaymentRegisterForm.get('fecha').value);
    formData.append('status', 'PENDING');

    //crear
    this.cargando = true;
    // Swal.fire('Procesando', `procesando Pago`, 'warning');
    this.paymentService.pagarDeuda(formData,this.parent_id, this.student_id).subscribe((resp: any) => {
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
