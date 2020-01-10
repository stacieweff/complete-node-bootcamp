/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? 'http://localhost:3000/api/v1/users/updateMyPassword' : 'http://localhost:3000/api/v1/users/updateMe' // ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    })

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
      // window.setTimeout(() => {
      //   location.assign('/')
      // }, 1500)
    }

  } catch (error) {
    showAlert('error', error.response.data.message)
  }
}