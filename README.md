Chat Application
This is a real-time chat application built with a Spring Boot backend and an Angular frontend. The application allows users to sign up, log in, create chat rooms, join rooms, and send/receive messages in real-time using WebSocket communication. It includes JWT-based authentication for secure access and a responsive UI with toast notifications for user feedback.
Project Structure

Backend: A Spring Boot application handling authentication, room management, and WebSocket-based chat functionality.
Located in Backend/ChatDemo/.
Uses Spring Web, Spring Security, Spring WebSocket, and JPA for data persistence.


Frontend: An Angular application providing the user interface for login, signup, room creation, and chat.
Located in Frontend/chatroonmClient/.
Uses Angular Router, services, and components, with SweetAlert2 for notifications and WebSocket for real-time messaging.



Features

User authentication (signup/login) with JWT.
Create and join chat rooms.
Real-time messaging using WebSocket.
Responsive UI with toast notifications (success/error) for user actions.
Search functionality for rooms.
Date-time formatting for messages.
Secure API endpoints with CORS and JWT filters.

Prerequisites
To run the application, ensure you have the following installed:

Backend:
Java 17 or higher
Maven 3.6+
A relational database (e.g., MySQL, PostgreSQL, or H2 for testing)


Frontend:
Node.js 16+ (with npm)
Angular CLI 19+


General:
Git
A modern web browser



Setup Instructions
Backend Setup

Clone the Repository:
git clone <repository-url>
cd Backend/ChatDemo


Configure Database:

Copy src/main/resources/application.example.properties to application.properties.
Update application.properties with your database configuration (e.g., URL, username, password).spring.datasource.url=jdbc:mysql://localhost:3306/chatdb
spring.datasource.username=your-username
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=update




Configure JWT Secret:

Ensure a secure JWT secret is set in application.properties:jwt.secret=your-secure-secret-key




Build and Run:
mvn clean install
mvn spring-boot:run


The backend will run on http://localhost:9090 (default).



Frontend Setup

Navigate to Frontend Directory:
cd Frontend/chatroonmClient


Install Dependencies:
npm install


Configure Environment:

Update src/environments/environment.ts and environment.development.ts with the backend API URL:export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};




Run the Angular App:
ng serve


The frontend will run on http://localhost:4200 (default).



Running the Application

Start the backend server (mvn spring-boot:run).
Start the frontend server (ng serve).
Open http://localhost:4200 in your browser.
Sign up or log in to access the chat features.

Usage

Sign Up: Create a new account using the signup page (/signup).
Log In: Authenticate using the login page (/login).
Create Room: Navigate to the home page, click the "Create Room" button to create a new chat room (/room/create).
Join Room: Use the search bar to find and join existing rooms.
Chat: Send and receive real-time messages in the chat window.
Notifications: Success (e.g., "Joined to Room") and error (e.g., "Failed to Join Room") messages appear as toast notifications in the top-right corner.

Technologies Used

Backend:
Spring Boot 3.x
Spring Security (JWT authentication)
Spring WebSocket (real-time messaging)
Spring Data JPA (database persistence)
Maven (dependency management)


Frontend:
Angular 19+
SweetAlert2 (toast notifications)
WebSocket (real-time communication)
Tailwind CSS (styling, assumed based on button styles)


Database: Configurable (MongoDB)
Other: Git, Node.js, npm

Project File Structure

Backend/ChatDemo/:
src/main/java/com/chat/: Core application logic, controllers, services, entities, and utilities.
src/main/resources/: Configuration files (application.properties).
pom.xml: Maven dependencies and build configuration.


Frontend/chatroonmClient/:
src/app/: Angular components, services, models, guards, and pipes.
src/environments/: Environment configuration.
angular.json, package.json: Angular project configuration.



Notes

Ensure the backend and frontend are running simultaneously for full functionality.
The routerLink directive is used for navigation in Angular (e.g., <button routerLink="/room/create">).
WebSocket communication is handled via WebSocketChatConfiguration and WebSocketChatcontroler in the backend, with web-socket.service.ts in the frontend.
For production, secure the JWT secret and configure HTTPS.

Troubleshooting

CORS Issues: Ensure CORSConfig.java allows requests from http://localhost:4200.
WebSocket Connection: Verify the WebSocket endpoint (e.g., ws://localhost:8080/chat) is accessible.
Database Errors: Check application.properties for correct database settings.
Angular Build Issues: Run npm install again or clear the cache (npm cache clean --force).

Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.