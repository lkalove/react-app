import React from 'react';
import '../stylesheets/App.css';
import '../stylesheets/card_list.css';
import CardList from './card_list';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <CardList {...this.props} />
        </header>
      </div>
    );
  }
}