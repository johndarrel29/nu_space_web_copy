import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useUserStoreWithAuth } from "../../store";

// the selected role is the one the user passed, not the role of the
// admin can be changed into avp, coordinator, director, or super_admin
// super_admin can be changed into admin or coordinator
// rso_representative can be changed into student
// student can be changed into rso_representative

// add roles: avp, coordinator, director, super_admin if the selected role is admin
// fix update issue to the mutate function


export default function Dropdown({ selectedRole, setSelectedRole }) {
  const { isUserAdmin, isSuperAdmin, isCoordinator } = useUserStoreWithAuth();

  // function to set the value selected back to parent
  const handleMenuItemClick = (item) => {
    setSelectedRole(item);
  };

  // possible role options based on the selected role
  const studentOptions = ["student", "rso_representative"];
  const adminOptions = ["admin", "coordinator", "director", "avp", "super_admin"];
  const superAdminOptions = ["admin", "coordinator"];

  // helper to render menu items 
  const renderMenuItem = (role) => {

    // don't render if it matches current selection
    if (role === selectedRole) return null;

    const displayName =
      role === "super_admin" ? "Super Admin" :
        role === "rso_representative" ? "RSO Representative" :
          role.charAt(0).toUpperCase() + role.slice(1);

    return (
      <MenuItem key={role}>
        <a
          onClick={() => handleMenuItemClick(role)}
          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer hover:text-black"
        >
          {displayName}
        </a>
      </MenuItem>
    );

  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className={`inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50`}>
          {selectedRole === 'admin' ? (
            <span className="text-gray-900">Admin</span>
          ) :
            selectedRole === 'coordinator' ? (
              <span className="text-gray-900">Coordinator</span>
            ) :
              selectedRole === 'super_admin' ? (
                <span className="text-gray-900">Super Admin</span>
              ) :
                selectedRole === 'director' ? (
                  <span className="text-gray-900">Director</span>
                ) :
                  selectedRole === 'avp' ? (
                    <span className="text-gray-900">AVP</span>
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
          {/* Student and RSO Representative Roles */}
          {(selectedRole === 'student' || selectedRole === 'rso_representative') && (
            studentOptions.map(role => renderMenuItem(role))
          )}

          {/* Admin and related roles */}
          {(selectedRole === "admin" || selectedRole === "coordinator" || selectedRole === 'avp' || selectedRole === 'director') ? (
            adminOptions.map(role => renderMenuItem(role))
          ) :
            selectedRole === 'super_admin' && (
              superAdminOptions.map(role => renderMenuItem(role))
            )
          }
        </div>
      </MenuItems>
    </Menu>
  )
}
