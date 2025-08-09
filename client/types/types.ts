export interface Patient {
  _id: string;
  name: string;
  phone: string;
  address: string;
  bloodType: string;
  gender: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Doctor {
  _id: string;
  name: string;
  phone: string;
  email: string;
  image: string;
  specialization: string;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface AppointmentListProps {
  patientId: Patient;
  note: string;
  doctorId: Doctor;
  appointmentDate: Date;
  status?: string;
  _id: string;
}
export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string,
  email: string;
  password: string;
  role: string;
  designation: string;
  doctorId?: string;
  image?: string;
  verified: boolean;
  verificationToken: string;
  verificationTokenExpires: Date;
  deletedAt: null;
}

export interface StoreState {
  isEditing: boolean,
  editId: string,
  setIsEditing: (value: boolean) => void;
  setEditId: (id: string) => void;
  user: UserProfile | null
  setUser: (value: UserProfile) => void
}