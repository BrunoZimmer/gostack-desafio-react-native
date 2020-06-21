import React, {useEffect, useState} from "react";

import api from './services/api';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const[repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, [])

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);

    const repository = response.data;
    setRepositories([repository, ...repositories.filter((repository) => {return (repository.id !== id)})]);
  }

  async function handleDislikeRepository(id) {
    const response = await api.post(`/repositories/${id}/dislike`);

    const repository = response.data;
    setRepositories([repository, ...repositories.filter((repository) => {return (repository.id !== id)})]);
  }

  async function deleteRepository(id) {
    const response = await api.delete(`/repositories/${id}`);

    setRepositories([...repositories.filter((repository) => {return (repository.id !== id)})]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data = {repositories}
          keyExtractor = {repository => repository.id}
          renderItem = {({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              
              <TouchableOpacity
                style={styles.iconExit}
                testID={`like-button-${repository.id}`}
                onPress = {() => deleteRepository(repository.id)}
              >
                <Icon name="close" size= {20} />
              </TouchableOpacity> 
              
              <View style={styles.titleContainer}>
                <Text key={`title-${repository.id}`} style={styles.repository}>
                  <Icon name="rocket" size= {40} />
                  {" "}{repository.title}
                </Text>
              </View>
              
              <FlatList 
                style = {styles.flatTech}
                data = {repository.techs}
                keyExtractor = {repository => repository.id}
                horizontal = {true}
                renderItem = {({ item:tech }) => (
                  <View style={styles.techsContainer}>
                    <Text 
                      key={`repository-tech-${tech}-${repository.id}`} 
                      style={styles.tech}
                    >
                      {tech}
                    </Text>
                  </View>
                )}
              />
              
              <View style={styles.likesContainer}>
                <View>
                  <Text
                    style={styles.likeText}
                    key={`repository-likes-${repository.id}`}
                  >
                    {repository.likes} Likes
                  </Text>
                </View>
                <View>
                  <Text
                    style={styles.likeText}
                    key={`repository-likes-${repository.id}`}
                  >
                    {repository.dislikes} Dislikes
                  </Text>
                </View>
              </View>



              <View style={styles.likesContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  key={`like-button-${repository.id}`}
                >
                  <Text key={`like-text-${repository.id}`} style={styles.buttonText}>
                    <Icon name="thumbs-o-up" size= {15} />
                    {"  "}Like
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDislikeRepository(repository.id)}
                  key={`dislike-button-${repository.id}`}
                >
                  <Text key={`like-text-${repository.id}`} style={styles.buttonText} >
                    <Icon name="thumbs-o-down" size= {15} borderWidth = {100}/>
                    {"  "}Dislike
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fafafa"
  },
  titleContainer: {
    marginTop: 30,
    marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    marginTop: 20
  },
  flatTech: {
    marginHorizontal: 10
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  iconExit: {
    marginLeft:330,
    marginTop:15,
    marginRight:-30,
    backgroundColor: '#fafafa',
    position: "absolute"
  },
  likesContainer: {
    marginTop: 20,
    margin: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 12,
  },
  likeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 20,
    marginBottom: -10
  },
});
