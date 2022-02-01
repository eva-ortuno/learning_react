import React, {Component} from 'react'
import { FiTrash2, FiEdit, FiSave } from "react-icons/fi"
import {v4 as uuidv4} from 'uuid'

// edit/add popup 
class Popup extends Component {
    render() {
      return (
        <div className='popup'>
          <div className='popup-content'>
            <h3>Edit User</h3>
            <label>Change first name : 
                <input type="text"  
                name="first_name"
                onChange={this.onInputchange.bind(this)} 
                value={this.state.first_name}/>
            </label>
            <p></p>
            <label>Change last name : 
                <input type="text" 
                name="last_name"
                onChange={this.onInputchange.bind(this)} 
                value={this.state.last_name}/>
            </label>
            <p></p>
            <label>Change e-mail : 
                <input type="text" 
                name="email"
                onChange={this.onInputchange.bind(this)} 
                value={this.state.email}/>
            </label>
            <div style={{ display: "flex" }}>
                <button  
                    className="styled-button"  
                    onClick={this.props.closePopup}
                    title="Cancel"> Cancel
                </button>
                
                <button  
                    className="styled-button"  
                    onClick={this.onSave.bind(this)}
                    style={{ marginLeft: "auto" }}
                    title="Save user"> <FiSave/>
                </button>
            </div>
          </div>
        </div>
      )
    }
    state = {
        uid: '',
        email: '',
        last_name: '',
        first_name: ''
    }
    componentDidMount() {
        // component mounted - initialize state
        this.setState({
            uid: this.props.uid ? this.props.uid : uuidv4(),
            email: this.props.email ?this.props.email : '',
            last_name: this.props.last_name ? this.props.last_name : '',
            first_name: this.props.first_name ? this.props.first_name : ''
        })
      }
    onInputchange(event) {
        // triggered by input changes - update state
        this.setState({
          [event.target.name]: event.target.value
        })
      }
    onSave() {
        // trigger saving of changes
        this.props.saveUser(this.state)
    }
  }

// main page 
class App extends Component {
    render() {
        return (
            <div>
                <center><h1>Customers List</h1></center>
                <div style={{ display: "flex" }}>
                    <button
                        className="styled-button"  
                        style={{ marginLeft: "auto" }}
                        title='Add user'
                        onClick={this.add.bind(this)}> + 
                    </button>
                </div>
                {this.state.customers.map((cust) => (
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{cust.first_name} {cust.last_name}</h5>
                            <p className="card-text">Email : {cust.email} </p>
                            <p className="card-text">Phone number : {cust.phone_number}</p>
                            <p className="card-text">UID : {cust.uid}</p>
                            <div style={{ display: "flex" }}>
                                <button
                                    className="styled-button"  
                                    style={{ marginLeft: "auto" }}
                                    title="Edit user"
                                    onClick={this.edit.bind(this, cust)}><FiEdit/>
                                </button>
                                <button
                                    className="styled-button"  
                                    style={{ marginLeft: "auto" }}
                                    title="Delete user"
                                    onClick={this.delete.bind(this, cust.uid)}><FiTrash2/>
                                </button>
                            </div>
                        </div>
                    </div>
    
                ))}
                {this.state.editPopup ? 
                    <Popup
                        uid={this.state.editedUser.uid}
                        last_name={this.state.editedUser.last_name}
                        first_name={this.state.editedUser.first_name}
                        email={this.state.editedUser.email}
                        closePopup={this.togglePopup.bind(this)}
                        saveUser={this.saveUser.bind(this)}
                    />
                    : null
                }
            </div>
            
        )
    }

    state = {
        customers: [],
        editPopup: false,
        editedUser: ''
    }

    componentDidMount() {
        // component mounted - fetch data from API and init state
        fetch('https://random-data-api.com/api/users/random_user?size=10')
            .then(res => res.json())
            .then((data) => {
                this.setState({ customers: data })
            })
            .catch(console.log)
    }
    togglePopup() {
        // open/close popup
        this.setState({
            editPopup: !this.state.editPopup
        })
      }
    saveUser(newState) {
        // save user with data from popup
        const otherCustomers = this.state.customers.filter(customer => customer.uid !== newState.uid)
        const editedUser = this.state.customers.filter(customer => customer.uid === newState.uid)
        const userToUpdate = editedUser.length > 0 ? editedUser[0] : {uid: newState.uid}
        const updatedUser =  {...userToUpdate,
            email: newState.email,
            last_name: newState.last_name,
            first_name: newState.first_name
        }
        
        const updatedCustomers = [updatedUser].concat(otherCustomers) // put updated user at the top of the list
        // update state
        this.setState({
            customers: updatedCustomers
        })
        this.togglePopup() // close popup
        console.log('edited user ', newState.uid)

    }
    add(){
        // open popup - set popup state at empty
        this.togglePopup()
        this.setState({editedUser: {}})
    }
    edit(user) {
        // open popup - set popup state to selected user
        this.togglePopup()
        this.setState({editedUser: user})
    }
    delete(uid) {
        // delete user
        const filterData = this.state.customers.filter(customer => customer.uid !== uid)
        this.setState({ customers: filterData }) // update state
        console.log('deleted user', uid)
    }
}

export default App;
