import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "../styles/signup.css";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      healthcareid: '',
      speciality: '',
      month: '',
      day: '',
      year: '',
      address: '',
      city: '',
      province: '',
      postalcode: '',
      email: '',
      password: '',
      vpassword: ''
    };
  }

  signup = () => {
    // Checks that entries were filled
    if (Email == '' || password == '' || vpassword == '' || Fname == '' || Lname == '' || Month == ''
    || Day == '' || Year == '' || Address == '' || City == ''|| Province == '' || Postalcode == '' ) {
      document.getElementById('password').value = "";
      document.getElementById('vpassword').value = "";
      return;
    }

    // Incorrect password
    if (password != vpassword) {
      document.getElementById('password').value = "";
      document.getElementById('vpassword').value = "";
      alert("Passwords don't match");
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((result) => {
      const doctoruid = result.user.uid;
      const data = {
        info: {
          fname: this.state.fname,
          lname: this.state.lname,
          email: this.state.email,
          specialty: this.state.specialty,
          healthcareid: this.state.healthcareid,
          uid: doctoruid
        },
        birthday: {
          month: this.state.month,
          day: this.state.day,
          year: this.state.year
        },
        location: {
          address: this.state.address,
          city: this.state.city,
          province: this.state.province,
          postalcode: this.state.postalcode
          //licence: licenseArray
        },
        patients: [],
        availability: []
      };

      firebase.firestore()
      .collection('doctors').doc(`${doctoruid}`)
      .set(data)
      .then(() => {
        console.log(data);
        //window.location = "homescreen.html";
      }).catch((error) => {
        alert('Could not create an account');
        console.log('Error: ', error);
      }); 

    }).catch((error) => {
      console.log('Error: ', error);
      alert('Could not create an account');
    });
  }
  mySubmitHandler = (event) => {
    
  }
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }
  render() {
    return(
      <>
      <div class="navBar">
        <ul class="nav justify-content-end">
          <p class="mb-7 mb-md-9" data-aos="fade-up" data-aos-delay="150">
            <a class="btn btn-outline-light" href="index.html">
              Home
            </a>
          </p>
        </ul>
      </div>
      <div id="main">
        <h1 class="display-3 text-center m-5">Welcome to Medvita!</h1>
        <h3 class="display-5 px-5 pb-5">
          Signup to follow MedVita's journey and get notified of future updates and releases:
        </h3>
        <div class="container">
          <form class="needs-validation" novalidate>
            <div class="form-row">
              <div class="col-md-6 mb-3">
                <label for="fname">
                  First name
                </label>
                <input type="text" class="form-control" name="fname" required/>
                <div class="valid-feedback">Looks good!</div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lname">
                  Last name
                </label>
                <input type="text" class="form-control" name="lname" required/>
                <div class="valid-feedback">Looks good!</div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="healthid">
                  Health-Care ID
                </label>
                <input type="text" class="form-control" name="healthcareid" required/>
                <div class="valid-feedback">Looks good!</div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="practice">
                  Where are you licensed to practice?
                </label>
                <select multiple  class="selectpicker w-100 h-25" name="practice">
                  <option value="Alberta">Alberta</option>
                  <option value="British Columbia">British Columbia</option>
                  <option value="Manitoba">Manitoba</option>
                  <option value="NewBrunswick">New Brunswick</option>
                  <option value="NewFoundLand">Newfoundland and Labrador</option>
                  <option value="NovaScotia">Nova Scotia</option>
                  <option value="Nunavut">Nunavut</option>
                  <option value="Ontario">Ontario</option>
                  <option value="PEI">Prince Edward Island</option>
                  <option value="Quebec">Quebec</option>
                  <option value="Saskatchewan">Saskatchewan</option>
                </select>
                <div class="invalid-feedback">Please select a valid province.</div>
              </div>
              <div class="col-md-12 mb-3">
                <label for="speciality">
                  What is your speciality?
                </label>
                <input type="text" class="form-control" name="speciality" required/>
                <div class="valid-feedback">Looks good!</div>
              </div>
              <div class="col-md-12 mb-3">
                <label for="message">
                  About Me - Message
                </label>
                <input type="text" class="form-control" name="message" required/>
                <div class="valid-feedback">Looks good!</div>
              </div>
            </div>
            <div id="birthday">
              <div class="form-row">
                <div class="col-md-4 mb-3">
                  <label for="month">
                    Birth Month
                  </label>
                  <select class="custom-select" id="month" required>
                    <option selected disabled value="">Choose...</option>
                    <option>January</option><option>February</option>
                    <option>March</option><option>April</option>
                    <option>May</option><option>June</option>
                    <option>July</option><option>August</option>
                    <option>September</option><option>October</option>
                    <option>November</option><option>December</option>
                  </select>
                  <div class="invalid-feedback">Please select a valid month.</div>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="day">
                    Birth Day
                  </label>
                  <select class="custom-select" id="day" required>
                    <option selected disabled value="">Choose...</option>
                    <option>1</option><option>2</option><option>3</option><option>4</option>
                    <option>5</option><option>6</option><option>7</option><option>8</option>
                    <option>9</option><option>10</option><option>11</option><option>12</option>
                    <option>13</option><option>14</option><option>15</option><option>16</option>
                    <option>17</option><option>18</option><option>19</option><option>20</option>
                    <option>21</option><option>22</option><option>23</option><option>24</option>
                    <option>25</option><option>26</option><option>27</option><option>28</option>
                    <option>29</option><option>30</option><option>31</option>
                  </select>
                  <div class="invalid-feedback">Please select a valid day.</div>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="year">
                    Birth Year
                  </label>
                  <select class="custom-select" id="year" required>
                    <option selected disabled value="">Choose...</option>
                    <option>2020</option><option>2019</option><option>2018</option>
                    <option>2017</option><option>2016</option><option>2015</option>
                    <option>2014</option><option>2013</option><option>2012</option>
                    <option>2011</option><option>2010</option><option>2009</option>
                    <option>2008</option><option>2007</option><option>2006</option>
                    <option>2005</option><option>2004</option><option>2003</option>
                    <option>2002</option><option>2001</option><option>2000</option>
                    <option>1999</option><option>1998</option><option>1997</option>
                    <option>1996</option><option>1995</option><option>1994</option>
                    <option>1993</option><option>1992</option><option>1991</option>
                    <option>1990</option><option>1989</option><option>1988</option>
                    <option>1987</option><option>1986</option><option>1985</option>
                    <option>1984</option><option>1983</option><option>1982</option>
                    <option>1981</option><option>1980</option><option>1979</option>
                    <option>1978</option><option>1977</option><option>1976</option>
                    <option>1975</option><option>1974</option><option>1973</option>
                    <option>1972</option><option>1971</option><option>1970</option>
                    <option>1969</option><option>1968</option><option>1967</option>
                    <option>1966</option><option>1965</option><option>1964</option>
                    <option>1963</option><option>1962</option><option>1961</option>
                    <option>1960</option><option>1959</option><option>1958</option>
                    <option>1957</option><option>1956</option><option>1955</option>
                    <option>1954</option><option>1953</option><option>1952</option>
                    <option>1951</option><option>1950</option><option>1949</option>
                    <option>1948</option><option>1947</option><option>1946</option>
                    <option>1945</option><option>1944</option><option>1943</option>
                    <option>1942</option><option>1941</option><option>1940</option>
                    <option>1939</option><option>1938</option><option>1937</option>
                    <option>1936</option><option>1935</option><option>1934</option>
                    <option>1933</option><option>1932</option><option>1931</option>
                    <option>1930</option><option>1929</option><option>1928</option>
                    <option>1927</option><option>1926</option><option>1925</option>
                    <option>1924</option><option>1923</option><option>1922</option>
                    <option>1921</option><option>1920</option><option>1919</option>
                    <option>1918</option><option>1917</option><option>1916</option>
                    <option>1915</option><option>1914</option><option>1913</option>
                    <option>1912</option><option>1911</option><option>1910</option>
                    <option>1909</option><option>1908</option><option>1907</option>
                    <option>1906</option><option>1905</option><option>1904</option>
                    <option>1903</option><option>1902</option><option>1901</option>
                    <option>1900</option>
                  </select>
                  <div class="invalid-feedback">Please select a valid year.</div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-md-12 mb-3">
                <label for="address">
                  Address
                </label>
                <input type="text" class="form-control" id="address" required/>
                <div class="invalid-feedback">Please provide a valid address.</div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-md-6 mb-3">
                <label for="city">
                  City
                </label>
                <input type="text" class="form-control" id="city" required/>
                <div class="invalid-feedback">Please provide a valid city.</div>
              </div>
              <div class="col-md-3 mb-3">
                <label for="province">
                  Province
                </label>
                <select class="custom-select" id="province" required>
                  <option selected disabled value="">Choose...</option>
                  <option>Alberta</option><option>British Columbia</option>
                  <option>Manitoba</option><option>New Brunswick</option>
                  <option>Newfoundland and Labrador</option><option>Nova Scotia</option>
                  <option>Nunavut</option><option>Ontario</option>
                  <option>Prince Edward Island</option><option>Quebec</option>
                  <option>Saskatchewan</option>
                </select>
                <div class="invalid-feedback">Please select a valid province.</div>
              </div>
              <div class="col-md-3 mb-3">
                <label for="pcode">
                  Postal Code
                </label>
                <input type="text" class="form-control" id="pcode" required/>
                <div class="invalid-feedback">Please provide a valid postal code.</div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-md-12 mb-3">
                <label for="email">
                  Email Address
                </label>
                <input type="email" class="form-control" id="email" required/>
                <div class="invalid-feedback">Please provide a valid email address.</div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="password">
                  Password
                </label>
                <input type="password" class="form-control" id="password" required/>
                <div class="invalid-feedback">Please provide a valid password.</div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="valid-password">
                  Confirm Password
                </label>
                <input type="password" class="form-control" id="vpassword" required/>
                <div class="invalid-feedback">Please provide a valid password.</div>
              </div>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required/>
                <label class="form-check-label" for="invalidCheck">
                  <a href="privacyPolicy.html" target="_blank" rel="noopener noreferrer">
                    Agree to Privacy Policy
                  </a> 
                </label>
                <div class="invalid-feedback">You must agree before submitting.</div>
              </div>
            </div>
            <button class="btn btn-primary" type="submit" id="button">
              <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
              Signup
            </button>
          </form>
          {/* <script>
            $(function () {
            $('.selectpicker').selectpicker();
            });
          </script>
          <script>
            // Example starter JavaScript for disabling form submissions if there are invalid fields
            (function() {
              'use strict';
              window.addEventListener('load', function() {
                // Fetch all the forms we want to apply custom Bootstrap validation styles to
                var forms = document.getElementsByClassName('needs-validation');
                // Loop over them and prevent submission
                var validation = Array.prototype.filter.call(forms, function(form) {
                  form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                  }, false);
                });
              }, false);
              signup();
            })();
          </script> */}
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
      <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"/>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/i18n/defaults-*.min.js"/>
      </>
    );
  }
}

export default Signup;
