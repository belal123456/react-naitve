import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  const [filter, setFilter] = useState("All");
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const saveTodos = async (todos) => {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem("@todos", jsonValue);
  };

  const loadTodos = async () => {
    const jsonValue = await AsyncStorage.getItem("@todos");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  };

  const addTodo = async () => {
    if (title && description) {
      const newTodo = {
        id: Date.now().toString(),
        title,
        description,
        status: "Active",
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      setTitle("");
      setDescription("");
      await saveTodos(updatedTodos);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "All") return true;
    return todo.status === filter;
  });

  const markAsDone = (id) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, status: "Done" } : todo))
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  React.useEffect(() => {
    const fetchTodos = async () => {
      const storedTodos = await loadTodos();
      setTodos(storedTodos);
    };
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO APP</Text>
      <TextInput
        style={styles.input}
        placeholder="Todo Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Todo Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>Add Todo</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <View style={styles.filterContainer}>
        {["All", "Active", "Done"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.selectedFilter,
            ]}
            onPress={() => setFilter(status)}
          >
            <Text style={styles.filterText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              style={styles.todoTextContainer}
              onPress={() =>
                navigation.navigate("TodoDetails", {
                  title: item.title,
                  description: item.description,
                })
              }
            >
              <Text style={styles.todoTitle}>{item.title}</Text>
            </TouchableOpacity>
            {item.status === "Active" && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => markAsDone(item.id)}
              >
                <Icon name="done" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeTodo(item.id)}
            >
              <Icon name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="list" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="person" size={24} color="#fff" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    color: "#333",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
  },
  selectedFilter: {
    borderBottomWidth: 2,
    borderBottomColor: "#007aff",
  },
  filterText: {
    fontSize: 18,
    color: "#007aff",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  doneButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#333",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
});
