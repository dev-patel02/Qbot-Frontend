import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../apis/axiosInstance'

// Create context
const TenantContext = createContext()

// Provider component
const Tenant = ({ children }) => {
  // const { permission } = useSelector((state) => state.auth) // from Redux store
  const [users, setUser] = useState([])
  const [userPermissions, setUserPermissions] = useState([])
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  // const dispatch = useDispatch()

  let login = async (credentials) => {
    const info = await api
      .post('tenant/login', credentials)
      .then((result) => {
        return { status: result.status, data: result.data }
      })
      .catch((error) => {
        return { message: error.response.data.message }
        // console.log(error.response.data.log);
        // return { log: error };
      })

    console.log('login api : ', info)
    if (info.status == 200) {
      console.log(info.data.data.permissions)
      localStorage.setItem('token', info.data.data.token)
    setUserPermissions(info.data.data.permissions)
      
      // navigate('/tenant/users/get')
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
      return { message: error.response.data.message }
    })
    if(info.status == 200) {
      console.log(info.data.data)
      setUser(info.data.data)
    }
  }

  // console.log(permission)
  useEffect(() => {
    // setUserPermissions(permission)
  }, [])

  return (
    <TenantContext.Provider
      value={{
        login,
        getUsers,
        userPermissions,
        message,
        users
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}
export { Tenant, TenantContext }
