import { useSQLiteContext } from "expo-sqlite";

export type TodoDatabaseProps = {
  id?: number;
  name: string;
  isCompleted?: boolean;
};

export function useTodoDatabase() {
  const database = useSQLiteContext();

  async function create(data: Omit<TodoDatabaseProps, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO todo (name) VALUES ($name)"
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function updateName(data: TodoDatabaseProps) {
    const statement = await database.prepareAsync(
      "UPDATE todo SET name = $name WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $id: data.id ?? 0,
        $name: data.name,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function updateStatus(data: TodoDatabaseProps) {
    const statement = await database.prepareAsync(
      "UPDATE todo SET isCompleted = $isCompleted WHERE id = $id"
    );

    console.log(data);

    try {
      await statement.executeAsync({
        $id: data.id ?? 0,
        $isCompleted: data.isCompleted ?? false,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync("DELETE FROM todo WHERE id = " + id);
    } catch (error) {
      throw error;
    }
  }

  async function findFirst(id: number) {
    try {
      const query = "SELECT * FROM todo WHERE id = ?";

      const response = await database.getFirstAsync<TodoDatabaseProps>(query, [
        id,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function findMany() {
    try {
      const query = "SELECT * FROM todo";

      const response = await database.getAllAsync<TodoDatabaseProps>(query);

      return response;
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    updateName,
    updateStatus,
    remove,
    findFirst,
    findMany,
  };
}
