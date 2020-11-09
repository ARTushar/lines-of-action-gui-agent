#include <bits/stdc++.h>

using namespace std;

#define MOVE pair<pair<int, int>, pair<int,int>>
#define BOARD vector<vector<char>>
#define MAX_SCORE 1e8

int pieceSquareTable8[] =
    {
        -80, -25, -20, -20, -20, -20, -25, -80,
        -25, 10, 10, 10, 10, 10, 10, -25,
        -20, 10, 25, 25, 25, 25, 10, -20,
        -20, 10, 25, 50, 50, 25, 10, -20,
        -20, 10, 25, 50, 50, 25, 10, -20,
        -20, 10, 25, 25, 25, 25, 10, -20,
        -25, 10, 10, 10, 10, 10, 10, -25,
        -80, -25, -20, -20, -20, -20, -25, -80
};


int pieceSquareTable4[] =
    {
        -80, 20, 20, -80,
        -25, 80, 80, -25,
        -80, 20, 20, -80};

int pieceSquareTable6[] =
    {
        -80, -25, -20, -20, -25, -80,
        -25, 10, 10, 10, 10, -25,
        -20, 25, 50, 25, 10, -20,
        -20, 25, 50, 25, 10, -20,
        -25, 10, 10, 10, 10, -25,
        -80, -25, -20, -20, -25, -80};

struct ScoreStruct
{
  double score{};
  MOVE move{};
};

struct Position
{
  int row{};
  int col{};
};

class Timer
{
  int timeLimit = 1950;
  chrono::time_point<chrono::system_clock> startTime, currentTime;

public:
  Timer() {}

  Timer(const int &timeLimit)
  {
    this->timeLimit = timeLimit;
  }

  void startTimer()
  {
    startTime = chrono::high_resolution_clock::now();
  }

  int elapsedMilis()
  {
    currentTime = chrono::high_resolution_clock::now();
    return chrono::duration_cast<std::chrono::milliseconds>(currentTime - startTime).count();
  }

  bool timesUp()
  {
    return elapsedMilis() > timeLimit;
  }
};

class Player
{

public:
  char myType;
  char oppositionType;
  int maxAllowedTime;
  int startTime;
  int bestScore;
  MOVE bestMove;
  int maxAllowedDepth;
  Timer timer;

  BOARD board;
  int boardSize;
  int evaluator;
  ofstream logFile;

  double getScore(const BOARD &, int const&);
  double alphaBeta(BOARD &, char, int, double, double);
  vector<int> getTotalActiveCells(const BOARD &, const int &, const int &);
  vector<pair<int, int>> getValidMoves(const int &, const int &, const BOARD &);
  void printBoard(const BOARD &);
  bool isValidPosition(const int &, const int &);
  vector<Position> getNeighbors(const BOARD &, const int &, const int &);
  int getIndex(const Position &);
  int bfs(const BOARD &, const Position &);
  int bfs(const BOARD &, const Position &, vector<bool> &visited);
  bool isEqualPosition(const Position &);
  vector<Position> getAllPositions(const BOARD &, const char &);
  BOARD updateBoard(const BOARD &, const Position &, const Position &, const char &);
  bool hasWon(const BOARD &, const char &);
  MOVE createMove(const Position &oldPosition, const Position &newPosition);
  void printMove(const MOVE &);
  void printPosition(const Position &, const Position &);
  pair<int, int> getTotalCOCs(const BOARD &, const char &);
  double quadEvaluator(const BOARD &);
  double cocEvaluator(const BOARD &);
  int calculateTotalQuads(const BOARD &, const char &, const int &);
  double hibridEvaluator(const BOARD &);
  int calculatePieceSquareSum(const BOARD &);
  vector<pair<double, pair<MOVE, BOARD>>> getAllMoves(const BOARD &, const char&);

  /* data */
public:
  Player(char, int, int, int);
  void setBoard();
  void clearBoard();
  MOVE getMove();
  void printRandomMove();
  void printAgentMove();
  MOVE randomMove();
  ~Player();
};

