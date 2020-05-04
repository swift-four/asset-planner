import React, { Component } from "react";
import PropTypes from "prop-types";
import { AuthConsumer } from "../components/AuthContext";

class CreateBoardForm extends Component {
  state = {
    title: "",
    background: "#80ccff",
  };

  handleSubmit = (e, userId) => {
    e.preventDefault();
    const board = {
      title: this.state.title,
      background: this.state.background,
      createdAt: new Date(),
      user: userId
    };
    if (board.title && board.background && board.user) {
      this.props.createNewBoard(board);
    }
  };

  render() {
    return (
      <AuthConsumer>
        {({ user }) => (
          <form className="create-board-wrapper" onSubmit={(e) => this.handleSubmit(e, user.id)}>
            <input
              type="text"
              name="name"
              placeholder="Enter Board Name"
              //Take the value from the input field for board name and set the state
              onChange={(e) => this.setState({ title: e.target.value })}
            />
            <select
              name="background"
              //Take the value from the dropdown for the board colour and set state
              onChange={(e) => this.setState({ background: e.target.value })}
            >
              <option value="#80ccff">Blue</option>
              <option value="#0cffaa">Green</option>
              <option value="#f94a1e">Red</option>
              <option value="#ffb3ff">Pink</option>
              <option value="#bf00ff">Purple</option>
              <option value="#fffff">White</option>
            </select>
            <button type="submit">Create new board</button>
          </form>
        )}
      </AuthConsumer>
      //Take user input for board name and colour in the home page
    );
  }
}

CreateBoardForm.propTypes = {
  createNewBoard: PropTypes.func.isRequired,
};

export default CreateBoardForm;
