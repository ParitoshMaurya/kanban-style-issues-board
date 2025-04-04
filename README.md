# Trello-style Todo Board

A Kanban-style Todo Board application built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

## Features

- Fetch and display todos from the DummyJSON API
- Create new todos with different statuses
- Edit existing todos
- Change status by dragging and dropping todos between lanes
- Delete todos
- Responsive design that works on various screen sizes

## Technologies Used

- React.js with TypeScript
- Redux Toolkit for state management
- React DnD for drag and drop functionality
- Tailwind CSS for styling
- Vite as the build tool

## Running the Project Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
src/
├── components/         # React components
│   ├── AddTodoForm.tsx # Form for adding new todos
│   ├── TodoBoard.tsx   # Main board with lanes
│   ├── TodoItem.tsx    # Individual todo card
│   └── TodoLane.tsx    # Lane for a specific status
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Redux store setup
│   ├── slices/         # Redux Toolkit slices
│   └── reducers/       # Redux reducers
└── types/              # TypeScript type definitions
```

## Design Decisions and Implementation Details

- Used Redux Toolkit with thunks for clean and consistent state management
- Implemented drag and drop for intuitive status changes
- Used Tailwind CSS for rapid, responsive UI development
- Structured code in a modular way for maintainability and scalability
- Added optimistic UI updates for better user experience

## Future Enhancements

- Add user authentication
- Add due dates for tasks
- Implement task prioritization
- Add filtering and search functionality
- Create personal boards for each user 