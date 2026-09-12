export const users = [
    { userId: "001", fullName: "Harsh sharma", email: "harshsharma@gmail.com", password: "123456", role: "Tech Lead" },
    { userId: "002", fullName: "Harry varma", email: "harry@gmail.com", password: "123456", role: "Frontend Developer" },
    { userId: "003", fullName: "Vivek Kaur", email: "vivek@gmail.com", password: "123456", role: "Senior Developer" }
]

export const tasks = [
    { taskId: "001", projectId: "01", title: "Task 1", description: "Hii this is task 1", status: "toDo", priority: "high" },
    { taskId: "002", projectId: "02", title: "Task 2", description: "Hii this is task 2", status: "inProgress", priority: "low" },
    { taskId: "003", projectId: "03", title: "Task 3", description: "Hii this is task 3", status: "completed", priority: "medium" },
    { taskId: "004", projectId: "02", title: "Task 4", description: "Hii this is task 4", status: "toDo", priority: "high" },
    { taskId: "005", projectId: "01", title: "Task 5", description: "Hii this is task 5", status: "inProgress", priority: "low" },
    { taskId: "006", projectId: "03", title: "Task 6", description: "Hii this is task 6", status: "completed", priority: "medium" }
]

// members now use real seeded user IDs (was ['u1','u2'] — placeholders that didn't
// match any real user, which would've blocked testing invitations/permissions).
export const projects = [
    { projectId: "01", title: "Project 1", description: "Hii this is Project 1", status: "inProgress", dueDate: 'Oct 2', members: ['001', '002'], taskList: ["001", "005"] },
    { projectId: "02", title: "Project 2", description: "Hii this is Project 2", status: "inProgress", dueDate: 'Sep 12', members: ['002', '003'], taskList: ["002", "004"] },
    { projectId: "03", title: "Project 3", description: "Hii this is Project 3", status: "completed", dueDate: 'Nov 5', members: ['001', '003'], taskList: ["003", "006"] }
]

// { invitationId, projectId, senderId, receiverId, status: "pending" | "accepted" | "rejected", createdAt }
export const invitations = []

// { notificationId, userId, type, invitationId, message, isRead, createdAt }
export const notifications = []
