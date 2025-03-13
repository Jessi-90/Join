/**
 * Fetches the current contacts from the database.
 * @returns {Promise<Array>} The list of current contacts.
 */
async function fetchContacts() {
    try {
        const response = await fetch(`https://da-join-project-default-rtdb.europe-west1.firebasedatabase.app/contacts/counter`);
        if (!response.ok) {
            throw new Error('Failed to fetch contacts from the database');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

/**
 * Pushes the contact data to the database.
 * @param {Object} contactData - The contact data to push.
 */
// async function pushContactToDb(contactData) {
//     try {
//         const response = await fetch(`${BASE_URL}/contacts`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(contactData)
//         });

//         if (!response.ok) {
//             throw new Error('Failed to push contact to the database');
//         }

//         console.log('Contact successfully pushed to the database');
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// export { pushContactToDb };