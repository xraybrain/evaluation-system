export interface CreateStudentRequest {
  surname: string;
  othernames: string;
  email: string;
  password: string;
  deptId: number;
  levelId: number;
  regNo: string;
}

export interface UpdateStudentRequest {
  id: number;
  surname: string;
  othernames: string;
  email: string;
  password?: string;
  deptId: number;
  levelId: number;
}

export interface DeleteStudentRequest {
  id: number;
}
