import { environment } from "../environments/environment";

const base_url = environment.url_media;

export class Parent {

    id!: number;
    // role_id: number = 3; // 3 = Rol miembro
    username: string = "";
    name: string = "";
    surname: string = "";
    num_doc: string = "";
    email: string = "";
    password?: string = "";
    token: string = "";
    is_active: number = 0;
    created_at: string = "";
    image: string = "";
    avatar!: string ;
    role?: 'SUPERADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST';
    status?: 'ACTIVE' | 'INACTIVE' ;    



    // public get isActive():boolean{
    //     return (this.is_active === 1 ? true: false);
    // }


    get imagenUrl(){

      if(!this.image){
        return `${base_url}users/no-image.jpg`;
      } else if(this.image.includes('https')){
        return this.image;
      } else if(this.image){
        return `${base_url}users/${this.image}`;
      }else {
        return `${base_url}/no-image.jpg`;
        // return `./assets/img/no-image.jpg`;
      }

    }

}
