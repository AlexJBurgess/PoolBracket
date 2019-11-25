import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const players = [
  {name: 'Jonathan Royle', country: 'ENG'}, //1
  {name: 'Sudeep Bhalsod', country: 'ENG'},//2
  {name: 'Vassilis Mertzanis', country: 'GRE'},//3
  {name: 'Tony Watts', country: 'WAL'},//4
  {name: 'Darren Udaiyan', country: 'MRI'},//5
  {name: 'Jason Allen', country: 'NIR'},//6
  {name: 'Dan Asenjo', country: 'CHI'},//7
  {name: 'Dan O`Doughty-Edwards', country: 'WAL'},//8
  {name: 'Jamie Coltman', country: 'ENG'},  
  {name: 'Jackson "Canuck" Wo', country: 'CAN'},
  {name: 'Thomas Rychlik', country: null},
  {name: 'Andrew McClement', country: 'SCO'},
  {name: 'Neil Adams', country: 'ENG'},
  {name: 'Christmas France', country: 'ENG'},
  {name: 'Sonia Sadique', country: 'ENG'},
  {name: 'Luke Cave', country: 'ENG'},
  {name: 'Andy Bird', country: 'ENG'},
  {name: 'Nick Berry', country: 'ENG'},
  {name: 'John "The Hustler" Henderson', country: 'ENG'},
  {name: 'Daniel Crisp', country: 'ENG'},
  {name: 'Dan Escott', country: 'ENG'},
  {name: 'Alex Burgess', country: 'ENG'},
  {name: 'Ray Maillou', country: 'ENG'},
  {name: 'Andrew Smith', country: 'ENG'},
  {name: 'Steph "The Greek" Pieri', country: 'CYP'},
  {name: 'Steve Adams', country: 'RSA'},
  {name: 'James Naish', country: 'ENG'},
  {name: 'Robert William Mill', country: 'ENG'},
  {name: 'John Mason', country: 'ENG'},
  {name: 'Chris Wainwright', country: 'ENG'},
  {name: 'Andrei Fînaru', country: 'ROU'},
  {name: 'Rich Dewhirst', country: 'ENG'}
];

function Player(props) {
  var matchWinner = props.getWinner(props.matchId);
  var matchInProgress = matchWinner == null;
  var winStateClass = 'player';
  var playerName = props.playerId == null ? null : players[props.playerId].name;
  var playerCountryCode = props.playerId == null ? null : players[props.playerId].country;
  var playerCountryUri = playerCountryCode == null ? null : "https://ssjgaso.blob.core.windows.net/flags/" + playerCountryCode + "-1.png" ;
  if(!matchInProgress)
  { 
    winStateClass += matchWinner == props.playerId ? ' winner' : ' loser';
  }
  else if(props.playerCanBeSetAsWinner){
    winStateClass += ' inprogress';
  }
  return (    
    <div className={winStateClass}>
      <img src={playerCountryUri}></img>
      {props.playerCanBeSetAsWinner &&
      <div className="button" onClick={() => props.setWinner(props.matchId, props.playerId)}>        
        <div>
        {playerName}
        </div>
      </div>
      }
      {!props.playerCanBeSetAsWinner && playerName &&
      <div>   
        <div>         
          {playerName}
        </div>
      </div>
      }
      {!props.playerCanBeSetAsWinner && playerName == null &&
      <div>TBD</div>
      }
      {matchWinner!= null && matchWinner == props.playerId &&
      <span>🏆</span>}
      {matchWinner!= null && matchWinner != props.playerId &&
      <span>💀</span>}
      {playerName && matchInProgress && props.matchId > (players.length / 2) - 1 &&
      <div className="button" onClick={() => props.undoLastWin(props.playerId)}>❌</div>}

    </div>
  );  
}

function Match(props) {
  var matchInProgress = props.getWinner(props.matchId) == null;
  var playerCanBeSetAsWinner = matchInProgress && props.player1 != null && props.player2 != null;
  var matchComplete = props.getWinner(props.matchId) != null && props.matchId != 30 ? 'complete' : ''; //exclude final
  var matchTBD = props.player1 == null && props.player2 == null ? 'tbd' : '';

  return (    
    <div className={'match ' + matchComplete + ' ' + matchTBD}>        
      <Player matchId={props.matchId} playerId={props.player1} playerCanBeSetAsWinner={playerCanBeSetAsWinner} setWinner={props.setWinner} getWinner={props.getWinner} undoLastWin={props.undoLastWin}/>
      <div className="vs"></div>
      <Player matchId={props.matchId} playerId={props.player2} playerCanBeSetAsWinner={playerCanBeSetAsWinner} setWinner={props.setWinner} getWinner={props.getWinner} undoLastWin={props.undoLastWin}/>      
    </div>
  ); 
}

class Bracket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      winners: []
    };

    this.loadData();
  }

  loadData() {
    var loadWinners = [];

    fetch('/pooltree/api/GameState/MatchResults')
    .then(response => response.json())
    .then(data => {
      data.forEach(function(match) {
        loadWinners[match.matchId] = match.winner;
      });  
  
      this.setState({winners: loadWinners});
    });

    setTimeout(() => { this.loadData() }, 5000);
  }

  setWinner (matchId, winner) {
    const winners = this.state.winners.slice();
    winners[matchId] = winner;
    this.setState({winners: winners});

    fetch('/pooltree/api/GameState/MatchResult', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "MatchId": matchId,
        "Winner": winner
      })
    })    
  }

  getWinner (matchId) {
    return this.state.winners[matchId];
  }

  undoLastWin (playerId) {
    var matchId;
    const winners = this.state.winners.slice();
    for(var i = winners.length-1; i >= 0; i--) {
      if(winners[i]==playerId)
      {
        matchId = i;
        winners[i] = null;
        break;
      }
    }
    this.setState({winners: winners});

    fetch('/pooltree/api/GameState/ClearMatchResult?matchId=' + matchId, { method: 'post' });
  }

  renderMatch(matchId, player1, player2) {
    return <Match player1={player1} player2={player2} matchId={matchId} setWinner={this.setWinner.bind(this)} getWinner={this.getWinner.bind(this)} undoLastWin={this.undoLastWin.bind(this)}/>;
  }

  render() {    
    return (
      <div>
        {this.state.winners[30] != null &&
          <div className="banner">
            <span>🙌🎉 Winner 2019: <span className="winnerName">{players[this.state.winners[30]].name}</span> 🎉🙌</span>
            <span className="button" onClick={() => this.undoLastWin(this.state.winners[30])}>❌</span>
          </div>
        } 
        {/*<span className={'refresh ' + this.state.loading} onClick={() => this.loadData()}>🔄</span>*/}
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
        <img className="background-image" src="http://cam35.spiralsoft.local/mjpg/video.mjpg"/>        
        <h1>🎄🎱🎅🏿 Christmas Pool Tree 🎅🎱🎄</h1>
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
