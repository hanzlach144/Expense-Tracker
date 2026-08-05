const registerButton = document.getElementById("registerBtn");

registerButton.addEventListener("click", async function () {

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || email === "" || password === "") {

        alert("Please fill all fields.");

        return;

    }

    registerButton.disabled = true;
    registerButton.textContent = "Creating Account...";

    try {

        const response = await fetch("http://localhost:3000/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username,
                email,
                password

            })

        });

        const data = await response.json();

        if (response.ok) {


            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

    finally {

        registerButton.disabled = false;
        registerButton.textContent = "Create Account";

    }

});