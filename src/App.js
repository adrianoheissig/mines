import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Alert} from 'react-native';

import params from './params';
import MineField from './components/MineField';
import Header from './components/Header';
import LevelSelection from './screens/LevelSelection';

import {
  createMineBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from './functions';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.createState();
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    const amount = Math.ceil(cols * rows * params.difficultLevel);
    return amount;
  };

  createState = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmount();
    return {
      board: createMineBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false,
    };
  };

  openField = (row, column) => {
    const board = cloneBoard(this.state.board);
    openField(board, row, column);
    const lost = hadExplosion(board);
    const won = wonGame(board);

    if (lost) {
      showMines(board);
      Alert.alert('Pedeu!!! Que pena', 'tente novamente!!!');
    }

    if (won) {
      Alert.alert('Parabéns', 'Você venceu!!!');
    }

    this.setState({board, won, lost});
  };

  selectField = (row, column) => {
    const board = cloneBoard(this.state.board);
    invertFlag(board, row, column);
    const won = wonGame(board);

    if (won) {
      Alert.alert('Parabéns', 'Você venceu!!!');
    }

    this.setState({board, won});
  };

  flagsLeft = () => this.minesAmount() - flagsUsed(this.state.board);

  newGame = () => this.setState(this.createState());

  levelSelected = level => {
    params.difficultLevel = level;
    this.newGame();
  };

  toggleLevelSelection = () => {
    const showLevelSelection = this.state.showLevelSelection;
    this.setState({showLevelSelection: !showLevelSelection});
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <LevelSelection
          isVisible={this.state.showLevelSelection}
          onLevelSelected={this.levelSelected}
          onCancel={this.toggleLevelSelection}
        />
        <Header
          flagsLeft={this.flagsLeft()}
          onNewGame={this.newGame}
          onFlagPress={this.toggleLevelSelection}
        />
        <MineField
          style={styles.board}
          board={this.state.board}
          onOpenField={this.openField}
          onSelectField={this.selectField}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  board: {
    backgroundColor: '#AAA',
    alignItems: 'center',
  },
});
