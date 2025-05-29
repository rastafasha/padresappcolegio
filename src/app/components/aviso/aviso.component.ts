import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { ParentService } from '../../services/parent-service.service';
import { Parent } from '../../models/parents';

@Component({
  selector: 'app-aviso',
  imports: [RouterLink, NgIf, LoadingComponent, TranslateModule],
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.css'
})
export class AvisoComponent {
  @Input() user!:  Parent;
  // @Input() profile!: Profile;
  user_id!: number;
  isLoading:boolean = false;
  isProfile:boolean = false;
  public profile: Parent = new Parent();

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private parentService: ParentService,
  ) {
    this.user = this.authService.getUser();
  }
  ngOnInit() {
    this.getProfile();
    // console.log(this.user);
  }
  getProfile() {
    this.isLoading = true;
    this.parentService.getUserById(this.user.id).subscribe({
      next: (res) => {
        this.profile = res.representante || null;
        // console.log(this.profile);
        this.isLoading = false;
      },
      error: (err) => {
        // console.log(err);
        this.isLoading = false;
      }
    });
  }
}
