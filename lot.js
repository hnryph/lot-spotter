// Parking Space Selector
const selectedSpaceElement = document.getElementById('selected-space');
const noneTextElement = selectedSpaceElement.querySelector('.selected-text');
noneTextElement.innerHTML = 'None';
noneTextElement.style.color = 'var(--secondary-color)';

const spaceElements = document.querySelectorAll('.space');

spaceElements.forEach((space) => {
    space.addEventListener('click', () => {
        // Check if the space has a car
        const hasCar = space.getAttribute('data-has-car') === 'true';

        // Only allow spaces without a car to be selected
        if (!hasCar) {
            spaceElements.forEach((el) => {
                el.classList.remove('clicked');
            });

            space.classList.add('clicked');

            // Get the number of selected space
            const selectedText = space.querySelector('h6').textContent;

            // Update selected  text
            noneTextElement.style.color = 'var(--secondary-color)';
            noneTextElement.innerHTML = selectedText;
        }
    });
});

// Fetch data from Lambda function
async function fetchData() {
    try {
        const response = await fetch("#");
        const responseData = await response.json();
        
        const data = JSON.parse(responseData.body);
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
            // If the data is already in an array format, proceed to update the HTML
            updateHTMLFromDatabase(data);
        } else {
            console.log("Unhandled data format. Data:", data);
        }

    } catch (error) {
        console.error("Error retrieving data from the API:", error);
    }
}

// Update HTML based on DynamoDB
function updateHTMLFromDatabase(databaseData) {
    console.log("Updating HTML with database data:", databaseData);
    if (Array.isArray(databaseData)) {
        databaseData.forEach((item) => {
            const id = item.space_id; 
            const hasCar = item.is_full;

            // Match id
            const targetSpaceElement = document.querySelector(`.space[data-space-id="${id}"]`);

            if (targetSpaceElement) {
                // Update data-has-car attribute
                targetSpaceElement.setAttribute('data-has-car', hasCar);

                const carImg = targetSpaceElement.querySelector('img');
                const lotHeader = targetSpaceElement.querySelector('h6');

                // Update display
                if (hasCar) {
                    carImg.style.display = 'block'; // Show car
                    lotHeader.style.display = 'none'; // Hide text
                } else {
                    carImg.style.display = 'none'; // Hide car
                    lotHeader.style.display = 'block'; // Show text
                }
            }
        });
    } else {
        console.error('Data retrieved is not in the expected format (not an array).');
    }
}

// Call fetchData function
fetchData();