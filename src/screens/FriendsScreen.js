import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList,
  Button,
} from 'react-native';
import axios from 'axios';
import AuthContext from './../context/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useIsFocused} from '@react-navigation/native';

function FriendsScreen() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const {signOut} = React.useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    getUserInfo();
    if (isFocused) {
      getUserFriends();
    }
  }, [isFocused]);

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.button}>
        <Button
          title="Delete"
          color={'#ff0000'}
          onPress={() => deleteFriendAlert(item.email)}
        />
      </View>
    </View>
  );

  const singOutAlert = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
          style: 'cancel',
        },
        {
          text: 'Sign out',
          onPress: () => {
            signOut();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const deleteFriendAlert = email => {
    Alert.alert(
      'Delete friend',
      'Are you sure you want to delete your friend?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteFriend(email);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const deleteFriend = async friend_email => {
    const session = await EncryptedStorage.getItem('userSession');
    if (session) {
      const email = JSON.parse(session).email;
      const userAccessToken = JSON.parse(session).token;

      axios({
        method: 'delete',
        url: `http://192.168.88.23:3000/api/v1/users/friend/${email}/${friend_email}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userAccessToken,
        },
      }).then(
        response => {
          getUserFriends();
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

  const getUserFriends = async () => {
    const session = await EncryptedStorage.getItem('userSession');
    if (session) {
      const email = JSON.parse(session).email;
      const userAccessToken = JSON.parse(session).token;

      axios({
        method: 'get',
        url: `http://192.168.88.23:3000/api/v1/users/friends/${email}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userAccessToken,
        },
      }).then(
        response => {
          setData(response.data);
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

  const getUserInfo = async () => {
    const session = await EncryptedStorage.getItem('userSession');
    if (session) {
      setUsername(JSON.parse(session).username);
      setUserEmail(JSON.parse(session).email);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
        <View style={styles.button}>
          <Button title="Sign out" onPress={singOutAlert} />
        </View>
      </View>
      <Text style={styles.header}>Friends</Text>
      <FlatList
        style={styles.flatList}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 10,
    marginBottom: 5,
  },
  info: {
    flexGrow: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
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

export default FriendsScreen;
