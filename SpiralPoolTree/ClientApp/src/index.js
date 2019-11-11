import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const players = ['Alex Woods', 'Chris France', 'Chris Wainwright', 'Daniel Asenjo', 'Darren Udaiyan', 'Jamie Coltman', 'Jonny Royle', 'Stephen Adams', 'Alex Woods 2', 'Chris France 2', 'Chris Wainwright 2', 'Daniel Asenjo 2', 'Darren Udaiyan 2', 'Jamie Coltman 2', 'Jonny Royle 2', 'Stephen Adams 2',
'Alex Woods', 'Chris France', 'Chris Wainwright', 'Daniel Asenjo', 'Darren Udaiyan', 'Jamie Coltman', 'Jonny Royle', 'Stephen Adams', 'Alex Woods 2', 'Chris France 2', 'Chris Wainwright 2', 'Daniel Asenjo 2', 'Darren Udaiyan 2', 'Jamie Coltman 2', 'Jonny Royle 2', 'Stephen Adams 2'];
/*const players = [
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
'Player Sixteen',
'Player Seventeen',
'Player Eighteen',
'Player Nineteen',
'Player Twenty',
'Player Twenty One',
'Player Twenty Two',
'Player Twenty Three',
'Player Twenty Four',
'Player Twenty Five',
'Player Twenty Six',
'Player Twenty Seven',
'Player Twenty Eight',
'Player Twenty Nine',
'Player Thrity',
'Player Thirty One',
'Player Thirty Two'
]*/

function Player(props) {
  var matchWinner = props.getWinner(props.matchId);
  var matchInProgress = matchWinner == null;
  var winStateClass = 'player';
  if(!matchInProgress)
  { 
    winStateClass += matchWinner == props.playerId ? ' winner' : ' loser';
  }
  else if(props.playerCanBeSetAsWinner){
    winStateClass += ' inprogress';
  }
  return (    
    <div className={winStateClass}>
      {props.playerCanBeSetAsWinner &&
      <div class="button" onClick={() => props.setWinner(props.matchId, props.playerId)}>{props.playerName}</div>
      }
      {!props.playerCanBeSetAsWinner && props.playerName &&
      <div>{props.playerName}</div>
      }
      {!props.playerCanBeSetAsWinner && props.playerName == null &&
      <div>TBD</div>
      }
      {matchWinner!= null && matchWinner == props.playerId &&
      <span>🏆</span>}
      {matchWinner!= null && matchWinner != props.playerId &&
      <span>💀</span>}
      {props.playerName && matchInProgress && props.matchId > (players.length / 2) - 1 &&
      <div class="button" onClick={() => props.undoLastWin(props.playerId)}>❌</div>}

    </div>
  );  
}

function Match(props) {
  var matchInProgress = props.getWinner(props.matchId) == null;
  var playerCanBeSetAsWinner = matchInProgress && props.player1 != null && props.player2 != null;

  return (    
    <div className="match">        
      <Player matchId={props.matchId} playerId={props.player1} playerName={players[props.player1]} playerCanBeSetAsWinner={playerCanBeSetAsWinner} setWinner={props.setWinner} getWinner={props.getWinner} undoLastWin={props.undoLastWin}/>
      <div className="vs"></div>
      <Player matchId={props.matchId} playerId={props.player2} playerName={players[props.player2]} playerCanBeSetAsWinner={playerCanBeSetAsWinner} setWinner={props.setWinner} getWinner={props.getWinner} undoLastWin={props.undoLastWin}/>      
    </div>
  ); 
}

class Bracket extends React.Component {
  constructor(props) {
    super(props);

    //ToDO: load winnersData from backend
    var winnersData = [{      
        matchId: 0,
        winner: 0      
    }];

    var loadWinners = [];  
    winnersData.forEach(function(match) {
      loadWinners[match.matchId] = match.winner;
    });  

    this.state = {
      winners: loadWinners,
    };
  }

  setWinner (matchId, winner) {
    const winners = this.state.winners.slice();
    winners[matchId] = winner;
    this.setState({winners: winners});
  }

  getWinner (matchId) {
    return this.state.winners[matchId];
  }

  undoLastWin (playerId) {
    const winners = this.state.winners.slice();
    for(var i = winners.length-1; i >= 0; i--) {
      if(winners[i]==playerId)
      {
        winners[i] = null;
        break;
      }
    }
    this.setState({winners: winners});
  }

  renderMatch(matchId, player1, player2) {
    return <Match player1={player1} player2={player2} matchId={matchId} setWinner={this.setWinner.bind(this)} getWinner={this.getWinner.bind(this)} undoLastWin={this.undoLastWin.bind(this)}/>;
  }

  render() {    
    return (
      <div>
        {this.state.winners[30] != null &&
          <div className="banner">
            <span>🙌🎉 Winner is: <span className="winnerName">{players[this.state.winners[30]]}</span> 🎉🙌</span>
            <span onClick={() => this.undoLastWin(this.state.winners[30])}>❌</span>
          </div>
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
            {this.renderMatch(16, this.state.winners[0], this.state.winners[1])}
            {this.renderMatch(17, this.state.winners[2], this.state.winners[3])}
            {this.renderMatch(18, this.state.winners[4], this.state.winners[5])}
            {this.renderMatch(19, this.state.winners[6], this.state.winners[7])}
          </div>
          <div className="round">
            {this.renderMatch(24, this.state.winners[16], this.state.winners[17])}
            {this.renderMatch(25, this.state.winners[18], this.state.winners[19])}
          </div>
          <div className="round">
            {this.renderMatch(28, this.state.winners[24], this.state.winners[25])}
          </div>
          <div className="round final">
            {this.renderMatch(30, this.state.winners[28], this.state.winners[29])}
          </div>
          <div className="round">
            {this.renderMatch(29, this.state.winners[26], this.state.winners[27])}
          </div>
          <div className="round">
            {this.renderMatch(26, this.state.winners[20], this.state.winners[21])}
            {this.renderMatch(27, this.state.winners[22], this.state.winners[23])}
          </div>
          <div className="round">
            {this.renderMatch(20, this.state.winners[8], this.state.winners[9])}
            {this.renderMatch(21, this.state.winners[10], this.state.winners[11])}
            {this.renderMatch(22, this.state.winners[12], this.state.winners[13])}
            {this.renderMatch(23, this.state.winners[14], this.state.winners[15])}
          </div>
          <div className="round">
            {this.renderMatch(8, 16, 17)}
            {this.renderMatch(9, 18, 19)}
            {this.renderMatch(10, 20, 21)}
            {this.renderMatch(11, 22, 23)}
            {this.renderMatch(12, 24, 25)}
            {this.renderMatch(13, 26, 27)}
            {this.renderMatch(14, 28, 29)}
            {this.renderMatch(15, 30, 31)}
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
        <div class="background-image"></div>
        <h1>🎄🎱🎅🏿 Spiral Christmas Pool Tree 🎅🎱🎄</h1>
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
