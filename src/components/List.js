import React, { Component } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import { cardsRef, listsRef } from "../firebase";
import { AuthConsumer } from "./AuthContext";
import { AiOutlineDelete } from "react-icons/ai";
import { Droppable } from "react-beautiful-dnd";

class List extends Component {
	state = {
		currentCards: [],
	};

	componentDidMount() {
		this.fetchCards(this.props.list.id);
	}

	fetchCards = async (listId) => {
		try {
			await cardsRef
				.where("card.listId", "==", listId)
				.onSnapshot((snapshot) => {
					snapshot.docChanges().forEach((change) => {
						const doc = change.doc;
						const card = {
							id: doc.id,
							text: doc.data().card.text,
							body: doc.data().card.body,
							labels: doc.data().card.labels,
						};
						if (change.type === "added") {
							this.setState({
								currentCards: [...this.state.currentCards, card],
							});
						}
						if (change.type === "removed") {
							this.setState({
								currentCards: [
									...this.state.currentCards.filter((card) => {
										return card.id !== change.doc.id;
									}),
								],
							});
						}
						if (change.type === "modified") {
							const index = this.state.currentCards.findIndex((item) => {
								return item.id === change.doc.id;
							});

							const cards = [...this.state.currentCards];
							cards[index] = card;
							this.setState({ currentCards: cards });
						}
					});
				});
		} catch (error) {
			console.log("Error fetching cards", error);
		}
	};

	nameInput = React.createRef();

	createNewCard = async (e, userId) => {
		try {
			e.preventDefault();
			// This is where the card gets made, update it to have the image element as well
			const card = {
				text: this.nameInput.current.value,
				body: "",
				listId: this.props.list.id,
				labels: [],
				createdAt: new Date(),
				user: userId,
			};
			//check if the text and id exist first
			if (card.text && card.listId) {
				await cardsRef.add({ card });
			}
			this.nameInput.current.value = "";
			console.log("new card added " + card.text);
		} catch (error) {
			console.error("Error creating new card", error);
		}
	};

	deleteList = () => {
		const listId = this.props.list.id;
		this.props.deleteList(listId);
	};

	updateList = async (e) => {
		try {
			const listId = this.props.list.id;
			const newTitle = e.currentTarget.value;
			const list = await listsRef.doc(listId);
			list.update({ "list.title": newTitle });
		} catch (error) {
			console.error("Error updating list: ", error);
		}
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<div className="list">
						<div className="list-header">
							<input
								type="text"
								name="listTitle"
								onChange={this.updateList}
								defaultValue={this.props.list.title}></input>
							<AiOutlineDelete
								onClick={this.deleteList}
								style={{ cursor: "pointer" }}
							/>
						</div>
						{/* Map through the cards and display them as card components*/}
						<Droppable droppableId={this.props.id}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									// innerRef={provided.innerRef}
									ref={provided.innerRef}>
									{Object.keys(this.state.currentCards).map((key, index) => (
										<Card
											key={key}
											cardData={this.state.currentCards[key]}
											index={index}
											card={this.state.currentCards[key]}
										/>
									))}
									{provided.placeholder}
									{/* Add new card input
									<form onSubmit={(e) => this.createNewCard(e, user.id)}>
										<input
											className="new-card-input"
											type="text"
											ref={this.nameInput}
											name="name"
											placeholder=" + new card"></input>
									</form> */}
								</div>
							)}
						</Droppable>
					</div>
				)}
			</AuthConsumer>
		);
	}
}

List.propTypes = {
	list: PropTypes.object.isRequired,
	deleteList: PropTypes.func.isRequired,
};

export default List;
