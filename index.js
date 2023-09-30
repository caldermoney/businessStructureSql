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
                query = 'SELECT Roles.role_id, Roles.job_title, Roles.salary, Departments.department_name FROM Roles JOIN Departments ON Roles.department_id = Departments.department_id';
                connection.query(query, function(err, results) {
                    if (err) throw err;
                    console.table(results);
                    mainMenu();
                });
                return;
                
            case 'View all employees':
                query = 'SELECT * FROM Employees';
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
                    // Fetch all department names and IDs from the database
                    connection.query('SELECT * FROM Departments', function(err, departments) {
                        if (err) throw err;
                        
                        // Create an array of department choices with IDs
                        const departmentChoices = departments.map(department => ({
                        name: department.department_name,
                        value: department.department_id,
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
                            message: 'What is the department ID of the new role?',
                            choices: departmentChoices  // Updated this line
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
                      type: 'input',
                      name: 'assignedRole',
                      message: 'What is the role of the new employee?',
                    }
                  ])
                  .then((answer) => {
                    const query = 'INSERT INTO Employees (first_name, last_name, role_id) VALUES (?, ?, ?)';
                    connection.query(query, [answer.firstName, answer.lastName, answer.assignedRole], function(err, results) {
                      if (err) throw err;
                      console.log(`Added a new employee his name is ${answer.firstName} ${answer.roleSalary} and was assigned ${answer.departmentId} role`);
                      mainMenu();
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
    
