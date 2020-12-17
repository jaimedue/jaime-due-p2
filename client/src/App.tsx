import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import CreateMessage from './components/Message/CreateMessage';
import EditMessage from './components/Message/EditMessage';

class App extends React.Component {
  state = {
    messages: [],
    token: null,
    message: null,
    user: null
  }

  componentDidMount() {
      this.authenticateUser();
  }

  authenticateUser = () => {
    const token = localStorage.getItem('token');

    if(!token) {
      localStorage.removeItem('user')
      this.setState({ user: null });
    }

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      }
      axios.get('http://localhost:5000/api/auth', config)
        .then((response) => {
          localStorage.setItem('user', response.data.name)
          this.setState(
            {
              user: response.data.name,
              token: token
            },
            () => {
              this.loadData();
            }
          );
        })
        .catch((error) => {
          localStorage.removeItem('user');
          this.setState({ user: null });
          console.error(`Error logging in: ${error}`);
        })
    }
  }

  loadData = () => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios
        .get('http://localhost:5000/api/messages', config)
        .then(response => {
          this.setState({
            messages: response.data
          });
        })
        .catch(error => {
          console.error(`Error fetching data: ${error}`);
        });
    }
  };

  viewMessage = message => {
    console.log(`view ${message.name}`);
    this.setState({
      message: message
    });
  };

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ user: null, token: null });
  }

  onMessageCreated = message => {
    const newMessages = [...this.state.messages, message];
    
    this.setState({
      messages: newMessages
    });
  };

  editMessage = message => {
    this.setState({
      message: message
    });
  };

  onMessageUpdated = message => {
    console.log('updated contact: ', message);
    const newMessages = [...this.state.messages];
    const index = newMessages.findIndex(m => m._id === message._id);

    newMessages[index] = message;

    this.setState({
      messages: newMessages
    });
  };

  deleteMessage = message => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      axios
        .delete(`http://localhost:5000/api/messages/${message._id}`, config)
        .then(response => {
          const newMessages = this.state.messages.filter(m => m._id !== message._id);
          this.setState({
            messages: [...newMessages]
          });
        })
        .catch(error => {
          console.error(`Error deleting contact: ${error}`);
        })
    }
  };

  render() {
    let { user, messages, message, token } = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser
    }

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Contacts</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                {user ? (
                  <Link to="/new-Message">Add New Contact</Link>
                  ) : (
                  <Link to="/register">Register</Link>
                )}
              </li>
              <li>
                {user ? 
                  <Link to="" onClick={this.logOut}>Log out</Link> :
                  <Link to="/login">Log in</Link> 
                }
                
              </li>
            </ul>
          </header>
          <main>
            <Switch>
            <Route exact path="/">
              {user ? (
                <React.Fragment>
                  <div>Hello {user}!</div>
                  <div>
                    {messages.map(message => (
                      <div key={message._id}>
                        <h2>{message.name}</h2>
                        <p>{message.email}</p>
                        <p>{message.phone}</p>
                        <p>{message.notes}</p>
                        <button onClick={() => this.deleteMessage(message)}>Delete</button>
                        <button onClick={() => this.editMessage(message)}>Edit</button>
                  </div>
                    ))}
                  </div>
                </React.Fragment> 
              ) : (
                <React.Fragment>
                  Please Register or Login
                </React.Fragment>
              )}
              
            </Route>
              <Route path="/new-message">
                <CreateMessage token={token} onMessageCreated={this.onMessageCreated} />
              </Route>
              <Route path="/edit-message/:messageId">
                <EditMessage
                token={token}
                message={message}
                onMessageUpdated={this.onMessageUpdated}
                ></EditMessage>
              </Route>
              <Route 
                exact path="/register" 
                render={() => <Register {...authProps} />} />
              <Route 
                exact path="/login" 
                render={() => <Login {...authProps} />} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
