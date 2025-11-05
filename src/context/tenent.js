import React, { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../apis/axiosInstance'

// Create context
const TenantContext = createContext()

// Provider component
const Tenant = ({ children }) => {
  const [users, setUser] = useState([])
  const [userPermissions, setUserPermissions] = useState(() =>
    JSON.parse(localStorage.getItem('permission')),
  )
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  let login = async (credentials) => {
    const info = await api
      .post('tenant/login', credentials)
      .then((result) => {
        return { status: result.status, data: result.data }
      })
      .catch((error) => {
        console.log(error)
        return { message: error.response.data.message }
      })

    // console.log('login api : ', info)
    if (info.status == 200) {
      console.log(info.data.data.permissions, info.data.data)
      // setUserPermissions(info.data.data.permissions)
      localStorage.setItem('token', info.data.data.token)
      localStorage.setItem('permission', JSON.stringify(info.data.data.permissions))

      navigate('/tenant/user/get')
    }
    setMessage(info.data.message)
  }

  const getUsers = async () => {
    const info = await api
      .get('tenant/user')
      .then((result) => {
        // console.log(result)
        return { status: result.status, data: result.data }
      })
      .catch((error) => {
        console.log(error)
        return { message: error.response.data.message }
      })
    console.log(info)
    if (info.status == 200) {
      console.log(info.data.data)
      setUser(info.data.data)
    }
  }

  const getPermision = async () => {
    const info = await api
      .get('tenant/permission')
      .then((result) => {
        return { status: result.status, data: result.data }
      })
      .catch((error) => {
        console.log(error)
        return { message: error.response.data.message }
      })
    if (info.status == 200) {
      setUserPermissions(info.data.permissions)
    }
  }

  return (
    <TenantContext.Provider
      value={{
        // functions
        login,
        getUsers,
        getPermision,
        // states
        userPermissions,
        message,
        users,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}
export { Tenant, TenantContext }
