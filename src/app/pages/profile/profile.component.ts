import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuFooterComponent } from '../../shared/menu-footer/menu-footer.component';
import { LateralComponent } from '../../components/lateral/lateral.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterLink } from '@angular/router';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { ProfileService } from '../../services/profile.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { Parent } from '../../models/parents';
import { ParentService } from '../../services/parent-service.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';

@Component({
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    MenuFooterComponent,
    LateralComponent,
    BackButtnComponent,
    LoadingComponent,
    TranslateModule,
    ImagenPipe
],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  pageTitle= 'Profile';
  public user!: Parent;
  public isLoading:boolean = false;
    loadingTitle!:string;

  public profile!: Parent;

  constructor(
    private authService: AuthService,
    private parentService: ParentService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.user = this.authService.getUser();
    this.getProfile();
  }

  getProfile(){
    this.isLoading = true;
    this.loadingTitle = 'Loading Profile...';
    this.parentService.getUserById(this.user.id).subscribe((resp:any) => {
      this.profile = resp.representante || null;
      this.isLoading = false;
    })
  }

 
  logout() {
    this.authService.logout();
  }
}
