import React from 'react';
import $ from 'jquery';
import {setScrapedIds} from "./redux/actions";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardList: [],
      showScrapedOnly: false,
      index: 0,
      page: 1,
      is_last: false,
      scrapedIds: []
    };
  }

  componentWillMount() {
    const { store } = this.props;
    // localstorage 에서 스크랩 목록을 가져온다.
    const stores = store.getState().stores;
    if (!stores.scrapedIds || !Array.isArray(stores.scrapedIds)) {
      return; // 아직 초기화가 되어있지 않으면 리턴. 스크랩 하는순간 초기화됨
    }
    this.setState({scrapedIds: stores.scrapedIds})
  }

  componentDidMount() {
    this.getImages(); // 첫 페이지 가져오기
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const { innerHeight } = window;
    const { scrollHeight, scrollTop } = document.body;
    const { documentElement } = document; //for IE

    const top = (documentElement && documentElement.scrollTop) || scrollTop;

    // 전체 길이 - 현재 창길이 - 높이
    if ((scrollHeight - innerHeight - top) < 100) {
      this.getImages(); // 스크롤이 100 이내로 남은 경우 다음 이미지 로딩
    }
  };

  getImages() {
    const { page } = this.state;

    // API로 데이터를 가져오는 경우는 페이지 정보를 토대로 마지막 페이지이면 더이상 불러오지 않는다.

    let url = "https://s3.ap-northeast-2.amazonaws.com/bucketplace-coding-test/cards/page_" + page + ".json";
    $.ajax({method: 'GET', url: url}).then((response) => {
      if (response.length > 0) {
        // 지금은 응답 데이터 유무로 마지막 페이지여부를 판단하지만
        // 실제로는 서버에서 내려주는 페이지 갯수로 판단하여 api 요청 자체를 하지 않아야 한다.
        // 페이지 로딩 후 다음에 가져올 페이지로 변경
        this.setState({cardList: this.state.cardList.concat(response), page: page + 1});
      }
    });
  }

  setFilter() {
    this.setState({showScrapedOnly: !this.state.showScrapedOnly});
  }

  /* 스크랩 버튼 클릭시 호출 */
  setScrap(card_id) {
    const { store } = this.props;
    const { scrapedIds } = this.state;

    let index = scrapedIds.indexOf(card_id);
    if (index < 0) {
      scrapedIds.push(card_id);
    } else {
      scrapedIds.splice(index, 1);
    }

    store.dispatch(setScrapedIds(scrapedIds)); //local storage 에 저장
    this.setState({scrapedIds: scrapedIds}); // 화면에 반영을 위해 state에 저장
  }

  checkIdScraped(card_id, check_store) {
    if (!check_store) { return true; }
    const { scrapedIds } = this.state;
    return scrapedIds.indexOf(card_id) >= 0
  }

  /* 사진 1장 표시 */
  displayCard(card) {
    return <div className="card">
      <div className="user">
        <img src={card.profile_image_url}/>
        <span>{card.nickname}</span>
      </div>
      <div className="image">
        <img src={card.image_url}/>
        <div className={this.checkIdScraped(card.id, true) ? "scrap on" : "scrap off"}
             onClick={() => this.setScrap(card.id)}/>
      </div>
    </div>
  }

  render() {
    const { cardList, showScrapedOnly } = this.state;

    return <div>
      <div className="filter" onClick={() => this.setFilter()}>
        <div className={showScrapedOnly ? "check-scrap enabled" : "check-scrap disabled"} />
        <span>스크랩한 것만 보기</span>
      </div>
      {cardList.filter((card) => this.checkIdScraped(card.id, showScrapedOnly)).map((card, index) => {
        return this.displayCard(card, index);
      })}
    </div>
  }
}