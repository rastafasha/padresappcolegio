import { Component, HostListener, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { ListProductsComponent } from '../../components/list-products/list-products.component';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { CommonModule } from '@angular/common';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { ListaUsuariosComponent } from '../../components/ListaUsuarios/ListaUsuarios.component';
import { Profile } from '../../models/profile.model';
import { Router } from '@angular/router';
import { Parent } from '../../models/parents';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent, 
    MenuFooterComponent,
    AvisoComponent, 
    ListProductsComponent,
    LateralComponent,
    CommonModule, 
    BackButtnComponent, 
    ListaUsuariosComponent,
    TranslateModule
  ],
  providers: [TranslateService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  pageTitle = 'Home';
  user!: Parent;
  users: any = [];
  profile: Profile = new Profile();

  private translate = inject(TranslateService);
  
  constructor(
    private authService: AuthService,
    private router: Router,
    

  ){
    this.user = this.authService.getUser();
    this.translate.use('es'); // Set default language
  }

  ngOnInit(){
    window.scrollTo(0, 0);
  }

  searchData(){
    this.router.navigateByUrl('/search');
  }

}
