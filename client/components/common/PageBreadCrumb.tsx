"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcrumbProps {
  pageTitle: string;
  breadCrumbTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle}) => {
  const pathname = usePathname()
  const routes = pathname.split("/").filter((segment) => segment)
  // console.log(routes)
  const formatRoute = (str : string) => {
      const string = str.replace(/([a-z])([A-Z])/g, '$1 $2' ).replace(/^./, match => match.toUpperCase())
      return string
  }

  return (
    <div className="gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
            >
              Home
            </Link>
          </li>
          {
            routes.map((item, index) => (
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                href={`/${item}`}
                key={index}
              >
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {formatRoute(item)}
              </Link>
            ))
          }
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
