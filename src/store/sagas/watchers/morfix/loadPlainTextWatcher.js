import { take, call, getContext, actionChannel } from 'redux-saga/effects'
import { buffers } from 'redux-saga'
import { MORFIX_LOAD_PLAIN_TEXT_REQUEST } from 'store/constants/morfix'

export default function* loadPlainTextWatcher() {
  const workers = yield getContext('workers')
  const throttleChannel = yield actionChannel(MORFIX_LOAD_PLAIN_TEXT_REQUEST, buffers.expanding(1))
  while (true) {
    const action = yield take(throttleChannel)
    yield call(workers.morfix.loadPlainTextWorker, action)
  }
}
