import React, { Component } from 'react'
import BoardPreview from '../BoardPreview'
import PropTypes from 'prop-types'
import CreateBoardForm from '../CreateBoardForm'
//import Navbar from '../Navbar'

class Home extends Component {

    componentDidMount() {
        this.props.getBoards(this.props.match.params.userId)
    }

    render(){
        return(
            <div>
                {/* <Navbar/> */}
                <span>{this.props.match.params.userId}</span>
                <CreateBoardForm createNewBoard={this.props.createNewBoard}/>
                <div className="board-preview-wrapper">
                    {this.props.boards.map((board,key) => (
                        <BoardPreview 
                        key={key}
                        board={board}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

Home.propTypes = {
    getBoards: PropTypes.func.isRequired,
    boards: PropTypes.array.isRequired,
    createNewBoard: PropTypes.func.isRequired
}

export default Home;