double Player::alphaBeta(BOARD &board, char playerType, int depth, double alpha, double beta)
{
  bool hasPlayerWon = hasWon(board, playerType);
  if(hasPlayerWon && playerType == myType){
    return MAX_SCORE - maxAllowedDepth + depth;
  }
  if(hasPlayerWon && playerType == oppositionType){
    return -(MAX_SCORE - maxAllowedDepth + depth);
  }
  if (depth == 0)
  {
    return getScore(board, evaluator);
  }

  vector<pair<double, pair<MOVE, BOARD>>> allMoves = getAllMoves(board, playerType);
  double bestValue;

  if (playerType == myType)
  {
    bestValue = -MAX_SCORE;

    for (int i = 0; i < allMoves.size(); i++)
    {
      double returnScore = alphaBeta(allMoves[i].second.second, oppositionType, depth - 1, alpha, beta);
      if (returnScore > alpha)
      {
        alpha = returnScore;
      }
      if (returnScore > bestValue)
      {
        bestValue = returnScore;
        if(depth == maxAllowedDepth){
          bestMove = allMoves[i].second.first;
          // logFile << "Best Move: ";
          // logFile << bestMove.first.first << " " << bestMove.first.second << " " << bestMove.second.first << " " << bestMove.second.second << endl;
        }
      }
      if (alpha >= beta)
      {
        return bestValue;
      }
      if (timer.timesUp())
      {
        return bestValue;
      }
    }
  }
  else
  {
    bestValue = MAX_SCORE;
    for (int i = 0; i < allMoves.size(); i++)
    {
      double returnScore = alphaBeta(allMoves[i].second.second, myType, depth - 1, alpha, beta);
      if (returnScore < beta)
      {
        beta = returnScore;
      }
      if (returnScore < bestValue)
      {
        bestValue = returnScore;
      }
      if (alpha >= beta)
      {
        return bestValue;
      }
      if (timer.timesUp())
      {
        return bestValue;
      }
    }
  }

  // logFile << "Depth: " << depth << " score: " << bestValue << " Elapsed Time: " << timer.elapsedMilis() << endl;
  return bestValue;
}

BOARD Player::updateBoard(const BOARD &board, const Position &oldPosition, const Position &newPosition, const char &playerType)
{
  BOARD newBoard(board);
  newBoard[oldPosition.row][oldPosition.col] = 'e';
  newBoard[newPosition.row][newPosition.col] = playerType;

  return newBoard;
}

double Player::getScore(const BOARD &board, const int &evaluatorType)
{
  // printBoard(board);
  double score;
  if (evaluatorType == 1)
  {
    score = quadEvaluator(board);
    logFile << "quad: " << score << endl;
  }
  else if (evaluatorType == 2)
  {
    score = cocEvaluator(board);
    logFile << "coc: " << score << endl;
  }
  else if (evaluatorType == 3)
  {
    score = hibridEvaluator(board);
    logFile << "hibrid: " << score << endl;
  }
  else if (evaluatorType == 4)
  {
    score = calculatePieceSquareSum(board);
    logFile << "piece: " << score << endl;
  }
  // logFile << "Score: " << score << endl;
  return score;
}

double Player::cocEvaluator(const BOARD &board)
{
  auto connectednesss = getTotalCOCs(board, this->myType);
  int totalScore = 0;
  totalScore += 12 - connectednesss.first;
  return totalScore;
}

double Player::quadEvaluator(const BOARD &board)
{

  int totalScore = calculateTotalQuads(board, myType, 3) + calculateTotalQuads(board, myType, 4);

  return totalScore;
}

double Player::hibridEvaluator(const BOARD &board)
{
  double totalScore = 0;
  totalScore += 10 + 5 * calculatePieceSquareSum(board);
  // totalScore += 3 * quadEvaluator(board);
  totalScore += cocEvaluator(board);
  return totalScore;
}

