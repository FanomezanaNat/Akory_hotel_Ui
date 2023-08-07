
function checkCredentials() {
        const email = document.getElementById('email-field').value;
        const password = document.getElementById('password-field').value;
        if (email.includes('admin') && password === 'admin') {
            window.location.assign ('./dashboard/template/index.html')
        } else if ( email.includes("client")){
            window.location.assign('./index.html')
        }   
         else {
            document.getElementById('error-message').style.display = 'block';
        }
    }