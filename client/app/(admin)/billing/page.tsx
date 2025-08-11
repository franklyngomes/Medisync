"use client"
import React from 'react'
import { AppointmentIcon, ArrowRightIcon,PathologyIcon, RadiologyIcon } from '../../../icons'
import Button from "../../../components/ui/button/Button";
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import Link from 'next/link';


const Billing = () => {
  const billingOptions = [
    {
      title: "Appointment",
      icon: <AppointmentIcon className="text-gray-800 size-6 dark:text-white/90" />,
      route: "/billing/appointmentBilling"
    },
    // {
    //   title: "OPD - Outpatient",
    //   icon: <OutpatientIcon className="text-gray-800 size-6 dark:text-white/90" />,
    //   route: "/billing/OPDBilling"
    // },
    // {
    //   title: "IPD - Inpatient",
    //   icon: <InpatientIcon className="text-gray-800 size-6 dark:text-white/90" />,
    //   route: "/billing/IPDBilling"
    // },
    {
      title: "Pathology",
      icon: <PathologyIcon className="text-gray-800 size-6 dark:text-white/90" />,
      route: "/billing/pathologyBilling"
    },
    {
      title: "Radiology",
      icon: <RadiologyIcon className="text-gray-800 size-6 dark:text-white/90" />,
      route: "/billing/radiologyBilling"
    },
  ]
  return (
    <div>

      <PageBreadcrumb pageTitle="Billing" breadCrumbTitle="Billing" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {
          billingOptions.map((item, index) => (
            <div className="col-span-6 space-y-6 md:col-span-4" key={index}>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-end justify-between mt-5">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    {item.icon}
                  </div>
                  <Link href={item.route} className='block md:hidden'>
                    <Button size="sm" variant="primary" endIcon={<ArrowRightIcon />}>
                    </Button>
                  </Link>
                </div>

                <div className="flex items-end justify-between mt-5">
                  <h5 className="mt-2 font-bold text-gray-800 text-lg dark:text-white/90">
                    {item.title}
                  </h5>
                  <Link href={item.route} className='hidden md:block'>
                    <Button size="sm" variant="primary" endIcon={<ArrowRightIcon />}>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Billing