document.addEventListener('DOMContentLoaded', function () {
    // Ensure the page starts at the top
     window.scrollTo(0, 0);
 
     // Fade-in sections on scroll
     const sections = document.querySelectorAll('.fade-in');
     const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
             if (entry.isIntersecting) {
                 entry.target.classList.add('visible');
                 observer.unobserve(entry.target);
             }
         });
     });
     sections.forEach(section => observer.observe(section));
 
   
 
     // EmailJS initialization
     emailjs.init("e9FlhRJjLFXGBd7r7"); // Replace with your EmailJS public key
 
     // Function to get visitor info
     async function getVisitorInfo() {
         try {
             const response = await fetch('https://ipinfo.io/json?token=38a0a1e3004a83'); // Replace with your IP info token
             if (!response.ok) throw new Error('Failed to fetch visitor info');
             return await response.json();
         } catch (error) {
             console.error('Error fetching visitor info:', error);
             return null; // Handle error gracefully
         }
     }
 
     // Notify via EmailJS on page load
     async function notifyVisitor() {
         const visitorInfo = await getVisitorInfo();
         const browserDetails = `${navigator.userAgent} | Platform: ${navigator.platform}`;
 
         const templateParams = {
             email: visitorInfo?.email || 'N/A', // Note: IP info does not usually provide email
             ip: visitorInfo?.ip || 'N/A',
             location: visitorInfo ? `${visitorInfo.city}, ${visitorInfo.region}` : 'N/A',
             isp: visitorInfo?.org || 'N/A',
             browser: browserDetails,
             time: new Date().toLocaleString()
         };
 
         emailjs.send("service_ienmgjl", "template_ntsejph", templateParams)
             .then(function(response) {
                 console.log("Email sent successfully!", response.status, response.text);
             }, function(error) {
                 console.error("Failed to send email:", error);
             });
     }
 
     // Send email on page load
     notifyVisitor();
 
     // Handle contact form submission with validation and EmailJS
     const form = document.getElementById('form');
     form.addEventListener('submit', function (e) {
         e.preventDefault(); // Prevent default form submission
 
         // Form validation logic
         const name = form.name.value.trim();
         const email = form.email.value.trim();
         const message = form.message.value.trim();
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
         if (name === '') {
             alert('Please enter your name.');
             return;
         }
         if (email === '' || !emailRegex.test(email)) {
             alert('Please enter a valid email address.');
             return;
         }
   
         if (message === '') {
             alert('Please enter your message.');
             return;
         }
 
         // Send the form via EmailJS
         emailjs.sendForm('service_2pcybcm', 'template_8vhhy7d', form)
             .then(function () {
                 alert('Message sent successfully!');
                 form.reset(); // Clear the form
             }, function (error) {
                 alert('Failed to send message. Error: ' + JSON.stringify(error));
             });
     });
 });