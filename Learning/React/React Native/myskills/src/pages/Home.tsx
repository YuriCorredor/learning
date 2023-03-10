import React, { useState } from 'react'
import { 
  FlatList,
  SafeAreaView,
  StyleSheet, 
  Text,
  TextInput, 
  View,
} from 'react-native'
import Button from '../components/Button'
import SkillCard from '../components/SkillCard'

export default function Home() {
  const [newSkill, setNewSkill] = useState<string>('')
  const [mySkills, setMySkills] = useState<Set<string>>(new Set([]))

  const handleAddSkill = () => {
    if (!newSkill) return

    setMySkills((prev) => {
      const newSkills = new Set(prev)
      newSkills.add(newSkill)
      return newSkills
    })

    if (mySkills.has(newSkill)) return
    setNewSkill('')
  }

  const handleRemoveSkill = (skill: string) => {
    setMySkills((prev) => {
      const newSkills = new Set(prev)
      newSkills.delete(skill)
      return newSkills
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome back, Yuri!</Text>
      <TextInput
        value={newSkill}
        onChangeText={setNewSkill}
        style={styles.input}
        placeholder="New skill"
        placeholderTextColor="#777"
      />
      <Button
        title='Add'
        titleStyle={styles.buttonText}
        onPress={handleAddSkill}
        activeOpacity={0.65}
        type='primary'
        style={{ alignSelf: 'flex-end' }}
      />
      <Text style={[styles.title, { marginTop: 30 }]}>My Skills</Text>
      <View
        style={{
          marginTop: 14,
          marginBottom: 10,
          borderBottomColor: '#fff',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
      <FlatList 
        data={[...mySkills]}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <SkillCard skill={item} handlePress={handleRemoveSkill} />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#121015',
  },
  input: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#1f1e25',
    borderRadius: 7,
    color: '#fff'
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
