import React, { Component } from "react";
import List from "./List";
import PropTypes from "prop-types";
import { boardsRef, listsRef } from "../firebase";
import { AuthConsumer } from "./AuthContext";
import { DragDropContext } from "react-beautiful-dnd";

class Board extends Component {
	state = {
		currentBoard: {},
		currentLists: [],
		message: "",
	};

	addBoardInput = React.createRef();

	componentDidMount() {
		this.getBoard(this.props.match.params.boardId);
		this.getLists(this.props.match.params.boardId);
	}

	getLists = async (boardId) => {
		try {
			await listsRef
				.where("list.board", "==", boardId)
				.onSnapshot((snapshot) => {
					snapshot.docChanges().forEach((change) => {
						if (change.type === "added") {
							const doc = change.doc;
							const list = {
								id: doc.id,
								title: doc.data().list.title,
							};
							this.setState({
								currentLists: [...this.state.currentLists, list],
							});
						}
						if (change.type === "removed") {
							this.setState({
								currentLists: [
									...this.state.currentLists.filter((list) => {
										return list.id !== change.doc.id;
									}),
								],
							});
						}
					});
				});
		} catch (error) {
			console.log("Error fetching lists:", error);
		}
	};

	getBoard = async (boardId) => {
		try {
			const board = await boardsRef.doc(boardId).get();
			this.setState({ currentBoard: board.data().board });
		} catch (error) {
			this.setState({
				message: "Board not found...",
			});
		}
	};

	createNewList = async (e, userId) => {
		try {
			e.preventDefault();
			const list = {
				title: this.addBoardInput.current.value,
				board: this.props.match.params.boardId,
				createdAt: new Date(),
				user: userId,
			};

			if (list.title && list.board) {
				await listsRef.add({ list });
			}
			this.addBoardInput.current.value = "";
		} catch (error) {
			console.error("Error creating a new list", error);
		}
	};

	deleteBoard = async () => {
		const boardId = this.props.match.params.boardId;
		this.props.deleteBoard(boardId);
		this.setState({
			message: "Board not found...",
		});
	};

	updateBoard = (e) => {
		//Get the board idea from the URL parameters
		const boardId = this.props.match.params.boardId;
		const newTitle = e.currentTarget.value;

		if (boardId && newTitle) {
			this.props.updateBoard(boardId, newTitle);
		}
	};

	onDragEnd = (result) => {
		//To Do
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<React.Fragment>
						{user.id === this.state.currentBoard.user ? (
							<div
								className="board-wrapper"
								style={{ backgroundColor: this.state.currentBoard.background }}>
								{this.state.message === "" ? (
									<div className="board-header">
										<input
											className="board-title"
											type="text"
											name="boardTitle"
											onChange={this.updateBoard}
											defaultValue={this.state.currentBoard.title}></input>
										<div>
											<button className="button-outline">Collapse All</button>
											<button
												onClick={this.deleteBoard}
												className={"button-danger"}>
												Delete Board
											</button>
										</div>
									</div>
								) : (
									<h2>{this.state.message}</h2>
								)}
								<DragDropContext onDragEnd={this.onDragEnd}>
									<div className="lists-wrapper">
										{Object.keys(this.state.currentLists).map((key) => (
											<List
												key={this.state.currentLists[key].id}
												list={this.state.currentLists[key]}
												deleteList={this.props.deleteList}
												id={this.state.currentLists[key].id}
											/>
										))}
									</div>
								</DragDropContext>
								{/* New list button */}
								<form
									onSubmit={(e) => this.createNewList(e, user.id)}
									className="new-list-wrapper">
									<input
										type={this.state.message === "" ? "text" : ""}
										name="name"
										ref={this.addBoardInput}
										placeholder="+ new list"></input>
								</form>
							</div>
						) : (
							<span></span>
						)}
					</React.Fragment>
				)}
			</AuthConsumer>
		);
	}
}

Board.propTypes = {
	deleteBoard: PropTypes.func.isRequired,
	deleteList: PropTypes.func.isRequired,
	updateBoard: PropTypes.func.isRequired,
};

export default Board;
