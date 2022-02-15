import { Department } from './Department.interface';

export interface User {
  surname: string;
  othernames: string;
  email: string;
  type: string;
  avatar: string;
  admin?: Admin;
  student?: Student;
  teacher?: Teacher;
}

export interface Admin {
  id: number;
  userId: number;
}

export interface Student {
  id: number;
  userId: number;
  deptId: number;
  levelId: number;
  regNo: string;
  level?: Level;
  department?: Department;
}

export interface Teacher {
  id: number;
  userId: number;
  deptId: number;
  department?: any;
}

export interface Level {
  id: number;
  name: string;
}
