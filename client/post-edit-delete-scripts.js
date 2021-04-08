/**********************
**** POST JOURNAL *****
***********************/
function postJournal() {
    console.log('postJournal Function Called')
    const accessToken = localStorage.getItem('SessionToken') //accessToken set up to store our SessionToken from local storage
    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    let entry = document.getElementById("entry").value;

    let newEntry = {
        journal: {
            title: title,
            date: date,
            entry: entry
        }
    }

    fetch(`http://localhost:3000/journal/create`, {  //always considering our endpoint!
        method: "POST",                              //method matches route
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}` //this is a protected route. We send our token over to authorize access
        }),
        body: JSON.stringify(newEntry)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        console.log(`${accessToken}`)
        displayMine()   //this will display their journal results (...well, later when we add functionality to it)
    })
    .catch(err => {
        console.error(err)
    })
}

/**********************
*** UPDATE JOURNAL ****
***********************/
function editJournal(postId) { //notes in your notebook. Each EDIT button calls this function w/ it's id as the param argument
    console.log(postId);

    const fetch_url = `http://localhost:3000/journal/update/${postId}`; //using ID for custom endpoint
    const accessToken = localStorage.getItem('SessionToken');

    let card = document.getElementById(postId); //accessing whole card by ID
    let input = document.createElement('input');

    //This conditional is called on EACH TIME THE EDIT BUTTON IS PRESSED.
    if (card.childNodes.length < 2) {   //It normally has one childNode of "body", so it will append a place for input.
        card.appendChild(input);
        input.setAttribute("type", "text");
        input.setAttribute("id", "updatedEntry");  //the attributes we set for it here will be used THE NEXT time we hit the edit button
        input.setAttribute("placeholder", "Edit your journal entry");
    } else {
        console.log("Smash that Edit button!")
        let updated = document.getElementById('updatedEntry').value;  //it looks at the value inside of the input
        let updateEntry = {         //then we create an object that carries a journal.entry
            journal: {
                entry: updated
            }
        }

        fetch(fetch_url, {
            method: "PUT",          //we fetch with the PUT method because we're updating information
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}` //definitely need access to change your journal entry!
            }),
            body: JSON.stringify(updateEntry) //turn our object into a string
        })
            .then(response => response.json()) //turn that string into some json!
            .then(data => {
                console.log(data); //need to spend more time seeing the connection between this function and the JournalController endpoint for update
                displayMine();
            })
            .catch(err => {
                console.error(err)
            })
        card.removeChild(card.lastChild)
    }
}

/**********************
*** DELETE JOURNAL ****
***********************/
function deleteJournal(postId) {
    console.log(postId);

    const fetch_url = `http://localhost:3000/journal/delete/${postId}`;
    const accessToken = localStorage.getItem('SessionToken');

    console.log("Does it fetch?");
    fetch(fetch_url, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        })
    })
    .then(response => {
        console.log(response);
        response.json()
    })
    .then(data => {
        console.log(data);
        displayMine();
    })
    .catch(err => {
        console.error(err)
    })
}
