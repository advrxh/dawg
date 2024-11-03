const BACKEND_URL = "https://dawg-t2ik.onrender.com"

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pluginForm');
    const addVariableButton = document.getElementById('addVariable');
    const variablesContainer = document.getElementById('variablesContainer');

    const varTypes = ['string', 'int'];
    const authTypes = ['bearer', 'header', 'key', 'open'];

    function createVariableFields() {
        const variableDiv = document.createElement('div');
        variableDiv.className = 'variable';

        variableDiv.innerHTML = `
            <div class="form-group">
                <label for="varType">Variable Type:</label>
                <select name="varType" required>
                    ${varTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="varName">Variable Name:</label>
                <input type="text" name="varName" required>
            </div>
            <div class="form-group">
                <label for="varEndpoint">Endpoint:</label>
                <input type="url" name="varEndpoint" required>
            </div>
            <div class="form-group">
                <label for="varObject">Object (Optional):</label>
                <input type="text" name="varObject">
            </div>
            <div class="form-group">
                <label for="authType">Auth Type:</label>
                <select name="authType" required>
                    <option value="">None</option>
                    ${authTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            <div class="auth-fields"></div>
            <button type="button" class="delete-variable">Delete Variable</button>
        `;

        const authTypeSelect = variableDiv.querySelector('select[name="authType"]');
        const authFieldsDiv = variableDiv.querySelector('.auth-fields');
        const deleteButton = variableDiv.querySelector('.delete-variable');

        authTypeSelect.addEventListener('change', (e) => {
            const selectedAuthType = e.target.value;
            authFieldsDiv.innerHTML = '';

            if (selectedAuthType === 'bearer') {
                authFieldsDiv.innerHTML = `
                    <div class="form-group">
                        <label for="bearerToken">Bearer Token:</label>
                        <input type="text" name="bearerToken" required>
                    </div>
                `;
            } else if (selectedAuthType === 'header') {
                authFieldsDiv.innerHTML = `
                    <div class="form-group">
                        <label for="headerName">Header Name:</label>
                        <input type="text" name="headerName" required>
                    </div>
                    <div class="form-group">
                        <label for="headerToken">Header Token:</label>
                        <input type="text" name="headerToken" required>
                    </div>
                `;
            } else if (selectedAuthType === 'key') {
                authFieldsDiv.innerHTML = `
                    <div class="form-group">
                        <label for="keyQuery">Key Query:</label>
                        <input type="text" name="keyQuery" required>
                    </div>
                    <div class="form-group">
                        <label for="keyToken">Key Token:</label>
                        <input type="text" name="keyToken" required>
                    </div>
                `;
            }
        });

        deleteButton.addEventListener('click', () => {
            variablesContainer.removeChild(variableDiv);
        });

        variablesContainer.appendChild(variableDiv);
    }

    addVariableButton.addEventListener('click', createVariableFields);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const pluginData = {
            name: formData.get('name'),
            description: formData.get('description'),
            variables: []
        };

        const variables = variablesContainer.querySelectorAll('.variable');
        variables.forEach((variable) => {
            const varData = {
                type: variable.querySelector('select[name="varType"]').value,
                name: variable.querySelector('input[name="varName"]').value,
                endpoint: variable.querySelector('input[name="varEndpoint"]').value,
                object: variable.querySelector('input[name="varObject"]').value || null,
                auth_type: variable.querySelector('select[name="authType"]').value || null,
                auth: null
            };

            if (varData.auth_type === 'bearer') {
                varData.auth = {
                    token: variable.querySelector('input[name="bearerToken"]').value
                };
            } else if (varData.auth_type === 'header') {
                varData.auth = {
                    header: variable.querySelector('input[name="headerName"]').value,
                    token: variable.querySelector('input[name="headerToken"]').value
                };
            } else if (varData.auth_type === 'key') {
                varData.auth = {
                    query: variable.querySelector('input[name="keyQuery"]').value,
                    token: variable.querySelector('input[name="keyToken"]').value
                };
            }

            pluginData.variables.push(varData);
        });

        try {
            const response = await fetch(BACKEND_URL + '/plugins', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pluginData),
            });

            if (!response.ok) {
                throw new Error('Failed to create plugin');
            }

            const result = await response.json();
            console.log('Plugin created:', result);

            // Redirect to the home page
            window.location.href = '/';
        } catch (error) {
            console.error('Error creating plugin:', error);
            alert('Failed to create plugin. Please try again.');
        }
    });
});