int Player::calculatePieceSquareSum(const BOARD &board)
{
  int totalVal = 0;
  for (int i = 0; i < boardSize; i++)
  {
    for (int j = 0; j < boardSize; j++)
    {
      if (board[i][j] == myType)
      {
        if (boardSize == 8)
          totalVal += pieceSquareTable8[i * boardSize + j];
        else if (boardSize == 6)
          totalVal += pieceSquareTable6[i * boardSize + j];
        else
          totalVal += pieceSquareTable4[i * boardSize + j];
      }
      else if (board[i][j] == oppositionType)
      {
        if (boardSize == 8)
          totalVal -= pieceSquareTable8[i * boardSize + j];
        else if (boardSize == 6)
          totalVal -= pieceSquareTable6[i * boardSize + j];
        else
          totalVal -= pieceSquareTable4[i * boardSize + j];
      }
    }
  }
  return totalVal;
}

int Player::calculateTotalQuads(const BOARD &board, const char &playerType, const int &quadSize)
{
  int totalQuads = 0;

  for (int i = 0; i < boardSize - 1; i++)
  {
    for (int j = 0; j < boardSize - 1; j++)
    {
      int totalPlayerType = 0;
      for (int k = i; k < i + 2; k++)
      {
        for (int l = j; l < j + 2; l++)
        {
          if (board[k][l] == playerType)
          {
            totalPlayerType++;
          }
        }
      }
      if (totalPlayerType == quadSize)
        totalQuads++;
    }
  }
  return totalQuads;
}

pair<int, int> Player::getTotalCOCs(const BOARD &board, const char &playerType)
{
  int total = 0;
  vector<Position> myPositions = getAllPositions(board, playerType);

  vector<bool> visited(boardSize * boardSize, false);

  int maxClusterSize = -1;
  int temp;

  for (int i = 0; i < myPositions.size(); i++)
  {
    if (!visited[getIndex(myPositions[i])])
    {
      temp = bfs(board, myPositions[i], visited);
      if (temp > maxClusterSize)
      {
        maxClusterSize = temp;
      }
      total += 1;
    }
  }
  return make_pair(total, maxClusterSize);
}

Player::Player(char myType, int boardSize, int evaluator, int maxAllowedDepth)
{
  this->myType = myType;
  this->boardSize = boardSize;
  this->evaluator = evaluator;
  this->maxAllowedDepth = maxAllowedDepth;
  this->oppositionType = myType == 'r' ? 'b' : 'r';
  this->logFile.open("playerAgent6.log");
  logFile << "My type: " << myType << endl;
  logFile << "Opposition type: " << oppositionType << endl;
  if (boardSize == 6)
  {
    this->timer = Timer(1000);
  }
  else
  {
    this->timer = Timer(2000);
  }
}

Player::~Player()
{
}

vector<int> Player::getTotalActiveCells(const BOARD &board, const int &row, const int &col)
{

  int rowCount = 0, colCount = 0,
      leftDiagonalCount = 0, rightDiagonalCount = 0;

  for (char val : board[row])
  {
    if (val != 'e')
    {
      rowCount += 1;
    }
  }

  for (int i = 0; i < board.size(); i++)
  {
    if (board[i][col] != 'e')
    {
      colCount += 1;
    }
  }

  for (int i = row, j = col; i >= 0 && j >= 0; i--, j--)
  {
    if (board[i][j] != 'e')
    {
      leftDiagonalCount += 1;
    }
  }

  for (int i = row + 1, j = col + 1; i < board.size() && j < board.size(); i++, j++)
  {
    if (board[i][j] != 'e')
    {
      leftDiagonalCount += 1;
    }
  }

  for (int i = row, j = col; i < board.size() && j >= 0; i++, j--)
  {
    if (board[i][j] != 'e')
    {
      rightDiagonalCount += 1;
    }
  }

  for (int i = row - 1, j = col + 1; i >= 0 && j < board.size(); i--, j++)
  {
    if (board[i][j] != 'e')
    {
      rightDiagonalCount += 1;
    }
  }
  //console.log(rowCount, colCount, leftDiagonalCount, rightDiagonalCount);
  vector<int> result;
  result.push_back(rowCount);
  result.push_back(colCount);
  result.push_back(leftDiagonalCount);
  result.push_back(rightDiagonalCount);
  return result;
}

