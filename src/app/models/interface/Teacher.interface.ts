export interface CreateTeacherRequest {
  surname: string;
  othernames: string;
  email: string;
  password: string;
  deptId: number;
}

export interface UpdateTeacherRequest {
  id: number;
  surname: string;
  othernames: string;
  email: string;
  password?: string;
  deptId: number;
}

export interface DeleteTeacherRequest {
  id: number;
}
