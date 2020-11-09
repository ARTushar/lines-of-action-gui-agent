#include <bits/stdc++.h>
#include "Player.cpp"

using namespace std;

int main(int argc, char *argv[])
{
  srand(time(NULL));

  char myType = argv[1][0];
  int boardSize = stoi(argv[2]);
  // freopen("input.txt", "r", stdin);

  Player *player = new Player(myType, boardSize, 4, 5);

  while (true)
  {
    player->setBoard();
    player->printAgentMove();
    player->clearBoard();
  }
  // player->setBoard();

  // vector<pair<double, pair<MOVE, BOARD>>> moves = player->getAllMoves(player->board, player->myType);

  // for(int i = 0; i < moves.size(); i++){
  //   player->logFile << "Score: " << moves[i].first << " "  << moves[i].second.first.first.first << " " << moves[i].second.first.first.second << " " << moves[i].second.first.second.first << " " << moves[i].second.first.second.second << endl;
  //   player->printBoard(moves[i].second.second);
  // }
  // cout << player->calculateTotalQuads(player->board, player->myType, 3);
  // player->printAgentMove();
  // player->clearBoard();
  //testing score funciton

  // player->setBoard();
  // cout << player->getScore(player->board) << endl;

  //testing getAllPositions

  // player->setBoard();

  // vector<Position> myCurrentPostions = player->getAllPositions(player->board, player->myType);

  // for(int i = 0; i < myCurrentPostions.size(); i++){
  //   cout << myCurrentPostions[i].row << " " << myCurrentPostions[i].col << endl;
  // }

  //testing updateBoard

  // player->setBoard();

  // BOARD newBoard = player->updateBoard(player->board, Position{2, 3}, Position{4, 3}, player->myType);
  // player->printBoard(newBoard);
  // cout << player->hasWon(newBoard, player->myType);

  //testing bfs
  // player->setBoard();
  // cout << player->bfs(player->board, Position{1, 7}) << endl;

  //testing haswon
  // cout << player->hasWon(player->board, 'b') << endl;

  return 0;
}