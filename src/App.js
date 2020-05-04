import React, { Component } from "react";
import "./App.css";
import Board from "./components/Board";
import Home from "./components/pages/Home";
import { boardsRef, listsRef, cardsRef } from "./firebase";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PageNotFound from "./components/pages/PageNotFound";
import AuthProvider from "./components/AuthContext";
import UserForm from'./components/UserForm'
import Navbar from './components/Navbar'

class App extends Component {
  state = {
    boards: [],
  };

  getBoards = async (userId) => {
    try {
      //set the board state to an empty array
      this.setState({ boards: [] });
      //get the boards from firebase but only once - this doesn't listen to changes
      const boards = await boardsRef.where('board.user', '==', userId).get()
      boards.forEach((board) => {
        const data = board.data().board;
        const boardObj = {
          id: board.id,
          ...data,
        };
        this.setState({ boards: [...this.state.boards, boardObj] });
      });
    } catch (error) {
      console.log("Error getting boards", error);
    }
  };

  // async function to wait until the board has been added to firestore as I need the ID before
  createNewBoard = async (board) => {
    try {
      const newBoard = await boardsRef.add({ board });
      const boardObj = {
        id: newBoard.id,
        ...board,
      };
      this.setState({ boards: [...this.state.boards, boardObj] });
    } catch (error) {
      console.error("Error creating new board: ", error);
    }
  };

  deleteList = async (listId) => {
    try {
      const cards = await cardsRef.where("card.listId", "==", listId).get();
      //check if any cards came back from firestore
      if (cards.docs.length !== 0) {
        cards.forEach((card) => {
          card.ref.delete();
        });
      }
      const list = await listsRef.doc(listId);
      list.delete();
    } catch (error) {
      console.error("Error deleting lists: ", error);
    }
  };

  //delete board
  deleteBoard = async (boardId) => {
    try {
      //filter out all of the lists where the board poperty which is the board we passed in
      const lists = await listsRef.where("list.board", "==", boardId).get();
      //this is a problem where I can't delete boards where theres thing
      if (lists.docs.length !== 0) {
        lists.forEach((list) => {
          this.deleteList(list.ref.id);
        });
      }

      const board = await boardsRef.doc(boardId);

      this.setState({
        board: [
          ...this.state.boards.filter((board) => {
            // don't render out the boards with the boards Id that has been deleted
            return board.id !== boardId;
          }),
        ],
      });

      board.delete();
    } catch (error) {
      console.log("error deleting board: ", error);
    }
  };

  updateBoard = async (boardId, newTitle) => {
    try {
      const board = await boardsRef.doc(boardId);
      board.update({ "board.title": newTitle });
    } catch (error) {
      console.error("Error updating board", error);
    }
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <AuthProvider>
            <Navbar/>
            <Switch>
              <Route 
              exact
              path="/"
              component={UserForm}>
              </Route>
              <Route
                //Dynamic routing for each specific user. UserId passed as a URL parameter
                exact
                path="/:userId/boards"
                //Go to react-dev-tools and inspect match() to find the passed userID value. This is used to render boards based on user.
                render={(props) => (
                  <Home
                    {...props}
                    getBoards={this.getBoards}
                    boards={this.state.boards}
                    createNewBoard={this.createNewBoard}
                  />
                )}
              />

              {/*This renders the board in the browser based on its ID*/}
              <Route
                path="/board/:boardId"
                render={(props) => (
                  <Board
                    {...props}
                    deleteBoard={this.deleteBoard}
                    deleteList={this.deleteList}
                    updateBoard={this.updateBoard}
                  />
                )}
              />

              {/* This is to prevent board not found being displayed even with /board as there is a slash there*/}
              <Route component={PageNotFound} />
            </Switch>
          </AuthProvider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
