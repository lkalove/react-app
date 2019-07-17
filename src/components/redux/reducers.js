import {combineReducers} from 'redux'
import {SET_SCRAPED_IDS} from './actions'

function stores(state = [], action) {
  switch (action.type) {
    case SET_SCRAPED_IDS:
      if (action.scrapedIds) {
        return {
          scrapedIds: action.scrapedIds
        };
      } else {
        return {};
      }
    default:
      return state
  }
}

const storeApp = combineReducers({
  stores
});

export default storeApp