vector<pair<int, int>> Player::getValidMoves(const int &row, const int &col, const BOARD &board)
{
  vector<pair<int, int>> validMoves;

  char myType = board[row][col];
  char oppositionType = myType == 'b' ? 'r' : 'b';
  vector<int> result = getTotalActiveCells(board, row, col);
  int rowCount = result[0], colCount = result[1], leftDiagonalCount = result[2], rightDiagonalCount = result[3];

  struct ValDirection
  {
    bool leftRow = true;
    bool rightRow = true;
    bool upCol = true;
    bool downCol = true;
    bool leftUpDiagonal = true;
    bool rightDownDiagonal = true;
    bool rightUpDiagonal = true;
    bool leftDownDiagonal = true;
  } valDirection;

  for (int i = 1; i <= rowCount - 1; i++)
  {
    if (col - i < 0 || board[row][col - i] == oppositionType)
    {
      valDirection.leftRow = false;
    }

    if (col + i >= board.size() || board[row][col + i] == oppositionType)
    {
      valDirection.rightRow = false;
    }
  }
  if (col - rowCount < 0 || board[row][col - rowCount] == myType)
    valDirection.leftRow = false;
  if (col + rowCount >= board.size() || board[row][col + rowCount] == myType)
    valDirection.rightRow = false;

  for (int i = 1; i <= colCount - 1; i++)
  {
    if (row - i < 0 || board[row - i][col] == oppositionType)
    {
      valDirection.upCol = false;
    }

    if (row + i >= board.size() || board[row + i][col] == oppositionType)
    {
      valDirection.downCol = false;
    }
  }
  if (row - colCount < 0 || board[row - colCount][col] == myType)
    valDirection.upCol = false;
  if (row + colCount >= board.size() || board[row + colCount][col] == myType)
    valDirection.downCol = false;

  for (int i = 1; i <= leftDiagonalCount - 1; i++)
  {
    if (row - i < 0 || col - i < 0 || board[row - i][col - i] == oppositionType)
    {
      valDirection.leftUpDiagonal = false;
    }

    if (row + i >= board.size() || col + i >= board.size() || board[row + i][col + i] == oppositionType)
    {
      valDirection.rightDownDiagonal = false;
    }
  }
  if (row - leftDiagonalCount < 0 || col - leftDiagonalCount < 0 || board[row - leftDiagonalCount][col - leftDiagonalCount] == myType)
    valDirection.leftUpDiagonal = false;
  if (row + leftDiagonalCount >= board.size() || col + leftDiagonalCount >= board.size() || board[row + leftDiagonalCount][col + leftDiagonalCount] == myType)
    valDirection.rightDownDiagonal = false;

  for (int i = 1; i <= rightDiagonalCount - 1; i++)
  {
    if (row + i >= board.size() || col - i < 0 || board[row + i][col - i] == oppositionType)
    {
      valDirection.leftDownDiagonal = false;
    }

    if (row - i < 0 || col + i >= board.size() || board[row - i][col + i] == oppositionType)
    {
      valDirection.rightUpDiagonal = false;
    }
  }
  if (row + rightDiagonalCount >= board.size() || col - rightDiagonalCount < 0 || board[row + rightDiagonalCount][col - rightDiagonalCount] == myType)
    valDirection.leftDownDiagonal = false;
  if (row - rightDiagonalCount < 0 || col + rightDiagonalCount >= board.size() || board[row - rightDiagonalCount][col + rightDiagonalCount] == myType)
    valDirection.rightUpDiagonal = false;

  if (valDirection.leftRow)
    validMoves.push_back(make_pair(
        row,
        col - rowCount));

  if (valDirection.rightRow)
    validMoves.push_back(make_pair(
        row,
        col + rowCount));
  if (valDirection.upCol)
    validMoves.push_back(make_pair(
        row - colCount,
        col));
  if (valDirection.downCol)
    validMoves.push_back(make_pair(
        row + colCount,
        col));
  if (valDirection.leftUpDiagonal)
    validMoves.push_back(make_pair(
        row - leftDiagonalCount,
        col - leftDiagonalCount));
  if (valDirection.rightDownDiagonal)
    validMoves.push_back(make_pair(
        row + leftDiagonalCount,
        col + leftDiagonalCount));
  if (valDirection.leftDownDiagonal)
    validMoves.push_back(make_pair(
        row + rightDiagonalCount,
        col - rightDiagonalCount));
  if (valDirection.rightUpDiagonal)
    validMoves.push_back(make_pair(
        row - rightDiagonalCount,
        col + rightDiagonalCount));

  return validMoves;
}

