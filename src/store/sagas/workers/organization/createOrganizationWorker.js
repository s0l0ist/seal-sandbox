import { call, put, getContext } from 'redux-saga/effects'
import utils from 'shared/utils'
import { createOrganizationFailure, createOrganizationSuccess } from 'store/actions/organization'

export default function* createOrganizationWorker(action) {
  try {
    const { rest } = yield getContext('api')
    const payload = yield call(utils.removeEmptyValues, action.payload)
    const { data, status } = yield call(rest.backend.createOrganization, payload)
    const result = {
      ...data,
      statusCode: status
    }
    data.statusCode = status
    yield put(createOrganizationSuccess(result))
  } catch (error) {
    yield put(createOrganizationFailure(error))
  }
}
