    function checkCredentials() {
        const email = document.getElementById('email-field').value;
        const password = document.getElementById('password-field').value;
        if (email.includes('admin') && password === 'admin') {
            window.location.href = '../Akory_hotel_Ui/public/dashboard/pages/dashboard.html';
        } else if ( email.includes("client")){
            window.location.href = '../Akory_hotel_Ui/public/index.html'
        }   
         else {
            document.getElementById('error-message').style.display = 'block';
        }
    }