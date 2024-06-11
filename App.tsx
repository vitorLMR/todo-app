import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import TodoItem from './TodoItem';
import { SQLiteProvider } from 'expo-sqlite';
import { TodoDatabaseProps, initializeDatabase, useTodoDatabase } from './database';


export default function App() {
  const {create,remove,updateStatus, findMany} = useTodoDatabase()
 // State Hooks
 const [tasks, setTasks] = useState<TodoDatabaseProps[]>([]);
const [text, setText] = useState('');
// Function to Add Task
async function addTask() {
  const newTask = { name: text, isCompleted: false };
  const {insertedRowId} = await create(newTask)
  setTasks([...tasks,{...newTask,id: parseInt(insertedRowId)}]);
  setText('');
}
// Function to Delete Task
async function deleteTask(id?: number) {
  if(!id){
    return;
  }
  await remove(id)
  setTasks(tasks.filter(task => task.id !== id));
}
// Function to Toggle Task Completion
async function toggleCompleted(id?: number) {
  const task = tasks.find((task)=> task.id == id);
  if(!id || !task){
    return;
  }
  task.isCompleted = !task.isCompleted
  await updateStatus(task)
  setTasks(tasks.map(task => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)));
}

async function loadTasks(){
  const tasks = await findMany();
  setTasks(tasks);
}


useEffect(()=>{
  loadTasks()
},[])

return (
  <SQLiteProvider databaseName="todo.db" onInit={initializeDatabase}>
<View>
    {tasks.map(task => (
      <TodoItem
        key={task.id}
        task={task}
        deleteTask={deleteTask}
        toggleCompleted={toggleCompleted}
      />
    ))}
    <TextInput
      value={text}
      onChangeText={setText}
      placeholder="New Task"
    />
    <Button title="Add" onPress={addTask} />
  </View>
  </SQLiteProvider>
  
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
