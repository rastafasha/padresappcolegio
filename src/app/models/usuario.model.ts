import { environment } from "../environments/environment";


const base_url = environment.url_media;
export class Usuario {
  id!: number;
  // role_id: number = 3; // 3 = Rol miembro
  name: string = "";
  surname: string = "";
  email: string = "";
  password?: string = "";
  first_name: string = "";
  last_name: string = "";
  token: string = "";
  is_active: number = 0;
  n_doc: number = 0;
  grado: number = 0;
  created_at: string = "";
  avatar: string = "";
  // role?: 'SUPERADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST';
  roles?: any;




}
