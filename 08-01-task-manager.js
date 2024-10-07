import mysql from 'mysql2/promise';
import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'Maxime',
    password: '2209',
    database: 'tasks',
});
const createTableIfNotExisting = async () => {
    const tableExistsQuery = `
        SELECT COUNT(*) AS count
        FROM information_schema.tables
        WHERE table_schema = 'tasks'
          AND table_name = 'tasks';
    `;

    const [rows] = await connection.execute(tableExistsQuery);
    const tableExisting = rows[0].count > 0;

    if (!tableExisting) {
        const queryToCreateTable = `
            CREATE TABLE tasks
            (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                description varchar(255),
                status      varchar(255),
                created_at  DATE TIME,
                update_at   DATE TIME
            ;
            )
        `;

        await connection.execute(queryToCreateTable);
        console.log("Table 'tasks' created successfully.");
    } else {
        console.log("Table 'tasks' already exists");
    }
};

await createTableIfNotExisting();


const addTask = async (taskDescription) => {
    const addTaskQuery = `
    INSERT INTO tasks (description, status)
    VALUES (?, 'pending');
  `;
    await connection.execute(addTaskQuery, [taskDescription]);
    console.log(`Task added: "${taskDescription}"`);
};

const seeAllTasks = async () => {
    const [rows] = await connection.execute('SELECT * FROM tasks');
    console.log("\nListe des tâches :");
    rows.forEach(task => {
        console.log(`${task.id}. ${task.description} - ${task.status}`);
    });
    console.log(""); // Ligne vide pour la forme
    toDoList();
};

const deleteTask = async (taskId) => {
    const deleteTaskQuery = `
        DELETE FROM tasks
        WHERE id = ?;
    `;
    await connection.execute(deleteTaskQuery, [taskId]);
    console.log(`Task with ID ${taskId} deleted.`);
    toDoList();
};

const changeTaskStatus = async (taskId, newStatus) => {
    const updateTaskQuery = `
    UPDATE tasks
    SET status = ?
    WHERE id = ?;
  `;
    await connection.execute(updateTaskQuery, [newStatus, taskId]);
    console.log(`Task with ID ${taskId} marked as ${newStatus}!`);
    toDoList();
};

function toDoList() {
    rl.question('Press: \n\n1. to see all your tasks \n2. To add a task \n3. To delete a task \n4. To change the status of the task \n5. To Exit the Task Manager \n\n', async (answer) => {
        if (answer === "1") {
            await seeAllTasks();
        } else if (answer === "2") {
            rl.question('\nWhat task do you want to add?\n', async (taskName) => {
                await addTask(taskName);
                toDoList();
            });
        } else if (answer === "3") {
            rl.question('\nWhich task number do you want to delete?\n', async (taskId) => {
                await deleteTask(taskId);
            });
        } else if (answer === "4") {
            rl.question('\nEnter the number of the task you want to change the status:\n', async (taskId) => {
                rl.question('\nEnter the new status for the task ("done", "pending"):\n', async (newStatus) => {
                    await changeTaskStatus(taskId, newStatus);
                });
            });
        } else if (answer === "5") {
            console.log("\nBye Bye!\n");
            rl.close();
        } else {
            console.log('\nWrong Input\n');
            toDoList();
        }
    });
}

console.log("Welcome to your Task Manager\n");
toDoList();
console.log("\n\nMake your choice :");