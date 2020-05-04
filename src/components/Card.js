import React, { Component } from "react";
import PropTypes from "prop-types";
import { cardsRef } from "../firebase";
//import EditCardModal from "./EditCardModal";
import TextareaAutosize from "react-autosize-textarea";
import { AiOutlineForm, AiOutlineDelete } from "react-icons/ai";
import { Draggable } from "react-beautiful-dnd";

class Card extends Component {
	state = {
		modalOpen: false,
	};

	toggleModal = () => {
		this.setState({ modalOpen: !this.state.modalOpen });
	};

	deleteCard = async (e) => {
		try {
			e.preventDefault();
			const cardId = this.props.cardData.id;
			const card = await cardsRef.doc(cardId);
			card.delete();
		} catch (error) {
			console.error("problem deleting card", error);
		}
	};

	updateCardTitle = async (e) => {
		try {
			const cardId = this.props.cardData.id;
			const newTitle = e.currentTarget.value;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.text": newTitle,
			});
		} catch (error) {
			console.log("Error updating card title: ", error);
		}
	};

	updateCardBody = async (e) => {
		try {
			const cardId = this.props.cardData.id;
			const newBody = e.currentTarget.value;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.body": newBody,
			});
		} catch (error) {
			console.log("Error updating card body:", error);
		}
	};

	render() {
		return (
			<React.Fragment>
				<Draggable draggableId={this.props.card.id} index={this.props.index}>
					{(provided) => (
						<div
							className="card-container"
							{...provided.dragHandleProps}
							{...provided.dragHandleProps}
							// innerRef={provided.innerRef}
							ref={provided.innerRef}>
							<div className="card-header">
								<TextareaAutosize
									defaultValue={this.props.cardData.text}
									onChange={this.updateCardTitle}
									name="title"></TextareaAutosize>
								<div className="card-toolbar">
									<AiOutlineDelete
										onClick={this.deleteCard}
										style={{ marginRight: "5px", cursor: "pointer" }}
									/>
									<AiOutlineForm
										onClick={this.toggleModal}
										style={{ cursor: "pointer" }}
									/>
								</div>
							</div>

							{/* <div className="card-labels">
							{this.props.data.labels.map(label => {
								return <span key={label} style={{ background: label}} className="label"></span>
							})}
							</div> */}

							<div className="card-asset">Click to upload</div>

							<div className="card-text-wrapper">
								<textarea
									placeholder="Enter post copy..."
									defaultValue={this.props.cardData.body}
									onChange={this.updateCardBody}
									type="text"
									name="body"></textarea>
							</div>
						</div>
					)}
				</Draggable>

				{/* <EditCardModal
          modalOpen={this.state.modalOpen}
          toggleModal={this.toggleModal}
          cardData={this.props.data}
        /> */}
			</React.Fragment>
		);
	}
}

Card.propTypes = {
	cardData: PropTypes.object.isRequired,
};

export default Card;
