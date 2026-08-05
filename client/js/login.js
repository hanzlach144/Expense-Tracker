const loginButton = document.getElementById("loginBtn");

loginButton.addEventListener("click", async function () {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response = await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        if (response.ok) {

           // Save JWT
localStorage.setItem("token", data.token);

// Save user (we'll remove this later)
localStorage.setItem("loggedInUser", JSON.stringify(data.user));
            // Redirect to Expense Tracker
            window.location.href = "index.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

});