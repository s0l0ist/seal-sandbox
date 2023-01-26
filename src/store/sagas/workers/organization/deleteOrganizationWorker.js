import { call, put, getContext } from 'redux-saga/effects'
import utils from 'shared/utils'
import { deleteOrganizationFailure, deleteOrganizationSuccess } from 'store/actions/organization'

export default function* deleteOrganizationWorker(action) {
  try {
    const { rest } = yield getContext('api')
    const payload = yield call(utils.removeEmptyValues, action.payload)
    const { data, status } = yield call(rest.backend.deleteOrganization, payload)
    const result = {
      ...data,
      statusCode: status
    }
    data.statusCode = status
    yield put(deleteOrganizationSuccess(result))
  } catch (error) {
    yield put(deleteOrganizationFailure(error))
  }
}
