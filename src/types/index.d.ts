type TaskStateType = "todo" | "inprogress" | "done";

interface Task {
  id: string;
  content: string;
  state: TaskStateType;
}
