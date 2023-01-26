import { take, fork, race, getContext, put } from 'redux-saga/effects'
import {
  MORFIX_DOWNLOAD_CIPHER_TEXT_REQUEST,
  MORFIX_DOWNLOAD_CIPHER_TEXT_SUCCESS,
  MORFIX_DOWNLOAD_CIPHER_TEXT_FAILURE
} from 'store/constants/morfix'

import { morfixTriggerDownloadRequest } from 'store/actions/morfix'

export default function* downloadCipherTextWatcher() {
  const workers = yield getContext('workers')
  while (true) {
    const action = yield take(MORFIX_DOWNLOAD_CIPHER_TEXT_REQUEST)
    yield fork(workers.morfix.downloadCipherTextWorker, action)

    const { success } = yield race({
      success: take(MORFIX_DOWNLOAD_CIPHER_TEXT_SUCCESS),
      fail: take(MORFIX_DOWNLOAD_CIPHER_TEXT_FAILURE)
    })

    if (success) {
      yield put(
        morfixTriggerDownloadRequest({
          url: success.payload.link,
          fileName: success.payload.name
        })
      )
    }
  }
}
