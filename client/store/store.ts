import {create} from "zustand"
import { StoreState } from "../types/types"

export const useStore = create<StoreState>((set) => ({
  isEditing: false,
  editId: "",
  setIsEditing: (value) => set(() => ({isEditing: value})),
  setEditId: (id) => set(() => ({editId: id})),
  user: null,
  setUser: (value) => set(() => ({user: value}))
}))