vector<Position> Player::getAllPositions(const BOARD &board, const char &playerType)
{
  vector<Position> allPostions;
  for (int i = 0; i < boardSize; i++)
  {
    for (int j = 0; j < boardSize; j++)
    {
      if (board[i][j] == playerType)
      {
        allPostions.push_back(Position{i, j});
      }
    }
  }
  return allPostions;
}

vector<pair<double, pair<MOVE, BOARD>>> Player::getAllMoves(const BOARD &board, const char &playerType)
{
  vector<pair<double, pair<MOVE, BOARD>>> allMoves;
  BOARD newBoard;

  for (int i = 0; i < boardSize; i++)
  {
    for (int j = 0; j < boardSize; j++)
    {
      if (board[i][j] == playerType)
      {
        Position selected = Position{i, j};
        vector<pair<int, int>> validMoves = getValidMoves(i, j, board);
        for (int k = 0; k < validMoves.size(); k++)
        {
          Position target = Position{validMoves[k].first, validMoves[k].second};
          newBoard = updateBoard(board, selected, target, playerType);
          double score = getScore(newBoard, 4);
          allMoves.push_back({score, {{{i, j}, validMoves[k]}, newBoard}});
        }
      }
    }
  }
  if (playerType == myType)
  {
    sort(allMoves.rbegin(), allMoves.rend());
  }
  else
  {
    sort(allMoves.begin(), allMoves.end());
  }
  // random_shuffle(allMoves.begin(), allMoves.end());
  return allMoves;
}

MOVE Player::randomMove()
{
  vector<MOVE> totalMoves;
  for (int i = 0; i < boardSize; i++)
  {
    for (int j = 0; j < boardSize; j++)
    {
      if (this->board[i][j] == this->myType)
      {
        vector<pair<int, int>> moves = getValidMoves(i, j, this->board);
        if (moves.size())
        {
          for (pair<int, int> move : moves)
          {
            totalMoves.push_back(make_pair(make_pair(i, j), move));
          }
        }
      }
    }
  }
  return totalMoves[rand() % totalMoves.size()];
}

void Player::printBoard(const BOARD &board)
{
  logFile << "Printing Board: " << endl;
  for (int i = 0; i < board.size(); i++)
  {
    for (int j = 0; j < board[i].size(); j++)
    {
      logFile << board[i][j] << ' ';
    }
    logFile << endl;
  }
  logFile << endl;
  // logFile.flush();
}

void Player::setBoard()
{
  char c;
  for (int i = 0; i < boardSize; i++)
  {
    vector<char> newVector;
    for (int j = 0; j < boardSize; j++)
    {
      cin >> c;
      newVector.push_back(c);
    }
    this->board.push_back(newVector);
  }
  printBoard(board);
}

void Player::printAgentMove()
{
  timer.startTimer();
  double score = alphaBeta(board, myType, maxAllowedDepth, -MAX_SCORE, MAX_SCORE);
  logFile << "total time spent: " << timer.elapsedMilis() << endl;
  printMove(bestMove);
  logFile << "Best Score: " << score << endl;
}

