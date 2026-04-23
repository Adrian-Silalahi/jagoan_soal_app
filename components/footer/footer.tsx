"use client"

import React from "react"
import { usePathname } from "next/navigation"

const Footer = () => {
  const pathName = usePathname()

  if (pathName === "/login") {
    return null
  }

  return (
    <footer className="mt-20 bg-white dark:bg-gray-800">
      <div className="container w-full p-4 md:flex md:items-center md:justify-between md:p-6">
        <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            JagoanSoal™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}

export default Footer
