import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [time, setTime] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });
        setFavorites(favoritedTeachersIds); 
      }
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  )

  async function handleFiltersSumbmit() {
    loadFavorites();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day: weekDay,
        time
      }
    });

    setIsFilterVisible(false);
    setTeachers(response.data);
  }

  function handleToggleFiltersVisible() {
    setIsFilterVisible(!isFilterVisible);
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title="Proffys disponíveis"
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        )}
      >
        {isFilterVisible && ( 
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              placeholderTextColor="#c1bccc" 
              style={styles.input}
              placeholder="Qual a matéria?"
              value={subject}
              onChangeText={text => setSubject(text)}
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  placeholderTextColor="#c1bccc" 
                  style={styles.input}
                  placeholder="Qual o dia?"
                  value={weekDay}
                  onChangeText={text => setWeekDay(text)}
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  placeholderTextColor="#c1bccc" 
                  style={styles.input}
                  placeholder="Qual o horário?"
                  value={time}
                  onChangeText={text => setTime(text)}
                />
              </View>
            </View>

            <RectButton onPress={handleFiltersSumbmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return  (
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher} 
              favorited={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

export default TeacherList;