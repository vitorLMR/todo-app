import React from 'react';
import { View, Text, Button } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { TodoDatabaseProps } from './database';

interface Props {
    task: TodoDatabaseProps
    deleteTask: (id?: number) => void
    toggleCompleted: (id?: number)=> void
}

export default function TodoItem({ task, deleteTask, toggleCompleted }: Props) {
  return (
    <View>
      <Checkbox
        status={task.isCompleted ? 'checked' : 'unchecked'}
        onPress={() => toggleCompleted(task.id)}
      />
      <Text style={{ textDecorationLine: task.isCompleted ? 'line-through' : 'none' }}>
        {task.name}
      </Text>
      <Button title="X" onPress={() => deleteTask(task.id)} />
    </View>
  );
}