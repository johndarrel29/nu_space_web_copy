import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


export default function Dropdown({ selectedRole, setSelectedRole}) {
  const handleMenuItemClick = (item) => {

      setSelectedRole(item);
    
  };

  return (
    
    <Menu as="div" className="relative inline-block text-left">
      <div>
      <MenuButton className={`inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50`}>
        {selectedRole === 'admin' ? (
          <span className="text-gray-900">Admin</span>
        ) : 
        selectedRole === 'superadmin' ? (
          <span className="text-gray-900">Superadmin</span>
        ) :

        (
          <span className="text-gray-900">{selectedRole}</span>
        )}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
        {['student', 'student/rso'].includes(selectedRole) && (
          <>
            <MenuItem>
              <a
                
                onClick={() => handleMenuItemClick("student")}
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer hover:text-black"
              >
                student
              </a>
            </MenuItem>
            <MenuItem>
              <a
                onClick={() => handleMenuItemClick("student/rso")}
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer hover:text-black"
              >
                student/rso
              </a>
            </MenuItem>
          </>
        )}
        {selectedRole === 'admin' ? (
          <MenuItem>
            <a
              onClick={() => handleMenuItemClick("superadmin")}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer hover:text-black"
            >
              Superadmin
            </a>
          </MenuItem>
        )
        : 
        selectedRole === 'superadmin' && (
          <MenuItem>
            <a
              onClick={() => handleMenuItemClick("admin")}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer hover:text-black"
            >
              Admin
            </a>
          </MenuItem>
        )
      }

 
        </div>
      </MenuItems>
    </Menu>
  )
}
