import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Button,
} from 'react-native';
import axios from 'axios';
import AuthContext from './../context/AuthContext';
import SearchBar from 'react-native-dynamic-search-bar';
import EncryptedStorage from 'react-native-encrypted-storage';

function SearchScreen() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const {signOut} = React.useContext(AuthContext);

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.button}>
        <Button
          title="Add friend"
          color={'#32cd32'}
          onPress={() => addFriend(item.email)}
        />
      </View>
    </View>
  );

  const addFriend = async friend_email => {
    const session = await EncryptedStorage.getItem('userSession');
    if (session) {
      const email = JSON.parse(session).email;
      const userAccessToken = JSON.parse(session).token;

      axios({
        method: 'post',
        url: 'http://192.168.88.23:3000/api/v1/users/friend',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userAccessToken,
        },
        data: {
          email: email,
          friend_email: friend_email,
        },
      }).then(
        response => {
          console.log(response.status);
        },
        error => {
          if (error.response.status === 401) {
            console.log('Unauthorized, logging out.');
            signOut();
          } else if (error.response.status === 400) {
            console.log('User already in your friends list!');
          }
        },
      );
    }
  };

  const findFriends = async () => {
    const session = await EncryptedStorage.getItem('userSession');
    if (session) {
      const userAccessToken = JSON.parse(session).token;

      axios({
        method: 'get',
        url: `http://192.168.88.23:3000/api/v1/users/username/${value}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userAccessToken,
        },
      }).then(
        response => {
          setData([response.data]);
        },
        error => {
          if (error.response.status === 401) {
            console.log('Unauthorized, logging out.');
            signOut();
          }
        },
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SearchBar
        style={styles.searchBar}
        placeholder="Enter user name"
        onClearPress={() => {
          setValue('');
          setData([]);
        }}
        onChangeText={text => setValue(text)}
        onSearchPress={() => findFriends()}
      />
      <FlatList
        style={styles.flatList}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginTop: 10,
    marginBottom: 10,
  },
  info: {
    flexGrow: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  username: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  email: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
  },
});

export default SearchScreen;
