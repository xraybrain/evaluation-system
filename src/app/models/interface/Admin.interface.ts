export interface CreateAdminRequest {
  surname: string;
  othernames: string;
  email: string;
  password: string;
}

export interface UpdateAdminRequest {
  id: number;
  surname: string;
  othernames: string;
  email: string;
}

export interface DeleteAdminRequest {
  id: number;
}
