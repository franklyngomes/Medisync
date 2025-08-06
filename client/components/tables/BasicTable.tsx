import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "../../icons";
import { useStore } from "../../store/store";
import { useModal } from "../../hooks/useModal";
import Image from "next/image";
import { BillGenerateQuery } from "../../api/query/BillGenerationQuery";
import toast from "react-hot-toast";
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";

export default function BasicTable({ tableColumns, data, onDelete, billOption, billType }: { tableColumns: any, data: any, onDelete: any, billOption?: boolean, billType?: string }) {
  const router = useRouter()
  const { setIsEditing, setEditId } = useStore();
  const { openModal, closeModal } = useModal();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const { mutateAsync: submit } = BillGenerateQuery()

  console.log(billType)
  console.log(data)

  const onClick = (data) => {
    const billData = data
    submit({ billType, billData }, {
      onSuccess: (res) => {
      }
    })
  }
  const previewBill = (invoice : string) => {
    if(!invoice){
      toast.error("No invoice found!")
      return
    }
    router.push(`http://localhost:5000${invoice}`)
  }

  function toggleDropdown(index: number) {
    setOpenDropdownIndex(prev => (prev === index ? null : index));
  }

  function closeDropdown() {
    setOpenDropdownIndex(null);
  }

  //Function to dynamically access nested object values
  function getValueByKeyPath(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
  return (
    <div className="overflow-hidden border border-gray-100 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {
                  tableColumns.map((item: any, index: number) => (
                    <TableCell
                      key={index}
                      isHeader
                      className="px-3 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-gray-200"
                    >
                      {item.label}
                    </TableCell>
                  ))
                }
                {
                  billOption &&
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-gray-200"
                  >
                    Invoice
                  </TableCell>
                }
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-gray-200"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] -z-10">
              {data && data.length > 0 ? (
                data.map((item, index: number) => (
                  <TableRow key={index} className="dark:hover:bg-gray-700 hover:bg-gray-100">
                    {tableColumns.map((col: any, colIndex: number) => (
                      <TableCell
                        key={colIndex}
                        className="px-3 py-3 text-gray-800 text-start text-theme-xs dark:text-gray-200"
                      >
                        {col.render
                          ? col.render(item, index)
                          : getValueByKeyPath(item, col.key || "")}
                      </TableCell>
                    ))}
                    {
                      billOption &&
                      <TableCell className=" text-gray-800 text-center dark:text-gray-200">
                        <Button size="x_sm" variant="primary" onClick={() => previewBill(item.invoice)}>
                          View <Image src={"/images/task/pdf.svg"} alt="pdf" width={20} height={20} />
                        </Button>
                      </TableCell>
                    }
                    <TableCell className="relative text-center">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(index)}
                        className="text-xs text-center"
                      >
                        <MoreDotIcon className="text-gray-800 dark:text-gray-200" />
                      </button>
                    </TableCell>
                    {openDropdownIndex === index && (
                      <td>
                        <div className="z-40">
                          <Dropdown
                            isOpen={true} onClose={closeDropdown}
                            className="w-40"
                          >
                            <DropdownItem
                              onItemClick={() => {
                                setIsEditing(true)
                                setEditId(item._id)
                                closeDropdown()
                                openModal()
                              }}
                              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                              Edit
                            </DropdownItem>
                            {
                              billOption &&
                              <DropdownItem
                                onItemClick={() => {
                                  onClick(item)
                                  closeDropdown()
                                }}
                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                              >
                                Generate Invoice
                              </DropdownItem>
                            }
                            <DropdownItem
                              onItemClick={() => {
                                onDelete(item._id)
                                closeDropdown()
                              }}
                              className="flex w-full font-normal text-left rounded-lg text-red-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                              Delete
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </td>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="px-4 py-3 text-red-500 dark:text-red-400 text-start text-theme-sm"
                  >
                    <p>No data found!</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
