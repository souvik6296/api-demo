

// const api_key = "proj_fDEbQZ4VYAHNL6luro4dEUir";
const api_key = "n9uCEmenFs2c1Mhc72NAuwULk6pfMTHZ";

const firebase = require("firebase/app");
const firedatabase = require("firebase/database");

const firebaseConfig = {
    databaseURL: "https://medico-d0f60-default-rtdb.firebaseio.com/"
};

const app0 = firebase.initializeApp(firebaseConfig);


const history = async (req, res) => {

    try {
        const database = firedatabase.getDatabase(app0);

        if (database) {

            const chatid = req.body.chatid;
            const dbRef = firedatabase.ref(database);

            const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `WAT/chats/${chatid}`));

            console.log(JSON.stringify(snapshot0));
            res.status(200).send(JSON.stringify(snapshot0));


        }

    } catch (error) {
        console.log(error);
    }

}



const signup = async (req, res) => {
    try {

        const database = firedatabase.getDatabase(app0);

        if (database) {


            const dbRef = firedatabase.ref(database);

            const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `WAT/users`));
            let length = 0;
            let registered = false;
            if (snapshot0.exists()) {
                const data = snapshot0.val();
                console.log(JSON.stringify(data));
                length = Object.keys(data).length;
                for (let i = 0; i < length; i++) {
                    let data2 = data[`user${i}`]["email"];
                    if (req.body.email == data2) {
                        registered = true;
                        break;
                    }
                }

            }

            if (registered) {

                res.status(200).send({ msg: "User with this email id already exist." });
            } else {

                await firedatabase.set(firedatabase.ref(database, `WAT/users/user${length}`), req.body);

                res.status(200).send({ msg: "Signed Up Successfully" });
            }





        }




    } catch (error) {
        console.log(error);
    }
};

const home = async (req, res) => {
    try {

        const request = req.body;
        const plugid = request.plugid;
        const reqquery = request.query;
        const chatid = request.chatid;

        const database = firedatabase.getDatabase(app0);


        const dbRef = firedatabase.ref(database);




        // Function to create a chat session
        async function createChatSession(apiKey, externalUserId) {
            const response = await fetch('https://api.on-demand.io/chat/v1/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify({
                    pluginIds: [],
                    externalUserId: externalUserId
                })
            });

            const data = await response.json();
            return data.data.id; // Extract session ID
        }

        // Function to submit a query using the session ID
        async function submitQuery(apiKey, sessionId, query) {
            const response = await fetch(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify({
                    endpointId: 'predefined-openai-gpt4o',
                    query: query,
                    pluginIds: plugid,
                    responseMode: 'sync'
                })
            });

            const data = await response.json();
            return data;
        }

        async function saveChattoDB(chatid, query, response) {

            const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `WAT/chats/${chatid}`));
            let length = 0;
            if (snapshot0.exists()) {
                const data = snapshot0.val();
                length = Object.keys(data).length;

            }

            const msgdata = {
                user: {
                    msg: query,
                },
                bot: {
                    msg: response
                }

            }

            await firedatabase.set(firedatabase.ref(database, `WAT/chats/${chatid}/chat${length}`), msgdata);

            return true;
        }

        // Example usage
        (async () => {
            const apiKey = api_key;
            const externalUserId = '<replace_external_user_id>';
            const query = reqquery;

            try {
                const sessionId = await createChatSession(apiKey, externalUserId);
                const response = await submitQuery(apiKey, sessionId, query);
                const res2 = await saveChattoDB(chatid, query, response.data.answer);

                if (res2) {

                    const mainquery = `my query was "${query}" and i got response "${response.data.answer}" now give me 5 suggestive question based on this query and response in comma separated list format no extra text.`;
                        
                    
                    const response01 = await submitQuery(apiKey, sessionId, mainquery);


                    console.log(JSON.stringify(response));
                    console.log(JSON.stringify(response01.data.answer));
                    let finallist = response01.data.answer.split(', ');
                    response["suggestion"] = finallist;
                    res.set(200).send(JSON.stringify(response));
                } else {
                    res.set(202).send("Unable to process");

                }
            } catch (error) {
                console.error('Error:', error);
                res.set(200).send(error);
            }
        })();







    } catch (error) {
        console.log(error);

    }
};

const login = (async (req, res) => {

    try {

        const database = firedatabase.getDatabase(app0);

        if (database) {


            const dbRef = firedatabase.ref(database);

            const snapshot0 = await firedatabase.get(firedatabase.child(dbRef, `WAT/users`));
            let length = 0;
            let registered = false;
            if (snapshot0.exists()) {
                const data = snapshot0.val();
                console.log(JSON.stringify(data));
                length = Object.keys(data).length;
                for (let i = 0; i < length; i++) {
                    let email = data[`user${i}`]["email"];
                    let pass = data[`user${i}`]["password"];
                    if (req.body.email == email) {

                        registered = true;
                        if (req.body.password == pass) {
                            res.status(200).send({ msg: "Logged in Successfully" });
                        } else {
                            res.status(200).send({ msg: "Invalid Credentials" });

                        }
                        break;
                    }
                }

            }

            if (!registered) {

                res.status(200).send({ msg: "User does not exist" });
            }





        }




    } catch (error) {
        console.log(error);
    }

});


const url = 'https://real-time-finance-data.p.rapidapi.com/stock-news?symbol=AAPL%3ANASDAQ&language=en';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '9b6e06fc64mshe25a06709575f34p111536jsn0e0e80a6e07b',
    'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
  }
};
const financeTrends = async (req, res) => {
    try {
        const response = await fetch(url, options);
        const result = await response.json(); // parse the response as JSON
        const finalddt = {};

        const len = result.data.news.length; // get the length of the news array
        for (let i = 0; i < len; i++) {
            finalddt[`news${i}`] = { 
                article: result.data.news[i].article_title, 
                url: result.data.news[i].article_url 
            };
        }

        res.status(200).send(finalddt); // send the result as a response
        console.log(finalddt); // log the result

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong!' }); // send error response in case of failure
    }
};


module.exports = { home, signup, login, history, financeTrends };