void Player::printRandomMove()
{
  MOVE move = randomMove();
  printMove(move);
}

void Player::printMove(const MOVE &move)
{
  logFile << move.first.first << ' ' << move.first.second << ' '
          << move.second.first << ' ' << move.second.second << endl;
  cout << move.first.first << ' ' << move.first.second << ' '
       << move.second.first << ' ' << move.second.second << endl;
}

void Player::clearBoard()
{
  this->board.clear();
}

bool Player::isValidPosition(const int &row, const int &col)
{
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

vector<Position> Player::getNeighbors(const BOARD &board, const int &row, const int &col)
{
  vector<Position> neighbors;
  char myType = board[row][col];

  Position testPositions[] = {
      Position{row, col : col + 1}, Position{row, col : col - 1}, Position{row : row + 1, col},
      Position{row : row - 1, col}, Position{row : row + 1, col : col + 1}, Position{row : row + 1, col : col - 1},
      Position{row : row - 1, col : col + 1}, Position{row : row - 1, col : col - 1}};

  for (int i = 0; i < 8; i++)
  {
    if (isValidPosition(testPositions[i].row, testPositions[i].col) &&
        board[testPositions[i].row][testPositions[i].col] == myType)
    {
      neighbors.push_back(testPositions[i]);
    }
  }
  return neighbors;
}

int Player::getIndex(const Position &position)
{
  return boardSize * (position.row) + position.col;
}

int Player::bfs(const BOARD &board, const Position &startPosition)
{
  queue<Position> myQueue;
  vector<bool> visited(boardSize * boardSize, false);

  myQueue.push(startPosition);
  visited[getIndex(startPosition)] = true;
  int totalVisited = 0;
  while (!myQueue.empty())
  {
    Position curr = myQueue.front();
    myQueue.pop();
    totalVisited += 1;

    vector<Position> neighbors = getNeighbors(board, curr.row, curr.col);

    for (int i = 0; i < neighbors.size(); i++)
    {
      int indx = getIndex(neighbors[i]);
      if (!visited[indx])
      {
        myQueue.push(neighbors[i]);
        visited[getIndex(neighbors[i])] = true;
      }
    }
  }
  return totalVisited;
}

int Player::bfs(const BOARD &board, const Position &startPosition, vector<bool> &visited)
{
  queue<Position> myQueue;

  myQueue.push(startPosition);
  visited[getIndex(startPosition)] = true;
  int totalVisited = 0;
  while (!myQueue.empty())
  {
    Position curr = myQueue.front();
    myQueue.pop();
    totalVisited += 1;

    vector<Position> neighbors = getNeighbors(board, curr.row, curr.col);

    for (int i = 0; i < neighbors.size(); i++)
    {
      int indx = getIndex(neighbors[i]);
      if (!visited[indx])
      {
        myQueue.push(neighbors[i]);
        visited[getIndex(neighbors[i])] = true;
      }
    }
  }
  return totalVisited;
}

bool Player::hasWon(const BOARD &board, const char &playerType)
{
  int myTotalCells = 0;
  Position startPosition;

  for (int i = 0; i < boardSize; i++)
  {
    for (int j = 0; j < boardSize; j++)
    {
      if (board[i][j] == playerType)
      {
        myTotalCells += 1;
        startPosition.row = i;
        startPosition.col = j;
      }
    }
  }
  return bfs(board, startPosition) == myTotalCells;
}

MOVE Player::createMove(const Position &oldPosition, const Position &newPosition)
{
  return make_pair(make_pair(oldPosition.row, oldPosition.col), make_pair(newPosition.row, newPosition.col));
}

void Player::printPosition(const Position &oldPosition, const Position &newPosition)
{
  logFile << oldPosition.row << " " << oldPosition.col << " " << newPosition.row << " " << newPosition.col << endl;
}