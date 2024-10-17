// Wait for the DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('title-image');
    const button = document.getElementById('action-button');

    // Lsitens for when the button is clicked
    button.addEventListener('click', () => {
        // Change the image and button text after the button is clicked
        image.src = 'assets/instructions.png'; // Change to your new image URL
        button.textContent = 'START GAME';

        // Hide the current button and image and then show the new ones aftr 0.3 seconds
        image.style.display = 'none';
        button.style.display = 'none';

        setTimeout(() => {
            // Show the new image and button after a brief delay
            image.style.display = 'block';
            button.style.display = 'inline-block';

            // Change the button behavior to link to Google
            button.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }, 300);
    });
});


