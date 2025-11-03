import React, { useContext, useEffect, useMemo } from 'react'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CBadge,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAll } from '../../../slices/tenant/user'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import { PermissionContext } from '../../../context/permission'

const UserList = () => {
  const { message, users } = useSelector((state) => state.user)
  let { userPermissions } = useContext(PermissionContext)
  console.log(userPermissions)
  // Get permissions from auth state
  //   console.log(permission)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Find User module permissions
//   let userPermissions = useMemo(() => {
//     // const userModule = permission?.find((perm) => perm.module?.name === 'User')
//     return {
//       canView: true,
//       canCreate: true,
//       canEdit: true,
//       canDelete: true,
//       //   canView: userModule?.can_view || false,
//       //   canCreate: userModule?.can_create || false,
//       //   canEdit: userModule?.can_edit || false,
//       //   canDelete: userModule?.can_delete || false,
//     }
//   }, [permissions])

  useEffect(() => {
    if (userPermissions.canView) {
      dispatch(getAll())
    }
  }, [dispatch, userPermissions.canView])

  // Handle navigation to add user page
  const handleAddUser = () => {
    navigate('/users/add')
  }

  // Handle edit user
  const handleEdit = (userId) => {
    navigate(`/users/edit/${userId}`)
  }

  // Handle delete user
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Dispatch delete action here
      console.log('Delete user:', userId)
    }
  }

  // If user doesn't have view permission, show access denied
  if (!userPermissions.canView) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">You don't have permission to view users.</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>User Management</h3>
        {userPermissions.canCreate && (
          <CButton color="primary" onClick={handleAddUser}>
            <CIcon icon={cilPlus} className="me-2" />
            Add User
          </CButton>
        )}
      </div>

      {message && <div className="alert alert-info mb-3">{message}</div>}

      {
        <CTable striped hover responsive align="middle">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">User ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Username</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              {(userPermissions.canEdit || userPermissions.canDelete) && (
                <CTableHeaderCell scope="col" className="text-center">
                  Actions
                </CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>
          {/* {console.log(users)} */}
          <CTableBody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <CTableRow key={user.user_id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{user.user_id}</CTableDataCell>
                  <CTableDataCell>{user.username}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="info">{user.role?.name || 'N/A'}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={user.is_active ? 'success' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </CBadge>
                  </CTableDataCell>
                  {(userPermissions.canEdit || userPermissions.canDelete) && (
                    <CTableDataCell className="text-center">
                      {userPermissions.canEdit && (
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(user.user_id)}
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                        </CButton>
                      )}
                      {userPermissions.canDelete && (
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => handleDelete(user.user_id)}
                        >
                          <CIcon icon={cilTrash} className="me-1" />
                        </CButton>
                      )}
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center py-4">
                  No users found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      }
    </div>
  )
}

export default UserList


