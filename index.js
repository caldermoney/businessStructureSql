const mysql = require("mysql2");
const inquirer = require("inquirer");

// Create a database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: 'Alpha444$',  // Replace with your MySQL password
  database: 'teamorg_db'  // Replace with your database name
});

// Test the connection
connection.connect((err) => {
  if (err) {
    console.error('An error occurred while connecting to the DB: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

function mainMenu() {
    inquirer
        .prompt([
            {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
            }
        ])
        .then((answer) => {
            let query = '';
            switch (answer.action) {
            case 'View all departments':
                query = 'SELECT * FROM Departments';
                connection.query(query, function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    mainMenu();
                });
                return;

            case 'View all roles':
                query = 'SELECT Roles.job_title, Roles.role_id, Departments.department_name, Roles.salary FROM Roles JOIN Departments';
                connection.query(query, function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    mainMenu();
                });
                return;
                
            case 'View all employees':
                query = 'SELECT Employees.employee_id, Employees.first_name, Employees.last_name, Roles.job_title, Departments.department_name, Roles.salary FROM Employees JOIN Roles, Departments';
                connection.query(query, function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    mainMenu();
                });
                return;



            case 'Add a department':
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'departmentName',
                            message: 'What is the name of the new department?',
                        }
                    ])
                    .then((answer) => {
                        const query = 'INSERT INTO Departments (department_name) VALUES (?)';
                        connection.query(query, [answer.departmentName], function(err, results) {
                            if (err) throw err;
                            console.log(`Added ${answer.departmentName} to Departments.`);
                            mainMenu();
                        });
                    });
                return;


                case 'Add a role': 
                    // Fetch the list of departments
                    connection.query('SELECT department_id, department_name FROM Departments', function(err, departments) {
                        if (err) throw err;

                        // Create an array of department choices with IDs and names
                        const departmentChoices = departments.map(department => ({
                            name: `${department.department_name} (ID: ${department.department_id})`,
                            value: department.department_id
                        }));

                        // Show Inquirer prompt with dynamically populated choices
                        inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'roleTitle',
                                message: 'What is the title of the new role?',
                            },
                            {
                                type: 'input',
                                name: 'roleSalary',
                                message: 'What is the salary of the new role?',
                            },
                            {
                                type: 'list',
                                name: 'departmentId',
                                message: 'Which department does this role belong to?',
                                choices: departmentChoices
                            }
                        ])
                        .then((answer) => {
                            // Updated this SQL query
                            const query = 'INSERT INTO Roles (job_title, salary, department_id) VALUES (?, ?, ?)';
                            // Updated the parameter to departmentId
                            connection.query(query, [answer.roleTitle, answer.roleSalary, answer.departmentId], function(err, results) {
                            if (err) throw err;
                            console.log(`Added role ${answer.roleTitle} with salary ${answer.roleSalary} in department ${answer.departmentId}.`);
                            mainMenu();
                            });
                        });
                    });
                return;

                  
                case 'Add an employee':
                    // Fetch the list of departments
                    connection.query('SELECT role_id, job_title FROM Roles', function(err, roles) {
                        if (err) throw err;

                        // Create an array of department choices with IDs and names
                        const roleChoices = roles.map(role => ({
                            name: `${role.job_title} (ID: ${role.role_id})`,
                            value: role.role_id
                        }));

                        inquirer
                        .prompt([
                            {
                            type: 'input',
                            name: 'firstName',
                            message: 'What is the first name of the new employee?',
                            },
                            {
                            type: 'input',
                            name: 'lastName',
                            message: 'What is the last name of the new employee?',
                            },
                            {
                            type: 'list',
                            name: 'assignedRole',
                            message: 'What is the role of the new employee?',
                            choices: roleChoices
                            }
                        ])
                        .then((answer) => {
                            const query = 'INSERT INTO Employees (first_name, last_name, role_id) VALUES (?, ?, ?)';
                            connection.query(query, [answer.firstName, answer.lastName, answer.assignedRole], function(err, results) {
                            if (err) throw err;
                            console.log(`Added a new employee his name is ${answer.firstName} ${answer.roleSalary} and was assigned ${answer.assignedRole} role`);
                            mainMenu();
                            });
                        });
                    });
                return;

            case 'Update an employee role':
                inquirer
                    .prompt([
                    {
                        type: 'input',
                        name: 'employeeId',
                        message: 'Enter the ID of the employee you want to update:',
                    },
                    {
                        type: 'input',
                        name: 'newRoleId',
                        message: 'Enter the new role ID for this employee:',
                    }
                    ])
                    .then((answer) => {
                    const query = 'UPDATE Employees SET role_id = ? WHERE employee_id = ?';
                    connection.query(query, [answer.newRoleId, answer.employeeId], function(err, results) {
                        if (err) throw err;
                        console.log(`Updated role for employee with ID ${answer.employeeId}.`);
                        mainMenu();
                    });
                    });
                return;
            case 'Exit':
                    connection.end();  // Assuming 'connection' is your MySQL connection object
                break;
            }
        });
    }
    
    // Call the function to display the main menu
    mainMenu();
    
