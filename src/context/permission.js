import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Create context
export const PermissionContext = createContext()

// Provider component
export const PermissionProvider = ({ children }) => {
  const { permission } = useSelector((state) => state.auth) // from Redux store
  const [userPermissions, setUserPermissions] = useState([])
  // const dispatch = useDispatch()

  console.log(permission)
  useEffect(() => {
    setUserPermissions(permission)
  }, [])

  return (
    <PermissionContext.Provider value={{ userPermissions }}>{children}</PermissionContext.Provider>
  )
}
