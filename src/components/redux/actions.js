/*
 * action types
 */

export const SET_SCRAPED_IDS = 'SET_SCRAPED_IDS';

/*
 * action creators
 */

export function setScrapedIds(scrapedIds) {
  return { type: SET_SCRAPED_IDS, scrapedIds }
}