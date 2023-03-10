import React from 'react'
import { StyleSheet } from 'react-native'
import Button from './Button'

type ComponentProps = {
  skill: string,
  handlePress: (skill: string) => any,
}

export default function SkillCard({ 
  skill,
  handlePress,
}: ComponentProps) {
  return (
    <Button
      title={skill}
      onPress={() => handlePress(skill)}
      titleStyle={styles.skillItem}
    />
  )
}

const styles = StyleSheet.create({
  skillItem: {
    color: '#fff',
    fontSize: 16,
    padding: 15,
    marginVertical: 10,
    borderRadius: 7,
    backgroundColor: '#1f1e25',
  }
})