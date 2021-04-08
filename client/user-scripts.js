/**********************
***** USER SIGNUP *****
***********************/
function userSignUp() {
    //console.log('userSignUp Function Called')

    let userEmail = document.getElementById("emailSignup").value; //pulling input values from DOM
    let userPass = document.getElementById("pwdSignup").value;

    let newUserData = {
        user: {
            email: userEmail,
            password: userPass
        }
    };

    console.log(`newUserData --> ${newUserData.user.email} ${newUserData.user.password}`);

    fetch(`http://localhost:3000/user/register`, {  //fetchin from our user endpoint
        method: "POST",     //using the POST method. Method must match the route
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUserData)
    })
        .then(response => response.json())  //parse the response into JSON
        .then(data => {
            console.log(data);      //log the response
            let token = data.sessionToken;  //we store token info from response in 'token'
            localStorage.setItem('SessionToken', token);    
            tokenChecker();
        })
        .catch(err => {
            console.error(err)
        })
};

/**********************
***** USER LOGIN *****
***********************/
function userLogin() {
    console.log('userLogin Function Called')

    let userEmail = document.getElementById("emailLogin").value;
    let userPass = document.getElementById("pwdLogin").value;

    let userData = {
        user: {
            email: userEmail,
            password: userPass
        }
    };

    console.log(`Login Request w/ userData--> ${userData.user.email} ${userData.user.password}`)

    fetch(`http://localhost:3000/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let token = data.sessionToken;
            localStorage.setItem('SessionToken', token);
            tokenChecker();
        })
        .catch(err => {
            console.error(err)
        })
}

/**********************
***** USER LOGOUT *****
***********************/
function userLogout() {  //the main goal of log out is to get rid of the token that is in localStorage
    console.log('userLogout Function Called')
    localStorage.setItem('SessionToken', undefined); //this is the main functionality. Earlier we set this to 'token'. Now we set it to undefined
    console.log(`sessionToken --> ${localStorage.sessionToken}`);
    tokenChecker();
}

/***************************
** TOKEN CHECKER FUNCTION **
****************************/
function tokenChecker() {
    console.log('tokenChecker Function Called')

    let display = document.getElementById("journals");
    let header = document.createElement('h5');
    let accessToken = localStorage.getItem('SessionToken');
    let alertText = "Log in or sign up to get started!";

    for (let i = 0; i < display.childNodes.length; i++) {
        display.removeChild(display.firstChild);
    }

    if (accessToken === 'undefined') {
        display.appendChild(header);
        header.textContent = alertText;
        header.setAttribute('id', 'defaultLogin');
    } else {
        null
    }
}
tokenChecker()
