import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//const players = ['Alex Woods', 'Chris France', 'Chris Wainwright', 'Daniel Asenjo', 'Darren Udaiyan', 'Jamie Coltman', 'Jonny Royle', 'Stephen Adams', 'Alex Woods 2', 'Chris France 2', 'Chris Wainwright 2', 'Daniel Asenjo 2', 'Darren Udaiyan 2', 'Jamie Coltman 2', 'Jonny Royle 2', 'Stephen Adams 2'];
const players = [
'Player One',
'Player Two',
'Player Three',
'Player Four',
'Player Five',
'Player Six',
'Player Seven',
'Player Eight',
'Player Nine',
'Player Ten',
'Player Eleven',
'Player Twelve',
'Player Thirteen',
'Player Fourteen',
'Player Fifteen',
'Player Sixteen'
]

function Player(props) {
  return (    
    <button onClick={() => props.setWinner(props.matchId, props.playerId)}>{props.playerName}</button>
  );  
}

function Match(props) {
  return (    
    <div className="match">        
      <Player matchId={props.matchId} playerId={props.player1} playerName={players[props.player1]} setWinner={props.setWinner}/>
      <div className="vs">vs</div>
      <Player matchId={props.matchId} playerId={props.player2} playerName={players[props.player2]} setWinner={props.setWinner}/>
    </div>
  ); 
}

class Bracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winners: Array(7).fill(null),
    };
  }

  setWinner (matchId, winner) {
    const winners = this.state.winners.slice();
    winners[matchId] = winner;
    this.setState({winners: winners});
  }

  renderMatch(matchId, player1, player2) {
    return <Match player1={player1} player2={player2} matchId={matchId} setWinner={this.setWinner.bind(this)}/>;
  }

  render() {    
    return (
      <div>
        {this.state.winners[6] != null &&
          <div className="winner">🙌🎱🎉 Winner is: <span className="winnerName">{players[this.state.winners[14]]}</span> 🎉🎱🙌</div>
        } 
        <div className="bracket">   
          <div className="round">
            {this.renderMatch(0, 0, 1)}
            {this.renderMatch(1, 2, 3)}
            {this.renderMatch(2, 4, 5)}
            {this.renderMatch(3, 6, 7)}
            {this.renderMatch(4, 8, 9)}
            {this.renderMatch(5, 10, 11)}
            {this.renderMatch(6, 12, 13)}
            {this.renderMatch(7, 14, 15)}
          </div>
          <div className="round">
            {this.renderMatch(8, this.state.winners[0], this.state.winners[1])}
            {this.renderMatch(9, this.state.winners[2], this.state.winners[3])}
            {this.renderMatch(10, this.state.winners[4], this.state.winners[5])}
            {this.renderMatch(11, this.state.winners[6], this.state.winners[7])}
          </div>
          <div className="round">
            {this.renderMatch(12, this.state.winners[8], this.state.winners[9])}
            {this.renderMatch(13, this.state.winners[10], this.state.winners[11])}
          </div>
          <div className="round">
            {this.renderMatch(14, this.state.winners[12], this.state.winners[13])}
          </div>
        </div>
      </div>
    );
  }
}

class PoolTree extends React.Component {
  render() {
    return (
      <div className="pool-tree">
        <h1>Spiralaaa Christmas Pool Tree</h1>
        <Bracket />       
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <PoolTree />,
  document.getElementById('root')
);
