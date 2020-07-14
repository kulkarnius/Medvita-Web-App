import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "../styles/login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  login = () => {
    const auth = firebase.auth();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((result) => {
      firebase.firestore()
      .collection('doctors').doc(`${result.user.uid}`)
      .get()
      .then((doc) => {
        alert('Logged in ', doc.data().info.fname, ' ', doc.data().info.lname);
        //window.location = "homescreen.html";
      })
      .catch((error) => {
        auth.signOut();
        alert('Incorrect email or password');
      }); 
    }).catch((error) => {
      console.log('Cannot sign in through Firebase Auth');
      alert('Incorrect email or password');
    });
  }

  render() {
    return(
      <>
      <div class="navBar">
        <ul class="nav justify-content-end">
          <li class="nav-item">
            <a class="nav-link" href="signup.html">Create Account</a>
          </li>
        </ul>
      </div>
      <div id="main">
        <h1 class="display-4 text-center m-5">Welcome to Medvita - MD</h1>
        <div class="container">
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email</label>
              <input type="text" class="form-control" id="username" aria-describedby="emailHelp"/>
              <small id="emailHelp" class="form-text">Please enter your email address</small>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="password"/>
            </div>
            <button type="button" class="btn btn-primary" onClick="login()">
              <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
                Login
            </button>  
          </form>
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossorigin="anonymous"/>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"/>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
        integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
        crossorigin="anonymous"/>
      </>
    );
  }
}

export default Login;
